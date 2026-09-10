"""
Feature Engineering Module for CampusPulse BI
Constructs domain-specific features for early-warning academic risk detection.
"""

import pandas as pd
import numpy as np

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Takes a raw or preprocessed DataFrame of student attributes and creates engineered features.
    """
    df = df.copy()

    # 1. CGPA Change & Trajectory
    if 'previous_cgpa' in df.columns and 'current_cgpa' in df.columns:
        df['cgpa_change'] = df['current_cgpa'] - df['previous_cgpa']
        df['academic_decline'] = (df['cgpa_change'] < -0.20).astype(int)
        if 'cgpa_trend' not in df.columns:
            df['cgpa_trend'] = np.where(df['cgpa_change'] >= 0.15, 'improving', np.where(df['cgpa_change'] <= -0.15, 'declining', 'stable'))
    else:
        df['cgpa_change'] = 0.0
        df['academic_decline'] = 0
        if 'cgpa_trend' not in df.columns:
            df['cgpa_trend'] = 'stable'

    # 2. Statutory Attendance Gap (distance below 75% mandatory threshold)
    if 'attendance_percentage' in df.columns:
        df['attendance_gap'] = np.maximum(0.0, 75.0 - df['attendance_percentage'])
        df['severe_attendance_deficit'] = (df['attendance_percentage'] < 65.0).astype(int)
    else:
        df['attendance_gap'] = 0.0
        df['severe_attendance_deficit'] = 0

    # 3. Backlog Severity relative to academic progression
    if 'backlogs' in df.columns and 'semester' in df.columns:
        df['backlog_severity'] = df['backlogs'] / (df['semester'] * 0.5 + 1.0)
        df['multiple_backlogs'] = (df['backlogs'] >= 2).astype(int)
    else:
        df['backlog_severity'] = 0.0
        df['multiple_backlogs'] = 0

    # 4. Composite Engagement Index
    ev = df['event_participation'] if 'event_participation' in df.columns else 50.0
    assign = df['assignment_score'] if 'assignment_score' in df.columns else 70.0
    df['engagement_score'] = 0.4 * ev + 0.6 * assign
    df['low_engagement_flag'] = (df['engagement_score'] < 50.0).astype(int)

    # 5. Internal vs Cumulative GPA Consistency
    if 'internal_marks' in df.columns and 'current_cgpa' in df.columns:
        expected_internal = df['current_cgpa'] * 10.0
        df['internal_discrepancy'] = np.maximum(0.0, expected_internal - df['internal_marks'])
    else:
        df['internal_discrepancy'] = 0.0

    # 6. Interaction Feature: Compound Academic and Attendance Vulnerability
    df['compound_vulnerability'] = df['attendance_gap'] * (df['backlogs'] + 1.0)

    return df

FEATURE_DESCRIPTIONS = {
    'cgpa_change': 'Delta between current semester CGPA and previous semester CGPA (negative denotes academic decline)',
    'academic_decline': 'Binary flag indicating acute grade drop (< -0.20 points)',
    'attendance_gap': 'Magnitude of attendance deficit beneath the statutory 75.0% examination threshold',
    'severe_attendance_deficit': 'Binary indicator of attendance falling beneath 65.0% critical detention threshold',
    'backlog_severity': 'Ratio of active backlogs normalized against cumulative semesters completed',
    'multiple_backlogs': 'Binary indicator of carrying 2 or more unresolved course backlogs',
    'engagement_score': 'Weighted blend of co-curricular event participation (40%) and continuous assignment scores (60%)',
    'low_engagement_flag': 'Binary indicator of sub-50 engagement composite',
    'internal_discrepancy': 'Deviation where midterm internal examination marks lag behind historical cumulative CGPA',
    'compound_vulnerability': 'Multiplicative interaction between attendance shortfall and unresolved backlog load',
}

if __name__ == '__main__':
    raw_df = pd.read_csv("ml/data/raw/campus_students_8426.csv")
    engineered = engineer_features(raw_df)
    print(f"Engineered {engineered.shape[1]} features from {raw_df.shape[1]} original features.")
    print("New engineered columns:", [c for c in engineered.columns if c not in raw_df.columns])
