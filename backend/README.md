# CampusPulse BI: FastAPI Backend Service

Production-ready Python backend serving ML predictions, feature attribution explanations, real-time analytics aggregations, and student retention intelligence.

## Features

- **FastAPI Framework**: High performance with asynchronous endpoints and automatic OpenAPI documentation at `/docs`.
- **Machine Learning Integration**: Direct pipeline loading with scikit-learn and joblib for real-time risk predictions.
- **Explainable AI**: Decomposes individual predictions into Risk-Increasing Factors (+) and Protective Factors (-).
- **Statistically Grounded Insights**: Generates dynamic natural language insights based on live cohort metrics.
- **Database Abstraction**: Tabular student entities with PostgreSQL-ready schema definitions.

## Quick Start

1. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

2. Start the API server:
   ```bash
   uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
   ```

3. View Swagger API documentation:
   Open `http://localhost:8000/docs` in your browser.

## Core API Endpoints

- `GET  /api/health`: Service status and uptime.
- `GET  /api/dashboard`: Executive KPI cards and year-over-year trends.
- `GET  /api/students`: Filterable student roster.
- `GET  /api/departments`: Department summary benchmarks.
- `POST /api/risk/predict`: Primary ML inference endpoint returning risk probability, risk level, baseline score, factor attributions, and recommended interventions.
- `GET  /api/risk/{student_id}`: Retrieves precomputed risk profile for a specific student.
- `GET  /api/model/metrics`: Held-out test evaluation benchmarks comparing Baseline Rule Model, Logistic Regression, Random Forest, and Gradient Boosting.
- `GET  /api/insights`: Dynamic natural language intelligence generated from filtered data.
