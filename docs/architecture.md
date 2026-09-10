# CampusPulse BI — System Architecture & Design

## 1. High-Level System Overview

**CampusPulse BI** is an enterprise AI-powered Campus Intelligence and Student Success Platform. It bridges modern tabular machine learning with an institutional higher-education analytics dashboard, equipping faculty advisors, department chairs (HODs), and academic deans with early-warning signals and explainable pastoral interventions.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                            │
│           React 19 + TypeScript + Vite + Tailwind CSS + Recharts       │
│                                                                        │
│   ┌───────────────────────┐ ┌──────────────────────┐ ┌──────────────┐  │
│   │ Early Warning Roster  │ │ Live What-If Sim     │ │ Benchmark    │  │
│   │ Dual Score Evaluation │ │ Feature Attribution  │ │ Rule vs ML   │  │
│   └───────────────────────┘ └──────────────────────┘ └──────────────┘  │
│                                │                                       │
│                    Fallback /  │ HTTP / JSON                           │
│                    Edge Engine │ (localhost:8000)                      │
└────────────────────────────────┼───────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          BACKEND API LAYER                             │
│                  FastAPI + Uvicorn + Pydantic v2                       │
│                                                                        │
│   ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────┐   │
│   │ POST /risk/predict   │ │ GET /model/metrics   │ │ GET /insights│   │
│   │ Inference & XAI      │ │ Benchmark & Confusion│ │ Dynamic Alerts│  │
│   └──────────────────────┘ └──────────────────────┘ └──────────────┘   │
│                                │                                       │
│                                ▼                                       │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Relational In-Memory / SQLite Database (8,426 Student Cohort)  │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┼───────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     MACHINE LEARNING & DS PIPELINE                     │
│                Python 3.14 + Scikit-Learn + SHAP + Joblib              │
│                                                                        │
│   ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────┐   │
│   │ Synthetic Dataset    │ │ Domain Feature       │ │ Sklearn      │   │
│   │ 8,426 Cohort CSV     │ │ Engineering          │ │ Preprocessor │   │
│   └──────────────────────┘ └──────────────────────┘ └──────────────┘   │
│                                │                                       │
│                                ▼                                       │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ Champion Classifier (Logistic Regression Balanced, Recall 92.5%)│  │
│   │ XAI Attribution Engine (Risk Drivers & Protective Factors)     │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Breakdown

### 2.1 Machine Learning Pipeline (`ml/`)
- **Dataset Generation (`ml/src/dataset_generator.py`)**:
  - Generates realistic, institutionally calibrated tabular data matching the exact campus population of **8,426 students** across 6 engineering departments (CSE: 2,140, IT: 1,380, ECE: 1,680, EEE: 1,120, Mechanical: 1,250, Civil: 856).
  - Simulates realistic covariance: attendance deficits correlate with backlog risks; GPA declines correlate with continuous assessment dropouts.
  - Overall at-risk prevalence is calibrated to **~4.8%** (~402 students), matching the high-risk cohort displayed across campus portals.
- **Domain Feature Engineering (`ml/src/feature_engineering.py`)**:
  - Computes non-linear behavioral signals: `cgpa_change`, `academic_decline`, `attendance_gap`, `severe_attendance_deficit`, `backlog_severity`, `compound_vulnerability`, `engagement_score`, and `internal_discrepancy`.
- **Zero-Leakage Preprocessing (`ml/src/preprocessing.py`)**:
  - Encapsulates `StandardScaler` for numeric columns and `OneHotEncoder(handle_unknown='ignore')` for categorical fields inside a `ColumnTransformer`.
  - Fit strictly on the 80% training set (n=6,740); held-out test split (n=1,686) transformed without target snooping.
- **Model Training & Evaluation (`ml/src/train.py`)**:
  - Trains and evaluates 3 machine learning classifiers against the baseline rule model:
    1. **Logistic Regression (Champion)**: Class-weighted, L2 regularized. Achieves **92.5% At-Risk Recall**, **0.984 ROC-AUC**, and **0.783 PR-AUC**.
    2. **Random Forest**: 150 trees, max depth 8. Achieves **77.5% Recall**, **0.982 ROC-AUC**, and **0.671 PR-AUC**.
    3. **Gradient Boosting**: 120 estimators, depth 4. Achieves **65.0% Recall**, **0.989 ROC-AUC**, and **0.822 PR-AUC**.
    4. **Baseline Rule Model**: Weighted formula (Attendance 30%, CGPA Trend 35%, Backlogs 20%, Engagement 15%). Achieves only **11.3% Recall** and **0.444 PR-AUC** due to rigid linear thresholds.
- **Explainable AI Engine (`ml/src/explain.py`)**:
  - Employs a 5-pillar domain aggregation structure (`Attendance`, `Academic CGPA & Trajectory`, `Course Backlogs`, `Internal Assessment`, and `Campus Engagement`) to insulate feature attribution from multicollinearity.
  - Directional Invariant: Ensures healthy student telemetry never produces spurious positive risk drivers, while distressed profiles cleanly elevate respective risk categories.
  - Dynamically synthesizes actionable, tailored pastoral recommendations.

### 2.2 FastAPI Microservice (`backend/`)
- **Framework**: FastAPI with asynchronous endpoints, Pydantic v2 data validation contracts, and permissive CORS for seamless frontend interaction.
- **Relational Data Layer (`backend/database.py`)**:
  - In-memory database populated directly from `campus_students_8426.csv` on startup.
  - Supports query filtering across departments, semesters, and risk tiers with sub-5ms latency.
- **Endpoints**:
  - `POST /api/risk/predict`: Executes live pipeline inference, returning calibrated probability, tier, baseline score, risk drivers, and prescribed interventions.
  - `GET /api/model/metrics`: Serves exact test set metrics, PR-AUC, class imbalance counts, confusion matrix, and feature importances.
  - `GET /api/dashboard`: Aggregated enrollment, retention, and department KPIs.
  - `GET /api/students`: Filterable student roster with pagination.
  - `GET /api/students/{id}`: Detailed individual student profile with semester history and course-level attendance.
  - `GET /api/insights`: Dynamic natural language insights generated from campus distributions.

### 2.3 React Presentation Layer (`src/`)
- **Technology Stack**: React 19, TypeScript, Vite, Tailwind CSS, Lucide icons, Recharts.
- **Resilient Offline Architecture (`src/services/api.ts`)**:
  - Client API service attempts live requests to `http://127.0.0.1:8000/api`.
  - If the backend is unreachable or undergoing maintenance, it seamlessly falls back to local calibrated edge computation and cached `model_metrics.json`. The user never encounters a blank screen or broken UI.
- **Early Warning & Retention Intelligence (`src/pages/RiskAnalysis.tsx`)**:
  - **Live What-If Risk Simulator**: Interactive sliders for attendance, CGPA trajectory, backlogs, midterms, and engagement. Real-time gauge comparing ML risk probability vs Baseline Rule score.
  - **Model Benchmark Table**: Direct side-by-side comparison of Baseline Rule Model vs Logistic Regression vs Random Forest vs Gradient Boosting including PR-AUC.
  - **Explainable Factor Attribution**: Visual indicators showing feature impacts (+/- percentages).
  - **Student Early Warning Roster**: Dual evaluation columns displaying both ML Probability and Baseline Rule score.
- **Student Profile Modal (`src/components/students/StudentProfileModal.tsx`)**:
  - Comprehensive view containing student bio, semester-by-semester CGPA progression chart, course-level attendance breakdown, dual model risk comparison, and interactive pastoral intervention triggers.

---

## 3. Data Flow

```
1. Client Input (Slider / Student Selection)
       │
       ▼
2. API Service (`src/services/api.ts`)
       │
       ├─── Backend Reachable ───► POST /api/risk/predict ──► Model Service ──► Prediction & Factors
       │                                                                               │
       └─── Backend Offline ────► Local Edge Inference ────────────────────────────────┘
                                                       │
                                                       ▼
3. React Component Update:
   - Probability Gauge updated
   - Rule vs ML Discrepancy evaluated
   - Risk Factors (+%) & Protective Factors (-%) displayed
   - Prescribed Pastoral Actions rendered
```

---

## 4. Ethical AI & Data Governance

1. **Synthetic Demo Privacy**: All student data records (names, roll numbers, GPA records) are synthetically generated for institutional simulation. No private PII is stored or exposed.
2. **Advisory Decision Support**: Model outputs are explicitly framed as *advisory early-warning signals* to assist human advisors. Automated academic disqualification, financial penalties, or disciplinary actions based solely on ML scores are prohibited by design.
3. **Transparent Explainability**: Every flagged risk prediction is accompanied by human-readable positive and protective contributing factors, preventing black-box opacity.
4. **Synthetic Limitation Notice**:
   > **Synthetic Data Limitation Disclaimer:** Model performance is evaluated on a synthetic demonstration cohort and should not be interpreted as real-world institutional performance.
5. **Demonstrated vs Not Yet Production Validated**:
   - **Demonstrated**: Complete functional software architecture, zero-leakage ML pipeline, dual-model comparison, XAI attribution, interactive UI, and edge offline fallback.
   - **Not Yet Validated**: Multi-semester longitudinal outcome validation on real campus student cohorts, live SIS database connectors, and institutional demographic fairness audits.

