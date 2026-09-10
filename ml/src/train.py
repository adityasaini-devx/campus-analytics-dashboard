"""
Model Training & Benchmarking Pipeline for CampusPulse BI
Trains Logistic Regression, Random Forest, and Gradient Boosting models on stratified 80/20 split.
Evaluates Precision, Recall (At-Risk), F1, ROC-AUC, and benchmarks against Baseline Rule Model.
"""

import os
import json
from datetime import datetime
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report
)

from .feature_engineering import engineer_features
from .preprocessing import build_preprocessor, NUMERICAL_COLS, CATEGORICAL_COLS

def calculate_baseline_rule_prediction(df_test: pd.DataFrame) -> np.ndarray:
    """
    Evaluates the existing frontend rule formula on the test set:
    Attendance (30%) + Academic Trend (35%) + Backlogs (20%) + Engagement (15%)
    """
    att = df_test['attendance_percentage'].values
    cgpa = df_test['current_cgpa'].values
    cgpa_diff = (df_test['current_cgpa'] - df_test['previous_cgpa']).values
    backlogs = df_test['backlogs'].values
    ev = df_test['event_participation'].values if 'event_participation' in df_test.columns else np.full(len(df_test), 50.0)

    # Component risk scores scaled between 0 and 1
    att_risk = np.clip((75.0 - att) / 25.0, 0.0, 1.0)
    cgpa_risk = np.clip(np.maximum(0.0, -cgpa_diff * 2.0) * 0.6 + np.maximum(0.0, 6.8 - cgpa) / 2.5 * 0.4, 0.0, 1.0)
    backlog_risk = np.clip(backlogs / 3.0, 0.0, 1.0)
    eng_risk = np.clip((50.0 - ev) / 40.0, 0.0, 1.0)

    composite_baseline = 0.30 * att_risk + 0.35 * cgpa_risk + 0.20 * backlog_risk + 0.15 * eng_risk
    # Decision threshold for binary baseline rule
    preds = (composite_baseline >= 0.42).astype(int)
    return preds, composite_baseline

def train_and_evaluate():
    print("=" * 70)
    print("CAMPUSPULSE BI: ML MODEL TRAINING & BENCHMARKING PIPELINE")
    print("=" * 70)

    # 1. Load Dataset
    data_path = "ml/data/raw/campus_students_8426.csv"
    if not os.path.exists(data_path):
        from .dataset_generator import generate_campus_dataset
        generate_campus_dataset(data_path)

    raw_df = pd.read_csv(data_path)
    print(f"Loaded {len(raw_df)} student records.")
    print(f"Class distribution: {raw_df['at_risk'].value_counts().to_dict()}")

    # 2. Stratified Train/Test Split (80/20)
    train_df, test_df = train_test_split(
        raw_df,
        test_size=0.20,
        stratify=raw_df['at_risk'],
        random_state=42
    )

    # Save processed splits
    os.makedirs("ml/data/processed", exist_ok=True)
    train_df.to_csv("ml/data/processed/train_students.csv", index=False)
    test_df.to_csv("ml/data/processed/test_students.csv", index=False)
    print(f"Stratified Split: Train={len(train_df)} records, Test={len(test_df)} records")

    # 3. Apply Feature Engineering
    train_feat = engineer_features(train_df)
    test_feat = engineer_features(test_df)

    # 4. Fit Preprocessor exclusively on Training Set
    preprocessor = build_preprocessor()
    X_train = preprocessor.fit_transform(train_feat)
    y_train = train_feat['at_risk'].values

    X_test = preprocessor.transform(test_feat)
    y_test = test_feat['at_risk'].values

    # 5. Evaluate Baseline Rule Model on Test Set
    baseline_preds, baseline_scores = calculate_baseline_rule_prediction(test_df)
    baseline_acc = float(accuracy_score(y_test, baseline_preds))
    baseline_prec = float(precision_score(y_test, baseline_preds, zero_division=0))
    baseline_rec = float(recall_score(y_test, baseline_preds, zero_division=0))
    baseline_f1 = float(f1_score(y_test, baseline_preds, zero_division=0))
    baseline_auc = float(roc_auc_score(y_test, baseline_scores))
    baseline_cm = confusion_matrix(y_test, baseline_preds).tolist()

    # 6. Initialize & Train Candidate Models
    models = {
        'Logistic Regression': LogisticRegression(
            class_weight='balanced',
            max_iter=1000,
            C=0.8,
            random_state=42
        ),
        'Random Forest': RandomForestClassifier(
            n_estimators=150,
            max_depth=8,
            min_samples_split=4,
            class_weight='balanced_subsample',
            random_state=42,
            n_jobs=-1
        ),
        'Gradient Boosting': GradientBoostingClassifier(
            n_estimators=120,
            learning_rate=0.08,
            max_depth=4,
            subsample=0.85,
            random_state=42
        )
    }

    results = {}
    best_model_name = None
    best_f1 = -1.0
    best_model = None

    print("\n--- MODEL BENCHMARKING RESULTS (TEST SET: n=1,686) ---")
    print(f"{'Model':<22} | {'Accuracy':<9} | {'Precision':<9} | {'Recall':<9} | {'F1-Score':<9} | {'ROC-AUC':<9}")
    print("-" * 75)

    # Print baseline first
    print(f"{'Baseline Rule Model':<22} | {baseline_acc:<9.3f} | {baseline_prec:<9.3f} | {baseline_rec:<9.3f} | {baseline_f1:<9.3f} | {baseline_auc:<9.3f}")

    for name, clf in models.items():
        clf.fit(X_train, y_train)

        preds = clf.predict(X_test)
        probs = clf.predict_proba(X_test)[:, 1]

        acc = float(accuracy_score(y_test, preds))
        prec = float(precision_score(y_test, preds, zero_division=0))
        rec = float(recall_score(y_test, preds, zero_division=0))
        f1 = float(f1_score(y_test, preds, zero_division=0))
        auc = float(roc_auc_score(y_test, probs))
        cm = confusion_matrix(y_test, preds).tolist()

        results[name] = {
            'accuracy': round(acc, 4),
            'precision': round(prec, 4),
            'recall': round(rec, 4),
            'f1_score': round(f1, 4),
            'roc_auc': round(auc, 4),
            'confusion_matrix': {
                'tn': cm[0][0], 'fp': cm[0][1],
                'fn': cm[1][0], 'tp': cm[1][1]
            }
        }

        print(f"{name:<22} | {acc:<9.3f} | {prec:<9.3f} | {rec:<9.3f} | {f1:<9.3f} | {auc:<9.3f}")

        # Model Selection criterion: Highest F1-score with prioritized Recall
        # In early warning, F1 with high recall for At-Risk is paramount
        composite_score = 0.6 * f1 + 0.4 * rec
        if composite_score > best_f1:
            best_f1 = composite_score
            best_model_name = name
            best_model = clf

    print("-" * 75)
    print(f"Selected Champion Model: {best_model_name}")

    # 7. Extract Feature Importances from Champion Model
    cat_encoder = preprocessor.named_transformers_['cat'].named_steps['encoder']
    cat_feature_names = cat_encoder.get_feature_names_out(CATEGORICAL_COLS)
    all_feature_names = NUMERICAL_COLS + list(cat_feature_names)

    if hasattr(best_model, 'feature_importances_'):
        importances = best_model.feature_importances_
    else:
        importances = np.abs(best_model.coef_[0])

    feat_imp = sorted(
        [{'feature': f, 'importance': round(float(imp), 4)} for f, imp in zip(all_feature_names, importances)],
        key=lambda x: x['importance'],
        reverse=True
    )

    # 8. Compile Comprehensive Metadata Payload
    metrics_payload = {
        'timestamp': datetime.now().isoformat(),
        'champion_model': best_model_name,
        'model_version': 'v1.2-enterprise',
        'training_records': len(train_df),
        'test_records': len(test_df),
        'metrics': results[best_model_name],
        'baseline_rule_model': {
            'accuracy': round(baseline_acc, 4),
            'precision': round(baseline_prec, 4),
            'recall': round(baseline_rec, 4),
            'f1_score': round(baseline_f1, 4),
            'roc_auc': round(baseline_auc, 4),
            'confusion_matrix': {
                'tn': baseline_cm[0][0], 'fp': baseline_cm[0][1],
                'fn': baseline_cm[1][0], 'tp': baseline_cm[1][1]
            }
        },
        'comparison': {
            'models': {
                'Baseline Rule Model': {
                    'accuracy': round(baseline_acc, 4),
                    'recall': round(baseline_rec, 4),
                    'f1_score': round(baseline_f1, 4),
                    'roc_auc': round(baseline_auc, 4)
                },
                **{k: {
                    'accuracy': v['accuracy'],
                    'recall': v['recall'],
                    'f1_score': v['f1_score'],
                    'roc_auc': v['roc_auc']
                } for k, v in results.items()}
            }
        },
        'top_feature_importances': feat_imp[:12],
        'numerical_features': NUMERICAL_COLS,
        'categorical_features': CATEGORICAL_COLS
    }

    # 9. Save Artifacts
    os.makedirs("ml/models", exist_ok=True)
    model_save_path = "ml/models/student_risk_model.joblib"
    prep_save_path = "ml/models/preprocessor.joblib"
    metrics_save_path = "ml/models/model_metrics.json"

    joblib.dump(best_model, model_save_path)
    joblib.dump(preprocessor, prep_save_path)
    with open(metrics_save_path, 'w') as f:
        json.dump(metrics_payload, f, indent=2)

    print(f"\nSaved Champion Model to {model_save_path}")
    print(f"Saved Preprocessor to {prep_save_path}")
    print(f"Saved Benchmark Metrics to {metrics_save_path}")

    return best_model, preprocessor, metrics_payload

if __name__ == '__main__':
    train_and_evaluate()
