import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(BASE_DIR))

import joblib
import json
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, confusion_matrix
)
from ml.src.feature_engineering import engineer_features
from ml.src.train import calculate_baseline_rule_prediction


model = joblib.load(BASE_DIR / 'ml/models/student_risk_model.joblib')
preprocessor = joblib.load(BASE_DIR / 'ml/models/preprocessor.joblib')
with open(BASE_DIR / 'ml/models/model_metrics.json') as f:
    saved_metrics = json.load(f)

test_df = pd.read_csv(BASE_DIR / 'ml/data/processed/test_students.csv')
raw_df = pd.read_csv(BASE_DIR / 'ml/data/raw/campus_students_8426.csv')

print('--- 1. DATASET DEMOGRAPHICS & CLASS IMBALANCE ---')
total_students = len(raw_df)
total_at_risk = int(raw_df['at_risk'].sum())
at_risk_pct = float(raw_df['at_risk'].mean() * 100)
test_students = len(test_df)
test_at_risk = int(test_df['at_risk'].sum())
test_at_risk_pct = float(test_df['at_risk'].mean() * 100)

print(f"Total Students: {total_students}")
print(f"Total At-Risk: {total_at_risk} ({at_risk_pct:.2f}%)")
print(f"Test Students: {test_students}")
print(f"Test At-Risk: {test_at_risk} ({test_at_risk_pct:.2f}%)")

test_feat = engineer_features(test_df)
X_test = preprocessor.transform(test_feat)
y_test = test_df['at_risk'].values

preds = model.predict(X_test)
probs = model.predict_proba(X_test)[:, 1]

acc = accuracy_score(y_test, preds)
prec = precision_score(y_test, preds)
rec = recall_score(y_test, preds)
f1 = f1_score(y_test, preds)
auc = roc_auc_score(y_test, probs)
pr_auc = average_precision_score(y_test, probs)
cm = confusion_matrix(y_test, preds)

print('\n--- 2. ACTUAL LOADED MODEL EVALUATION ---')
print(f"Model Class: {type(model).__name__}")
print(f"Accuracy:  {acc:.4f} (Saved in JSON: {saved_metrics['metrics']['accuracy']})")
print(f"Precision: {prec:.4f} (Saved in JSON: {saved_metrics['metrics']['precision']})")
print(f"Recall:    {rec:.4f} (Saved in JSON: {saved_metrics['metrics']['recall']})")
print(f"F1-Score:  {f1:.4f} (Saved in JSON: {saved_metrics['metrics']['f1_score']})")
print(f"ROC-AUC:   {auc:.4f} (Saved in JSON: {saved_metrics['metrics']['roc_auc']})")
print(f"PR-AUC (Avg Precision): {pr_auc:.4f}")
print(f"Confusion Matrix: TN={cm[0,0]}, FP={cm[0,1]}, FN={cm[1,0]}, TP={cm[1,1]}")
print(f"At-risk cases caught: {cm[1,1]} / {test_at_risk} (Recall: {cm[1,1]/test_at_risk*100:.1f}%)")
print(f"False Negatives (missed at-risk): {cm[1,0]}")

b_preds, b_scores = calculate_baseline_rule_prediction(test_df)
b_acc = accuracy_score(y_test, b_preds)
b_prec = precision_score(y_test, b_preds)
b_rec = recall_score(y_test, b_preds)
b_f1 = f1_score(y_test, b_preds)
b_auc = roc_auc_score(y_test, b_scores)
b_pr_auc = average_precision_score(y_test, b_scores)
b_cm = confusion_matrix(y_test, b_preds)

print('\n--- 3. ACTUAL BASELINE RULE MODEL EVALUATION ---')
print(f"Baseline Accuracy:  {b_acc:.4f} (Saved in JSON: {saved_metrics['baseline_rule_model']['accuracy']})")
print(f"Baseline Precision: {b_prec:.4f} (Saved in JSON: {saved_metrics['baseline_rule_model']['precision']})")
print(f"Baseline Recall:    {b_rec:.4f} (Saved in JSON: {saved_metrics['baseline_rule_model']['recall']})")
print(f"Baseline F1-Score:  {b_f1:.4f} (Saved in JSON: {saved_metrics['baseline_rule_model']['f1_score']})")
print(f"Baseline ROC-AUC:   {b_auc:.4f} (Saved in JSON: {saved_metrics['baseline_rule_model']['roc_auc']})")
print(f"Baseline PR-AUC:    {b_pr_auc:.4f}")
print(f"Baseline Confusion: TN={b_cm[0,0]}, FP={b_cm[0,1]}, FN={b_cm[1,0]}, TP={b_cm[1,1]}")
print(f"Baseline caught: {b_cm[1,1]} / {test_at_risk} (Recall: {b_cm[1,1]/test_at_risk*100:.1f}%)")
print(f"Baseline missed: {b_cm[1,0]}")
