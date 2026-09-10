# CampusPulse BI

### AI-Powered Campus Intelligence & Student Success Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-v0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-v19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-v1.6-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**CampusPulse BI** is an enterprise AI-powered analytics and student retention platform for higher education institutions. Designed for college administrators, deans, department chairs (HODs), and faculty advisors, CampusPulse BI pairs a transparent institutional baseline rule model with trained machine learning classifiers and explainable AI (XAI) to proactively identify at-risk students 6–8 weeks before examinations.

---

## 🏛️ System Architecture

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

## 🎯 Benchmark: Baseline Rule Model vs ML Classifiers

Evaluated on an identical held-out test cohort of **1,686 students** containing 80 verified at-risk students (prevalence: 4.74%):

| Model Architecture | Accuracy | At-Risk Recall | Precision | F1-Score | ROC-AUC | PR-AUC | Students Caught (TP / 80) | False Negatives (Missed) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Baseline Rule Model** | 95.6% | **11.3%** | 75.0% | 0.196 | 0.929 | 0.444 | 9 / 80 | 71 missed |
| **Logistic Regression (Champion)** | 95.1% | **92.5%** | 49.3% | **0.644** | **0.984** | **0.783** | **74 / 80** | **Only 6 missed** |
| **Random Forest Classifier** | 96.5% | 77.5% | 60.2% | 0.678 | 0.982 | 0.671 | 62 / 80 | 18 missed |
| **Gradient Boosting Machine** | 97.4% | 65.0% | 77.6% | 0.708 | 0.989 | 0.822 | 52 / 80 | 28 missed |

### Class Imbalance & Precision-Recall Analysis
- **Cohort Class Imbalance**: Total campus records: **8,426**; Total at-risk students: **402 (4.77%)**. Test partition: **1,686**; Test at-risk students: **80 (4.74%)**.
- **The Precision-Recall Trade-off in Retention**:
  - In an imbalanced cohort where baseline at-risk prevalence is only **4.77%** (roughly 1 in 21 students), a standard rule model achieves high precision (75.0%) only by being excessively conservative—missing **88.7%** of students in crisis (71 out of 80 missed).
  - The Champion Logistic Regression model achieves **49.33% Precision**, which represents an **enrichment factor of ~10.3x** over baseline prevalence. When the model flags a student, there is nearly a 1-in-2 probability of true acute distress, while successfully capturing **92.5%** of all at-risk students (74/80 caught, only 6 missed).
  - The PR-AUC (Average Precision) jumps from **0.444** (baseline) to **0.783** (Champion), demonstrating superior discriminative capability across all decision thresholds.

> **Why prioritize Recall?** In student retention, a False Negative (missing a student experiencing academic distress) leads to exam failure or dropout. A False Positive results merely in a supportive mentor check-in. The Champion model achieves an **+81.2% higher capture rate** than the legacy rule model.

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js v18+ (tested on v22)
- Python 3.10+ (tested on 3.14)
- npm or pnpm

### 1. Machine Learning Pipeline Setup & Notebooks
```bash
# Navigate to ML directory and install dependencies
cd ml
pip install -r requirements.txt

# Run the complete pipeline (data generation, feature engineering, training & evaluation)
python src/dataset_generator.py
python src/feature_engineering.py
python src/train.py

# Launch Jupyter Notebooks
jupyter lab notebooks/
```
The notebooks cover:
- `01_eda.ipynb`: Exploratory data analysis across the 8,426 student body
- `02_preprocessing.ipynb`: Pipeline transformation & zero data-leakage guards
- `03_feature_engineering.ipynb`: Behavioral polynomial features & velocity metrics
- `04_model_training.ipynb`: Multi-model training & cross-validation
- `05_model_evaluation.ipynb`: ROC curves, confusion matrices, and SHAP explainability

### 2. FastAPI Intelligence Backend
```bash
# From the project root, install backend requirements
pip install -r backend/requirements.txt

# Launch FastAPI development server
python -m uvicorn backend.main:app --port 8000 --reload
```
- API Base: `http://localhost:8000/api`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/api/health`

### 3. Frontend Web Application
```bash
# Install frontend packages and launch Vite dev server
npm install
npm run dev
```
Open `http://localhost:5173` to explore the dashboard.

---

## ✨ Key Features

1. **Interactive "What-If" Risk Simulator**:
   - Real-time sliders for attendance, CGPA velocity, backlogs, continuous assessment, and engagement.
   - Dual output display: AI Model Probability vs Baseline Rule Score.
   - Instant explainability attribution (Positive Risk Drivers vs Protective Factors).
   - Prescribed actionable interventions with 1-click execution.
2. **Dual-Model Student Profile Modal**:
   - Comprehensive student trajectory with semester-by-semester CGPA progression chart.
   - Course-level attendance monitoring.
   - Explainable factor attributions.
3. **Campus-Wide Analytics**:
   - Department comparisons across 6 engineering disciplines.
   - Real-time academic, placement, and attendance intelligence.
   - Natural language institutional insight banner.
4. **Resilient Offline Architecture**:
   - Seamless edge computation fallback ensures the dashboard continues functioning even if the backend server is stopped.

---

## 📁 Repository Structure

```
MINI-PROJECT/
├── backend/                   # FastAPI intelligence microservice
│   ├── main.py                # 18 REST endpoints & CORS configuration
│   ├── model_service.py       # Inference, baseline score, and XAI engine
│   ├── database.py            # In-memory relational student store
│   ├── analytics_service.py   # Aggregations, KPIs, and natural language insights
│   ├── schemas.py             # Pydantic v2 data contracts
│   └── requirements.txt
├── docs/                      # Institutional documentation
│   ├── architecture.md        # Detailed system architecture & design
│   ├── ml-methodology.md      # ML pipeline, feature formulation & recall justification
│   ├── api.md                 # Complete REST API reference & curl examples
│   └── data-dictionary.md     # 8,426 student tabular data dictionary
├── ml/                        # Machine Learning & Data Science Pipeline
│   ├── data/
│   │   ├── raw/               # 8,426 student CSV
│   │   └── processed/         # Train / Test partitions
│   ├── models/                # Serialized model, preprocessor & metrics JSON
│   ├── notebooks/             # 5 end-to-end Jupyter notebooks (01 to 05)
│   ├── src/                   # Dataset generator, feature engineering, training & XAI
│   └── requirements.txt
├── src/                       # React 19 / TypeScript frontend
│   ├── components/            # Reusable UI components & modals
│   ├── context/               # Auth, filter, and theme providers
│   ├── data/                  # Static models, relational entities & insight engine
│   ├── pages/                 # Risk Analysis, Students, Dashboard, etc.
│   └── services/              # Resilient API client with offline fallback
├── package.json
└── README.md
```

---

## 🛡️ Data Governance & Ethical AI Notice

All student records in this platform are synthetically generated for institutional simulation and decision-support demonstration. In adherence to higher education AI governance principles:
- Model predictions serve exclusively as **advisory early-warning signals** to assist mentors and student welfare deans.
- Predictions must **never** be used as automated punitive or disciplinary actions.
- Human review remains authoritative in all pastoral decisions.

> **Synthetic Data Limitation Disclaimer:** Model performance is evaluated on a synthetic demonstration cohort and should not be interpreted as real-world institutional performance.

---

## ⚖️ Production Readiness: Demonstrated vs. Not Yet Production Validated

To maintain strict scientific and engineering integrity, we explicitly distinguish what is proven in this repository from what requires institutional deployment:

| Dimension | Demonstrated & Verified in Repository | Not Yet Production Validated (Requires Live Campus Pilot) |
| :--- | :--- | :--- |
| **Pipeline & Modeling** | End-to-end reproducible pipeline, zero-leakage scikit-learn transformers, class-balanced champion classifier, and baseline rule benchmark on 8,426 records. | Retraining and calibration on real-world multi-year student historical data across varied college systems. |
| **Explainable AI (XAI)** | Real-time factor decomposition into positive risk drivers and negative protective drivers with bounded percentage attributions. | Empirical validation of whether specific explanation phrasing influences faculty advisor adoption. |
| **System Architecture** | Sub-5ms FastAPI inference API, strict Pydantic v2 data contracts, and seamless edge client fallback during offline backend scenarios. | Integration with institutional LDAP/SSO and SIS/ERP systems (e.g., Ellucian Banner, Canvas LMS, Oracle PeopleSoft). |
| **User Experience** | Responsive React 19/Tailwind UI, interactive What-If simulator, student trajectory analytics, filter-aware CSV export, and PDF preview. | Longitudinal user study assessing student retention rate improvements over 2–4 semesters after automated early outreach. |
| **Fairness & Bias** | Synthetic data generation without demographic stereotyping or target leakage. | Comprehensive Disparate Impact and Equalized Odds fairness audits on real demographic subgroups. |

