# CampusPulse BI — Machine Learning Methodology & Evaluation

## 1. Executive Summary

In higher education student retention, traditional early-warning systems rely on rigid, linear threshold formulas (e.g. flagging a student only if attendance drops below 75% or CGPA falls below 6.0). However, academic struggle is frequently compound and non-linear: a student may maintain 76% attendance while their semester GPA drops sharply by 1.5 points across consecutive terms, or accumulate backlogs while maintaining high project scores.

**CampusPulse BI** pairs an institutional baseline rule model with trained machine learning classifiers. On an identical held-out test cohort of **1,686 students** containing 80 verified at-risk individuals, the Champion ML Model achieved **92.5% At-Risk Recall** (catching 74 of 80 vulnerable students) compared to the baseline rule model's **11.3% Recall** (which missed 71 out of 80 students).

---

## 2. Dataset Synthesis & Demographics

To ensure complete privacy while simulating real institutional scale, a synthetic tabular dataset of **8,426 students** was generated matching the exact departmental distributions of the campus:

| Department | Code | Enrolled Count | Target Percentage |
| :--- | :--- | :--- | :--- |
| Computer Science & Engineering | CSE | 2,140 | 25.4% |
| Electronics & Communication Engineering | ECE | 1,680 | 19.9% |
| Information Technology | IT | 1,380 | 16.4% |
| Mechanical Engineering | Mechanical | 1,250 | 14.8% |
| Electrical & Electronics Engineering | EEE | 1,120 | 13.3% |
| Civil Engineering | Civil | 856 | 10.2% |
| **Total Campus Population** | **All** | **8,426** | **100.0%** |

### Realistic Covariance Generation
The synthetic generator (`ml/src/dataset_generator.py`) imposes realistic non-linear statistical dependencies:
1. **Attendance-Academic Correlation**: Students with attendance $< 75\%$ have lower continuous assessment marks and higher backlog likelihood.
2. **Semester Progression**: Upper semester students (Sem 7–8) experience lower backlogs but increased placement stress.
3. **Compound Risk Prevalence**: Calibrated to **~4.8%** (~402 students across the entire campus), reflecting typical enterprise university at-risk cohorts.

---

## 3. Domain Feature Engineering

Rather than relying purely on raw scores, the pipeline constructs 12 domain-specific behavioral features:

1. **`cgpa_change`**: $\Delta_{\text{CGPA}} = \text{Current CGPA} - \text{Previous CGPA}$  
   *Captures academic velocity. Negative values reflect sudden decline.*
2. **`academic_decline`**: Binary indicator $[ \Delta_{\text{CGPA}} \le -0.3 ]$  
   *Flags steep performance drops regardless of absolute GPA level.*
3. **`attendance_gap`**: $\max(0, 75.0 - \text{Attendance})$  
   *Calculates distance below statutory examination eligibility cutoffs.*
4. **`severe_attendance_deficit`**: Binary indicator $[ \text{Attendance} < 65.0 ]$  
   *Identifies critical attendance emergencies requiring dean condonation.*
5. **`backlog_severity`**: $\text{Backlogs} \times (10.0 - \text{Current CGPA})$  
   *Measures the compounding difficulty of clearing pending courses.*
6. **`multiple_backlogs`**: Binary indicator $[ \text{Backlogs} \ge 2 ]$
7. **`compound_vulnerability`**: $[\text{Attendance} < 75.0] \land [\text{Backlogs} > 0]$  
   *Non-linear interaction flag identifying dual academic-attendance failure.*
8. **`engagement_score`**: $0.6 \times \text{Co-curricular} + 0.4 \times \text{Club Activity}$
9. **`low_engagement_flag`**: Binary indicator $[ \text{Engagement Score} < 40.0 ]$
10. **`internal_discrepancy`**: Continuous assessment score minus semester external exams.

---

## 4. Preprocessing & Data Leakage Prevention

- **Split Ratio**: 80% Training set ($n = 6,740$), 20% Test set ($n = 1,686$).
- **Stratification**: Stratified by target label `at_risk` to preserve the 4.8% positive class proportion across both folds.
- **Scikit-Learn Pipeline (`ml/src/preprocessing.py`)**:
  - `StandardScaler` applied to all numerical columns.
  - `OneHotEncoder(handle_unknown='ignore', sparse_output=False)` applied to categorical columns (`department`, `internship_status`, `placement_status`, `cgpa_trend`).
  - Imputer: `SimpleImputer(strategy='median')` ensures resilience against missing student telemetry.
  - **Leakage Prevention**: Transformations are fitted strictly on `train_students.csv` and serialized to `ml/models/preprocessor.joblib`. The test partition is transformed using frozen parameters.

---

## 5. Model Evaluation & Benchmark Comparison

Four models were evaluated under identical conditions on the held-out test cohort ($n=1,686$, with 80 verified at-risk students, 4.74% prevalence):

| Model Architecture | Accuracy | At-Risk Recall | Precision | F1-Score | ROC-AUC | PR-AUC | True Positives (Caught / 80) | False Negatives (Missed) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Baseline Rule Model** | 95.6% | **11.3%** | 75.0% | 0.196 | 0.929 | 0.444 | 9 | 71 |
| **Logistic Regression (Balanced)** | 95.1% | **92.5%** | 49.3% | **0.644** | **0.984** | **0.783** | **74** | **6** |
| **Random Forest (150 Trees)** | 96.5% | 77.5% | 60.2% | 0.678 | 0.982 | 0.671 | 62 | 18 |
| **Gradient Boosting (120 Trees)** | 97.4% | 65.0% | 77.6% | 0.708 | 0.989 | 0.822 | 52 | 28 |

### Class Imbalance & Precision-Recall Analysis
- **Prevalence Context**: The overall campus dataset consists of 8,426 records, with 402 at-risk cases (**4.77%**). The held-out test set contains 1,686 records, with 80 at-risk cases (**4.74%**).
- **Enrichment Factor**: In an environment where only ~1 in 21 students is in acute distress, a random guesser achieves 4.7% precision. The Champion Logistic Regression model achieves **49.33% Precision**, which represents an **enrichment factor of ~10.3x**.
- **Average Precision (PR-AUC)**: ROC-AUC can present an overly optimistic assessment on heavily imbalanced datasets because large numbers of true negatives suppress the False Positive Rate. PR-AUC explicitly measures precision across all recall levels. The Champion model achieves a PR-AUC of **0.7825**, compared to the baseline rule model's **0.4444**—confirming vastly superior ranking performance where it matters most.

### Confusion Matrix Breakdown (Test Set n=1,686)

#### Champion Model: Logistic Regression (Balanced)
```
                  Predicted Safe    Predicted At-Risk
Actual Safe            1,530               76
Actual At-Risk             6               74  <-- 92.5% Recall!
```

#### Baseline Rule Model
```
                  Predicted Safe    Predicted At-Risk
Actual Safe            1,603                3
Actual At-Risk            71                9  <-- 88.7% of At-Risk Students Missed!
```

---

## 6. Why Prioritize Recall in Higher Education Early Warning?

In customer churn or academic retention, **the cost of a False Negative far outweighs the cost of a False Positive**:

- **False Negative (Missed Student)**: A student in silent academic decline receives no outreach, fails exams, loses financial aid or drops out.
- **False Positive (Benign Flag)**: A student performing slightly below expectations receives an advisor check-in or tutoring suggestion. The advisor confirms the student is managing well. No harm is done.

By prioritizing **At-Risk Recall**, CampusPulse BI catches **74 out of 80 vulnerable students** (+81.2% higher capture rate than baseline rules), providing faculty advisors with a dependable safety net.

---

## 7. Explainable AI (XAI) & Domain Pillar Attribution

To satisfy educational accreditation standards and avoid black-box decision-making, the inference engine employs a Domain Pillar attribution architecture:

1. **Multicollinearity-Robust Pillar Consolidation**:
   - Tabular educational data features strong covariance (e.g. `attendance_percentage` correlates with `attendance_gap` and `severe_attendance_deficit`; `current_cgpa` correlates with `cgpa_change` and `cgpa_trend`).
   - Rather than presenting fragmented, directionally contradictory raw coefficients, CampusPulse BI aggregates linear log-odds attributions into 5 coherent **Domain Pillars**:
     - **Attendance**: Statutory minimums, attendance gap, and laboratory attendance.
     - **Academic CGPA & Trajectory**: Cumulative GPA level, velocity (`cgpa_change`), and recent trend.
     - **Course Backlogs**: Arrears count, backlog severity multiplier, and multiple backlog indicators.
     - **Internal Assessment**: Continuous assessment, midterms, and assignment submissions.
     - **Campus Engagement**: Co-curricular participation, hackathons, and student club activities.
2. **Directional Invariant Guarantee**:
   - A healthy student with 88% attendance, 8.5 CGPA, and 0 backlogs will **never** display positive risk drivers. All 5 pillars report strictly protective attributions.
   - A distressed student with 55% attendance, 4.8 CGPA, and 3 backlogs correctly surfaces positive risk contributions across all distressed domains.
3. **Prescribed Interventions**:
   - Synthesizes dynamic, actionable recommendations linked directly to the highest risk drivers (e.g. Mandatory Attendance Counseling, Remedial Peer Tutoring, Backlog Clearance Blueprint).

---

## 8. Reproducibility & Artifacts

All models, data, and notebooks are versioned and reproducible:
- Raw Data: `ml/data/raw/campus_students_8426.csv`
- Processed Data: `ml/data/processed/train_students.csv`, `test_students.csv`
- Serialized Model: `ml/models/student_risk_model.joblib`
- Preprocessor: `ml/models/preprocessor.joblib`
- Evaluation Metrics: `ml/models/model_metrics.json`
- 5 Complete Jupyter Notebooks: `ml/notebooks/01_eda.ipynb` through `05_model_evaluation.ipynb`

---

## 9. Data Governance, Ethics & Validation Boundaries

> **Synthetic Data Limitation Disclaimer:** Model performance is evaluated on a synthetic demonstration cohort and should not be interpreted as real-world institutional performance.

### Model Confidence & Language Standards
- Outputs are framed as **Risk Probability** and **Predicted Risk Tier**, never deterministic declarations such as "Student will fail" or "Student will drop out".
- Interventions are advisory suggestions for mentors and advisors; the platform prohibits automated disciplinary or punitive actions.

### Demonstrated vs. Not Yet Production Validated

| Status | Capability Area | Description |
| :--- | :--- | :--- |
| **Demonstrated** | End-to-End Pipeline | Full feature engineering, zero-leakage scikit-learn transformers, model serialization, and metrics logging. |
| **Demonstrated** | Dual-Model Triangulation | Transparent baseline rule benchmark directly compared against machine learning classifier. |
| **Demonstrated** | XAI Directional Integrity | Pillar-level attribution ensuring healthy inputs produce zero false risk drivers. |
| **Demonstrated** | Interactive Decision UI | What-If simulator, student profiles, filter-aware CSV export, and PDF preview. |
| **Demonstrated** | Edge Resiliency | Sub-5ms FastAPI backend with instant fallback to edge inference when offline. |
| *Not Yet Validated* | Institutional Deployment | Retraining and threshold calibration on multi-year real university historical records. |
| *Not Yet Validated* | Longitudinal Retention Impact | Multi-semester randomized control study measuring if early advisor contact improves graduation rates. |
| *Not Yet Validated* | Institutional ERP Integration | Real-time live bi-directional sync with enterprise SIS systems (e.g. Banner, PeopleSoft, Canvas). |
| *Not Yet Validated* | Demographic Parity Audits | Fairness and equal opportunity metric audits on sensitive personal demographics. |

