# CampusPulse BI — Institutional Data Dictionary

## 1. Overview
This data dictionary describes the tabular schema of the **8,426 student dataset** (`ml/data/raw/campus_students_8426.csv`) utilized across the Machine Learning pipeline, FastAPI microservice, and React intelligence dashboard.

---

## 2. Raw Student Telemetry Schema

| Field Name | Data Type | Permissible Range / Format | Description |
| :--- | :--- | :--- | :--- |
| `student_id` | String | `stu-10001` to `stu-18426` | Unique institutional identifier |
| `roll_no` | String | `21CS101`, `22EC204` | University registration number |
| `name` | String | Full Name (e.g., *Aarav Sharma*) | Synthetic student name |
| `email` | String | `*.edu` | Institutional email address |
| `department` | Categorical | `CSE`, `IT`, `ECE`, `EEE`, `Mechanical`, `Civil` | Enrolled engineering department |
| `semester` | Integer | `1` to `8` | Current active academic semester |
| `gender` | Categorical | `Male`, `Female`, `Other` | Demographic gender |
| `current_cgpa` | Float | `4.00` to `10.00` | Cumulative Grade Point Average |
| `previous_cgpa` | Float | `4.00` to `10.00` | Preceding semester Grade Point Average |
| `cgpa_trend` | Categorical | `improving`, `stable`, `declining` | Qualitative trajectory across terms |
| `attendance_percentage` | Float | `40.0` to `99.5` | Aggregate semester class & lab attendance % |
| `backlogs` | Integer | `0` to `6` | Count of un-cleared/pending courses |
| `internal_marks` | Float | `30.0` to `98.0` | Continuous assessment score (midterms/quizzes) |
| `assignment_score` | Float | `40.0` to `100.0` | Cumulative coursework assignment grade |
| `credits_completed` | Integer | `22` to `176` | Cumulative credit units earned toward graduation |
| `event_participation` | Integer | `0` to `12` | Hackathons, conferences, and technical workshops attended |
| `club_activities` | Integer | `0` to `6` | Student council and cultural/technical clubs active in |
| `skill_score` | Float | `30.0` to `98.0` | Normalized programming and technical competencies index |
| `internship_status` | Categorical | `None`, `Ongoing`, `Completed` | Industry internship standing |
| `placement_status` | Categorical | `Eligible`, `In Process`, `Placed`, `Higher Studies`, `Not Eligible` | Career placement standing |
| `company_placed` | String | Corporate Entity (e.g., *Google*, *Infosys*) | Employing enterprise if placed |
| `package_lpa` | Float | `3.5` to `45.0` | Annual compensation package in Lakhs Per Annum (INR) |

---

## 3. Domain Engineered Features

Constructed by `ml/src/feature_engineering.py` to expose non-linear behavioral signals to classifiers:

| Engineered Feature | Type | Derivation Formula | Interpretation |
| :--- | :--- | :--- | :--- |
| `cgpa_change` | Float | `current_cgpa - previous_cgpa` | Academic velocity ($<0$ denotes performance drop) |
| `academic_decline` | Binary | `1 if cgpa_change <= -0.3 else 0` | Substantial academic deceleration flag |
| `attendance_gap` | Float | `max(0, 75.0 - attendance_percentage)` | Distance below statutory 75% exam cutoff |
| `severe_attendance_deficit` | Binary | `1 if attendance_percentage < 65.0 else 0` | Critical attendance breach requiring dean intervention |
| `backlog_severity` | Float | `backlogs * (10.0 - current_cgpa)` | Weighted academic debt load |
| `multiple_backlogs` | Binary | `1 if backlogs >= 2 else 0` | Chronic course failure indicator |
| `compound_vulnerability` | Binary | `1 if (attendance < 75 and backlogs > 0) else 0` | Simultaneous academic and attendance distress |
| `engagement_score` | Float | `0.6 * event_participation + 0.4 * club_activities` | Campus co-curricular involvement |
| `low_engagement_flag` | Binary | `1 if engagement_score < 40.0 else 0` | Student isolation / disengagement risk |
| `internal_discrepancy` | Float | `internal_marks - (current_cgpa * 10.0)` | Mismatch between daily coursework and exam scores |

---

## 4. Target Variables & Labels

| Target Field | Type | Values | Description |
| :--- | :--- | :--- | :--- |
| `at_risk` | Binary | `0` (Safe), `1` (At Risk) | Ground truth retention flag (prevalence: ~4.77%, 402 of 8,426) |
| `risk_tier` | Categorical | `Low`, `Medium`, `High` | Institutional triaging tier for counseling prioritization |
| `baseline_score` | Float | `0.00` to `1.00` | Composite deterministic score from 4-pillar rule model |
| `ml_risk_probability` | Float | `0.000` to `1.000` | Posterior probability calibrated from Champion ML classifier |

---

## 5. Ethical AI & Synthetic Data Notice

> **Synthetic Data Limitation Disclaimer:** Model performance is evaluated on a synthetic demonstration cohort and should not be interpreted as real-world institutional performance.

All student records, attributes, and trajectories in this dataset are synthetically generated for academic demonstration and decision-support modeling. Outputs are probabilistic indicators of risk (`ml_risk_probability`), not deterministic guarantees of academic failure. All early-warning alerts must be reviewed by qualified human mentors before taking pastoral action.

