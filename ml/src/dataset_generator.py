"""
Dataset Generator for CampusPulse BI
Generates a realistic, non-deterministic tabular dataset of 8,426 students across 6 departments.
Derived directly from institutional parameters matching existing dashboard KPIs.
"""

import os
import numpy as np
import pandas as pd

def generate_campus_dataset(output_path: str = "ml/data/raw/campus_students_8426.csv", random_seed: int = 42) -> pd.DataFrame:
    np.random.seed(random_seed)

    # Exact department breakdown matching frontend
    dept_configs = {
        'CSE': {'count': 2140, 'avg_cgpa': 8.12, 'avg_att': 84.6, 'placement_rate': 0.892, 'internship_rate': 0.765},
        'IT': {'count': 1380, 'avg_cgpa': 7.95, 'avg_att': 83.1, 'placement_rate': 0.864, 'internship_rate': 0.728},
        'ECE': {'count': 1680, 'avg_cgpa': 7.74, 'avg_att': 81.8, 'placement_rate': 0.815, 'internship_rate': 0.664},
        'EEE': {'count': 1120, 'avg_cgpa': 7.46, 'avg_att': 79.5, 'placement_rate': 0.732, 'internship_rate': 0.581},
        'Mechanical': {'count': 1250, 'avg_cgpa': 7.28, 'avg_att': 78.9, 'placement_rate': 0.684, 'internship_rate': 0.540},
        'Civil': {'count': 856, 'avg_cgpa': 7.15, 'avg_att': 77.8, 'placement_rate': 0.621, 'internship_rate': 0.486},
    }

    records = []
    student_counter = 1

    for dept, cfg in dept_configs.items():
        n = cfg['count']

        # Semester distribution (approx 12.5% per semester 1-8)
        semesters = np.random.choice(np.arange(1, 9), size=n, p=[0.13, 0.13, 0.13, 0.13, 0.12, 0.12, 0.12, 0.12])

        # Base CGPA per student
        cgpas = np.random.normal(loc=cfg['avg_cgpa'], scale=0.85, size=n)
        cgpas = np.clip(cgpas, 4.5, 9.95)

        # Base attendance per student
        attendances = np.random.normal(loc=cfg['avg_att'], scale=8.2, size=n)
        attendances = np.clip(attendances, 42.0, 99.0)

        # Previous CGPA (with correlation to current CGPA + delta)
        # Some students improve, some stable, some declining
        deltas = np.random.normal(loc=0.04, scale=0.35, size=n)
        prev_cgpas = np.clip(cgpas - deltas, 4.0, 10.0)

        for i in range(n):
            sem = int(semesters[i])
            curr_cgpa = round(float(cgpas[i]), 2)
            prev_cgpa = round(float(prev_cgpas[i]), 2)
            cgpa_diff = round(curr_cgpa - prev_cgpa, 2)
            att = round(float(attendances[i]), 1)

            # Categorical trend
            if cgpa_diff >= 0.15:
                trend = 'improving'
            elif cgpa_diff <= -0.15:
                trend = 'declining'
            else:
                trend = 'stable'

            # Backlogs probability inversely related to CGPA & attendance
            backlog_prob = max(0.01, min(0.70, (8.5 - curr_cgpa) * 0.12 + (78.0 - att) * 0.008))
            has_backlog = np.random.rand() < backlog_prob
            if has_backlog:
                # 1 to 4 backlogs
                backlogs = int(np.random.choice([1, 2, 3, 4], p=[0.60, 0.25, 0.10, 0.05]))
            else:
                backlogs = 0

            # Internal marks (0-100) strongly correlated with CGPA
            int_marks = float(np.clip(curr_cgpa * 10 + np.random.normal(0, 5), 35, 99))
            int_marks = round(int_marks, 1)

            # Assignment score (0-100)
            assign_score = float(np.clip(att * 0.8 + np.random.normal(15, 6), 30, 100))
            assign_score = round(assign_score, 1)

            # Credits completed
            credits = int(sem * 21 + np.random.choice([0, 1, 2, -2, -4]))
            credits = max(18, credits - backlogs * 4)

            # Event & campus participation score (0-100)
            event_score = float(np.clip(np.random.normal(60, 20), 5, 98))
            event_score = round(event_score, 1)

            # Skill competency score (0-100)
            skill_score = float(np.clip(curr_cgpa * 9 + np.random.normal(5, 12), 20, 98))
            skill_score = round(skill_score, 1)

            # Internship status (higher chance in semesters 5-8)
            if sem >= 5:
                p_intern = cfg['internship_rate'] * (1.1 if curr_cgpa >= 7.5 else 0.7)
                p_intern = min(0.92, max(0.2, p_intern))
                intern_status = np.random.choice(['Completed', 'Ongoing', 'None'], p=[p_intern * 0.75, p_intern * 0.25, 1 - p_intern])
            else:
                intern_status = 'None' if np.random.rand() > 0.1 else 'Ongoing'

            # Placement status for senior students (sem 7 & 8)
            if sem in [7, 8]:
                p_place = cfg['placement_rate'] * (1.15 if curr_cgpa >= 7.5 and backlogs == 0 else 0.4)
                p_place = min(0.95, max(0.15, p_place))
                place_status = np.random.choice(['Placed', 'In Process', 'Not Eligible'], p=[p_place, (1 - p_place) * 0.7, (1 - p_place) * 0.3])
            elif sem in [5, 6]:
                place_status = 'Eligible' if curr_cgpa >= 6.5 and backlogs == 0 else 'In Process'
            else:
                place_status = 'Not Eligible'

            # Ground truth target: at_risk (0 or 1)
            # Calibrated so high risk aligns with the ~342 student campus cohort
            latent_risk = (
                -2.38
                + 0.095 * max(0.0, 75.0 - att)            # Attendance penalty under 75%
                + 0.14  * max(0.0, 68.0 - att)            # Severe attendance penalty under 68%
                + 1.10  * max(0.0, 6.6 - curr_cgpa)       # CGPA penalty under 6.6
                + 1.65  * max(0.0, -cgpa_diff)            # CGPA decline penalty
                + 0.85  * backlogs                         # Active backlog penalty
                + 0.040 * max(0.0, 60.0 - int_marks)      # Poor internal marks penalty
                + 0.018 * max(0.0, 45.0 - event_score)    # Low engagement penalty
                + np.random.normal(0, 0.40)               # Realistic non-deterministic noise
            )

            # Sigmoid probability
            risk_prob = 1.0 / (1.0 + np.exp(-latent_risk))
            at_risk = 1 if risk_prob >= 0.50 else 0

            records.append({
                'student_id': f'STU-{student_counter:04d}',
                'roll_no': f'{26 - (sem + 1) // 2}{dept[:2].upper()}{100 + (student_counter % 900)}',
                'department': dept,
                'semester': sem,
                'attendance_percentage': att,
                'current_cgpa': curr_cgpa,
                'previous_cgpa': prev_cgpa,
                'cgpa_trend': trend,
                'backlogs': backlogs,
                'internal_marks': int_marks,
                'assignment_score': assign_score,
                'credits_completed': credits,
                'event_participation': event_score,
                'internship_status': intern_status,
                'skill_score': skill_score,
                'placement_status': place_status,
                'at_risk': at_risk,
                'risk_probability_ground_truth': round(risk_prob, 3)
            })
            student_counter += 1

    df = pd.DataFrame(records)

    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)

    print(f"Generated {len(df)} student records saved to {output_path}")
    print(f"Overall At-Risk prevalence: {df['at_risk'].mean():.1%} ({df['at_risk'].sum()} students)")
    print(f"Average Attendance: {df['attendance_percentage'].mean():.2f}%")
    print(f"Average CGPA: {df['current_cgpa'].mean():.2f}")

    return df

if __name__ == '__main__':
    generate_campus_dataset()
