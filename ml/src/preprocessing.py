"""
Preprocessing Pipeline for CampusPulse BI
Implements clean, leak-free scikit-learn transformations for student tabular features.
"""

import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from .feature_engineering import engineer_features

# Base features to use from the dataset
NUMERICAL_COLS = [
    'attendance_percentage',
    'current_cgpa',
    'previous_cgpa',
    'backlogs',
    'internal_marks',
    'assignment_score',
    'credits_completed',
    'event_participation',
    'skill_score',
    # Engineered numeric columns
    'cgpa_change',
    'attendance_gap',
    'backlog_severity',
    'engagement_score',
    'internal_discrepancy',
    'compound_vulnerability',
    'academic_decline',
    'severe_attendance_deficit',
    'multiple_backlogs',
    'low_engagement_flag'
]

CATEGORICAL_COLS = [
    'department',
    'internship_status',
    'placement_status',
    'cgpa_trend'
]

def build_preprocessor() -> ColumnTransformer:
    """
    Creates a ColumnTransformer pipeline that standardizes numerical values
    and one-hot encodes categorical values without data leakage.
    """
    num_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    cat_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='constant', fill_value='Unknown')),
        ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', num_pipeline, NUMERICAL_COLS),
            ('cat', cat_pipeline, CATEGORICAL_COLS)
        ],
        remainder='drop'
    )
    return preprocessor

def prepare_data(df: pd.DataFrame, is_training: bool = True, preprocessor: ColumnTransformer = None):
    """
    Applies feature engineering, extracts feature matrix X and target y (if present).
    """
    df_feat = engineer_features(df)

    y = df_feat['at_risk'].values if 'at_risk' in df_feat.columns else None

    # Verify all expected columns exist
    for col in NUMERICAL_COLS:
        if col not in df_feat.columns:
            df_feat[col] = 0.0
    for col in CATEGORICAL_COLS:
        if col not in df_feat.columns:
            df_feat[col] = 'Unknown'

    if is_training:
        preprocessor = build_preprocessor()
        X_trans = preprocessor.fit_transform(df_feat)
        return X_trans, y, preprocessor
    else:
        if preprocessor is None:
            raise ValueError("Preprocessor must be provided when is_training=False")
        X_trans = preprocessor.transform(df_feat)
        return X_trans, y

def get_transformed_feature_names(preprocessor: ColumnTransformer) -> list[str]:
    """
    Retrieves human-readable feature names after one-hot encoding and scaling.
    """
    names = []
    # Numeric features
    names.extend(NUMERICAL_COLS)
    # Categorical features
    cat_encoder = preprocessor.named_transformers_['cat'].named_steps['encoder']
    cat_feature_names = cat_encoder.get_feature_names_out(CATEGORICAL_COLS)
    names.extend(list(cat_feature_names))
    return names
