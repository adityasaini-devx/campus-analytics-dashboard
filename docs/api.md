# CampusPulse BI — REST API Reference

Base URL: `http://127.0.0.1:8000/api`  
Interactive OpenAPI / Swagger Documentation: `http://127.0.0.1:8000/docs`  
Alternative ReDoc Documentation: `http://127.0.0.1:8000/redoc`

---

## 1. System Health

### `GET /health`
Returns service availability, operational status, and deployed model version.

#### Example Request
```bash
curl -X GET http://127.0.0.1:8000/api/health
```

#### Example Response (200 OK)
```json
{
  "status": "operational",
  "service": "CampusPulse BI Intelligence API",
  "version": "v1.2",
  "timestamp": "2026-09-08T22:36:43.171943"
}
```

---

## 2. Machine Learning Inference & Explainability

### `POST /risk/predict`
Calculates real-time calibrated risk probability, risk tier, baseline rule score, explainable feature attributions, and prescribed interventions for a student profile.

#### Request Body (`application/json`)
```json
{
  "attendance": 62.5,
  "current_cgpa": 5.8,
  "previous_cgpa": 6.9,
  "backlogs": 2,
  "internal_marks": 58.0,
  "assignment_score": 62.0,
  "engagement_score": 45.0,
  "department": "CSE",
  "semester": 5
}
```

#### Example Response (200 OK)
```json
{
  "risk_probability": 0.984,
  "risk_level": "High",
  "baseline_score": 0.633,
  "baseline_level": "High",
  "top_factors": [
    {
      "feature": "cgpa_change",
      "label": "Semester CGPA Trend",
      "impact_pct": 20.6,
      "attribution": 6.412,
      "type": "risk_driver",
      "category": "Academic"
    },
    {
      "feature": "attendance_gap",
      "label": "Attendance Below 75% Cutoff",
      "impact_pct": 16.2,
      "attribution": 5.047,
      "type": "risk_driver",
      "category": "Attendance"
    },
    {
      "feature": "backlogs",
      "label": "Active Course Backlogs",
      "impact_pct": 14.1,
      "attribution": 4.388,
      "type": "risk_driver",
      "category": "Curriculum"
    }
  ],
  "protective_factors": [
    {
      "feature": "internal_marks",
      "label": "Strong Continuous Assessment",
      "impact_pct": -4.2,
      "attribution": -0.85,
      "type": "protective_driver",
      "category": "Academic"
    }
  ],
  "recommendations": [
    "Mandatory Attendance Counseling: Schedule meeting with Faculty Advisor to review morning/laboratory absences.",
    "Academic Tutoring Intervention: Assign departmental peer mentor for core analytical course remediation.",
    "Backlog Clearance Blueprint: Schedule remedial weekend doubt-clearing sessions prior to end-term exams."
  ]
}
```

---

## 3. Model Benchmark & Test Evaluation

### `GET /model/metrics`
Serves verified held-out test cohort ($n=1,686$) metrics, PR-AUC, class imbalance breakdown, confusion matrices, and feature importances.

#### Example Response (200 OK)
```json
{
  "champion_model": "Logistic Regression",
  "model_version": "v1.2-enterprise",
  "training_records": 6740,
  "test_records": 1686,
  "accuracy": 0.9514,
  "precision": 0.4933,
  "recall": 0.9250,
  "f1_score": 0.6435,
  "roc_auc": 0.9844,
  "pr_auc": 0.7825,
  "class_imbalance": {
    "total_records": 8426,
    "at_risk_records": 402,
    "at_risk_prevalence_pct": 4.77,
    "test_records": 1686,
    "test_at_risk_records": 80,
    "test_at_risk_pct": 4.74
  },
  "confusion_matrix": {
    "tn": 1530,
    "fp": 76,
    "fn": 6,
    "tp": 74
  },
  "baseline_rule_model": {
    "accuracy": 0.9561,
    "precision": 0.7500,
    "recall": 0.1125,
    "f1_score": 0.1957,
    "roc_auc": 0.9290,
    "pr_auc": 0.4444,
    "confusion_matrix": {
      "tn": 1603,
      "fp": 3,
      "fn": 71,
      "tp": 9
    }
  },
  "comparison": {
    "models": {
      "Baseline Rule Model": { "accuracy": 0.9561, "recall": 0.1125, "f1_score": 0.1957, "roc_auc": 0.9290, "pr_auc": 0.4444 },
      "Logistic Regression": { "accuracy": 0.9514, "recall": 0.9250, "f1_score": 0.6435, "roc_auc": 0.9844, "pr_auc": 0.7825 },
      "Random Forest": { "accuracy": 0.9650, "recall": 0.7750, "f1_score": 0.6776, "roc_auc": 0.9818, "pr_auc": 0.6709 },
      "Gradient Boosting": { "accuracy": 0.9745, "recall": 0.6500, "f1_score": 0.7075, "roc_auc": 0.9893, "pr_auc": 0.8216 }
    }
  },
  "top_feature_importances": [
    { "feature": "cgpa_change", "importance": 1.9413 },
    { "feature": "current_cgpa", "importance": 1.6167 },
    { "feature": "backlogs", "importance": 1.3646 },
    { "feature": "attendance_gap", "importance": 1.2121 }
  ]
}
```

---

## 4. Campus Analytics & Data Entities

### `GET /dashboard`
Returns high-level university KPIs, enrollment totals, and year-over-year trends.
- **Query Parameters**: `department` (optional, e.g. `CSE`), `semester` (optional, e.g. `5`).

### `GET /students`
Paginated search and filter endpoint for the 8,426 student body.
- **Query Parameters**:
  - `page` (default `1`)
  - `page_size` (default `20`, max `100`)
  - `department` (e.g. `IT`)
  - `semester` (e.g. `4`)
  - `risk_tier` (`High`, `Medium`, `Low`)
  - `search` (name or roll number search string)

### `GET /students/{id}`
Retrieves full student profile including course-level attendance, semester CGPA progression, and mentor info.

### `GET /departments`
Returns all 6 engineering departments with aggregated academic, placement, and retention metrics.

### `GET /insights`
Generates live, automated institutional natural language insights across placements, attendance deficits, and risk cohorts.
