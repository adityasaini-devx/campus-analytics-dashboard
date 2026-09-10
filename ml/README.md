# CampusPulse BI: Machine Learning & Early-Warning Risk Pipeline

This directory contains the complete data science pipeline for student retention risk detection, explainability, and intervention recommendation.

## Directory Structure

```text
ml/
├── data/
│   ├── raw/
│   │   └── campus_students_8426.csv      # 8,426 student tabular dataset
│   └── processed/
│       ├── train_students.csv             # Stratified 80% training partition (n=6,740)
│       └── test_students.csv              # Stratified 20% test partition (n=1,686)
├── notebooks/
│   ├── 01_eda.ipynb                       # Distributions, central tendencies, correlations
│   ├── 02_preprocessing.ipynb             # ColumnTransformer, Imputation, One-hot encoding
│   ├── 03_feature_engineering.ipynb       # Domain features (attendance gap, cgpa change, etc.)
│   ├── 04_model_training.ipynb            # Logistic Regression, Random Forest, Gradient Boosting
│   └── 05_model_evaluation.ipynb          # Confusion matrix, ROC curve, SHAP feature importance
├── src/
│   ├── dataset_generator.py               # Reproducible generator for 8,426 records
│   ├── preprocessing.py                   # Reusable sklearn preprocessing pipeline
│   ├── feature_engineering.py             # Feature extraction rules and dictionary
│   ├── train.py                           # Training & model benchmarking script
│   ├── predict.py                         # Single & batch inference service
│   └── explain.py                         # Explainable AI (Risk vs Protective drivers)
├── models/
│   ├── student_risk_model.joblib          # Serialized champion model
│   ├── preprocessor.joblib                # Serialized ColumnTransformer
│   └── model_metrics.json                 # Comprehensive test set evaluation results
└── requirements.txt                       # Python dependencies
```

## Quick Start

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Generate raw dataset:
   ```bash
   python ml/src/dataset_generator.py
   ```

3. Train models and benchmark against Baseline Rule Model:
   ```bash
   python -m ml.src.train
   ```

4. Test individual prediction and explainability:
   ```bash
   python -m ml.src.explain
   ```

## Model Benchmarks on Held-Out Test Set (n=1,686)

| Model | Accuracy | Precision | Recall (At-Risk) | F1-Score | ROC-AUC |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Baseline Rule Model** | 95.6% | 75.0% | 11.3% | 0.196 | 0.929 |
| **Logistic Regression** | 95.1% | 49.3% | **92.5%** | 0.643 | 0.984 |
| **Random Forest** | 96.5% | 60.2% | **77.5%** | **0.678** | 0.982 |
| **Gradient Boosting** | **97.4%** | **77.6%** | 65.0% | **0.707** | **0.989** |

*Note on Metric Optimization*: In educational pastoral care, **Recall for the At-Risk class** is prioritized over pure accuracy because missing a distressed student (False Negative) has severe academic consequences, whereas a False Positive simply results in a constructive advising check-in.
