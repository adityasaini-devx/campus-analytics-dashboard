"""
Inference & Prediction Service for CampusPulse BI
Accepts raw student features, computes ML risk probability, Baseline rule score,
and traceable feature explanations.
"""

from typing import Dict, Any
from .explain import RiskExplainer
from .train import calculate_baseline_rule_prediction
import pandas as pd

class PredictionService:
    _instance = None

    def __init__(self):
        self.explainer = RiskExplainer()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = PredictionService()
        return cls._instance

    def predict(self, raw_student: Dict[str, Any]) -> Dict[str, Any]:
        """
        Runs ML prediction, baseline score calculation, and XAI explanation.
        """
        explanation = self.explainer.explain_instance(raw_student)

        # Also calculate the existing transparent Baseline Rule Score for direct comparison
        df_single = pd.DataFrame([raw_student])
        _, baseline_scores = calculate_baseline_rule_prediction(df_single)
        baseline_score = float(baseline_scores[0])

        return {
            'risk_probability': explanation['risk_probability'],
            'risk_level': explanation['risk_level'],
            'baseline_score': round(baseline_score, 3),
            'baseline_level': 'High' if baseline_score >= 0.55 else 'Medium' if baseline_score >= 0.35 else 'Low',
            'risk_factors': explanation['risk_factors'],
            'protective_factors': explanation['protective_factors'],
            'recommendations': explanation['recommendations']
        }

def predict_single(student_dict: Dict[str, Any]) -> Dict[str, Any]:
    service = PredictionService.get_instance()
    return service.predict(student_dict)

if __name__ == '__main__':
    service = PredictionService.get_instance()
    res = service.predict({
        'department': 'Mechanical',
        'semester': 4,
        'attendance_percentage': 72.0,
        'current_cgpa': 7.1,
        'previous_cgpa': 7.3,
        'backlogs': 1,
        'internal_marks': 68.0,
        'assignment_score': 74.0,
        'credits_completed': 84,
        'event_participation': 50.0,
        'skill_score': 65.0,
        'internship_status': 'None',
        'placement_status': 'In Process'
    })
    import pprint
    pprint.pprint(res)
