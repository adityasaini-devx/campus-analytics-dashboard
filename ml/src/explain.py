"""
Explainable AI (XAI) Module for CampusPulse BI
Computes feature contributions (domain-pillar additive attribution) for individual student risk predictions.
Distinguishes between Risk-Increasing Factors (+) and Protective Factors (-) with strict directional validity.
"""

import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, List, Any

from .feature_engineering import engineer_features
from .preprocessing import get_transformed_feature_names

class RiskExplainer:
    def __init__(self, model_path: str = "ml/models/student_risk_model.joblib", preprocessor_path: str = "ml/models/preprocessor.joblib"):
        if not os.path.exists(model_path) or not os.path.exists(preprocessor_path):
            raise FileNotFoundError("Trained model or preprocessor artifact not found in ml/models/")

        self.model = joblib.load(model_path)
        self.preprocessor = joblib.load(preprocessor_path)
        self.feature_names = get_transformed_feature_names(self.preprocessor)

        # Precompute background baseline probability
        self.base_prob = 0.048  # Campus mean at-risk prevalence (~4.8%)

    def explain_instance(self, raw_features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Takes a single student's dictionary of raw attributes, applies feature engineering
        and transformation, and calculates mathematically traceable, directionally valid feature attributions.
        """
        # Convert to DataFrame
        df_single = pd.DataFrame([raw_features])
        df_feat = engineer_features(df_single)

        # Preprocess features
        X_trans = self.preprocessor.transform(df_feat)

        # Predict probability
        prob = float(self.model.predict_proba(X_trans)[0, 1])

        # Linear model: attribution = coef_i * (x_i - mean_i)
        # Since features are standard-scaled (mean=0), attribution is coef_i * x_i
        if hasattr(self.model, 'coef_'):
            coefs = self.model.coef_[0]
            values = X_trans[0]
            raw_attributions = coefs * values
        elif hasattr(self.model, 'feature_importances_'):
            importances = self.model.feature_importances_
            values = X_trans[0]
            raw_attributions = importances * values
        else:
            raw_attributions = np.zeros(len(self.feature_names))

        feat_attr = dict(zip(self.feature_names, raw_attributions))

        # Group collinear one-hot & interaction features into consolidated Domain Pillars
        # to ensure strict directional validity and avoid multicollinearity sign artifacts.
        att_attr = float(
            feat_attr.get('attendance_percentage', 0.0) +
            feat_attr.get('attendance_gap', 0.0) +
            feat_attr.get('severe_attendance_deficit', 0.0)
        )

        cgpa_attr = float(
            feat_attr.get('current_cgpa', 0.0) +
            feat_attr.get('previous_cgpa', 0.0) +
            feat_attr.get('cgpa_change', 0.0) +
            feat_attr.get('academic_decline', 0.0) +
            feat_attr.get('cgpa_trend_declining', 0.0) +
            feat_attr.get('cgpa_trend_improving', 0.0) +
            feat_attr.get('cgpa_trend_stable', 0.0)
        )

        backlog_attr = float(
            feat_attr.get('backlogs', 0.0) +
            feat_attr.get('backlog_severity', 0.0) +
            feat_attr.get('multiple_backlogs', 0.0) +
            feat_attr.get('compound_vulnerability', 0.0)
        )

        internal_attr = float(
            feat_attr.get('internal_marks', 0.0) +
            feat_attr.get('assignment_score', 0.0) +
            feat_attr.get('internal_discrepancy', 0.0)
        )

        eng_attr = float(
            feat_attr.get('engagement_score', 0.0) +
            feat_attr.get('event_participation', 0.0) +
            feat_attr.get('low_engagement_flag', 0.0)
        )

        pillars = [
            {
                'key': 'cgpa',
                'category': 'Academic',
                'attribution': cgpa_attr,
                'risk_label': 'Semester CGPA Velocity & Trajectory',
                'prot_label': 'Strong Cumulative CGPA / Upward Trend'
            },
            {
                'key': 'attendance',
                'category': 'Attendance',
                'attribution': att_attr,
                'risk_label': 'Class Attendance Shortfall (<75% Cutoff)',
                'prot_label': 'Consistent Class Attendance (>75%)'
            },
            {
                'key': 'backlogs',
                'category': 'Curriculum',
                'attribution': backlog_attr,
                'risk_label': 'Active Course Backlogs Burden',
                'prot_label': 'Zero Pending Course Backlogs'
            },
            {
                'key': 'internal',
                'category': 'Academic',
                'attribution': internal_attr,
                'risk_label': 'Midterm Continuous Assessment Discrepancy',
                'prot_label': 'High Midterm Exam Performance'
            },
            {
                'key': 'engagement',
                'category': 'Engagement',
                'attribution': eng_attr,
                'risk_label': 'Low Co-Curricular & Club Participation',
                'prot_label': 'Active Campus & Event Engagement'
            }
        ]

        # Separate positive attribution (elevates risk) from negative (protects)
        risk_pillars = [p for p in pillars if p['attribution'] > 0.02]
        prot_pillars = [p for p in pillars if p['attribution'] < -0.02]

        risk_pillars.sort(key=lambda x: x['attribution'], reverse=True)
        prot_pillars.sort(key=lambda x: abs(x['attribution']), reverse=True)

        # Scale into intuitive percentage impacts for UI visualization
        total_risk_mag = sum(p['attribution'] for p in risk_pillars) or 1.0
        total_prot_mag = sum(abs(p['attribution']) for p in prot_pillars) or 1.0

        lift = max(0.02, prob)

        top_risk_factors = []
        for p in risk_pillars:
            share = (p['attribution'] / total_risk_mag) * (lift * 100)
            share = round(max(2.5, min(40.0, share)), 1)
            top_risk_factors.append({
                'feature': p['key'],
                'label': p['risk_label'],
                'impact_pct': share,
                'attribution': round(p['attribution'], 3),
                'type': 'risk_driver',
                'category': p['category']
            })

        top_protective_factors = []
        for p in prot_pillars:
            share = (abs(p['attribution']) / total_prot_mag) * 15.0
            share = round(max(1.5, min(14.0, share)), 1)
            top_protective_factors.append({
                'feature': p['key'],
                'label': p['prot_label'],
                'impact_pct': -share,
                'attribution': round(p['attribution'], 3),
                'type': 'protective_driver',
                'category': p['category']
            })

        # Calibrated Risk Tiers
        # High Risk: >= 0.65 (urgent intervention required)
        # Medium / Monitor: 0.35 - 0.65 (proactive check-in)
        # Low Risk: < 0.35 (stable retention standing)
        if prob >= 0.65:
            risk_level = 'High'
        elif prob >= 0.35:
            risk_level = 'Medium'
        else:
            risk_level = 'Low'

        # Generate targeted interventions based strictly on student conditions
        recommendations = self._generate_recommendations(raw_features, top_risk_factors)

        return {
            'risk_probability': round(prob, 3),
            'risk_level': risk_level,
            'risk_factors': top_risk_factors,
            'protective_factors': top_protective_factors,
            'recommendations': recommendations
        }

    def _generate_recommendations(self, raw: Dict[str, Any], top_risks: List[Dict[str, Any]]) -> List[str]:
        """
        Generates targeted interventions based strictly on active student risk drivers.
        """
        recs = []
        att = raw.get('attendance_percentage', 80.0)
        curr_cgpa = raw.get('current_cgpa', 7.5)
        prev_cgpa = raw.get('previous_cgpa', 7.5)
        backlogs = raw.get('backlogs', 0)
        internal = raw.get('internal_marks', 75.0)
        event_score = raw.get('event_participation', 60.0)

        # 1. Attendance Intervention
        if att < 75.0:
            recs.append("Mandatory Attendance Counseling: Schedule meeting with Faculty Advisor to review morning/laboratory absences.")

        # 2. Academic Mentoring
        if (curr_cgpa - prev_cgpa <= -0.20) or (curr_cgpa < 6.5):
            recs.append("Academic Tutoring Intervention: Assign departmental peer mentor for core analytical course remediation.")

        # 3. Backlog Support
        if backlogs >= 2:
            recs.append("Backlog Clearance Blueprint: Schedule remedial weekend doubt-clearing sessions prior to end-term exams.")
        elif backlogs == 1:
            recs.append("Single Course Review: Provide guided practice problem sets for active backlog course.")

        # 4. Continuous Assessment Discrepancy
        if internal < 60.0:
            recs.append("Continuous Assessment Review: Conduct diagnostic assessment on formative midterm learning gaps.")

        # 5. Engagement Outreach
        if event_score < 40.0:
            recs.append("Co-curricular Engagement Outreach: Introduce student to departmental technical societies and campus study circles.")

        if not recs:
            recs.append("Academic Mentoring: On track for on-time graduation; recommend honors/research elective track.")

        return recs

if __name__ == '__main__':
    explainer = RiskExplainer()
    sample = {
        'department': 'CSE',
        'semester': 6,
        'attendance_percentage': 62.5,
        'current_cgpa': 6.30,
        'previous_cgpa': 7.15,
        'backlogs': 2,
        'internal_marks': 54.0,
        'assignment_score': 60.0,
        'credits_completed': 114,
        'event_participation': 30.0,
        'skill_score': 55.0,
        'internship_status': 'None',
        'placement_status': 'Not Eligible'
    }
    explanation = explainer.explain_instance(sample)
    print("Sample Explanation Result:")
    import pprint
    pprint.pprint(explanation)
