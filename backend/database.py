"""
Database Layer for CampusPulse BI
Structured data store managing students, departments, and relational campus entities.
Prepared for straightforward migration to PostgreSQL via SQLAlchemy / asyncpg.
"""

import os
import pandas as pd
from typing import List, Dict, Any, Optional

class Database:
    _instance = None

    def __init__(self):
        self.data_path = "ml/data/raw/campus_students_8426.csv"
        self._load_data()

    def _load_data(self):
        if os.path.exists(self.data_path):
            self.students_df = pd.read_csv(self.data_path)
        else:
            from ml.src.dataset_generator import generate_campus_dataset
            self.students_df = generate_campus_dataset(self.data_path)

        # Department definitions consistent with institutional dataset
        self.departments = [
            {
                'id': 'dept-cse',
                'code': 'CSE',
                'name': 'Computer Science & Engineering',
                'hod': 'Dr. Aris Thorne',
                'total_students': 2140,
                'faculty_count': 138,
                'avg_cgpa': 8.12,
                'avg_attendance': 84.6,
                'placement_rate': 89.2,
                'internship_rate': 76.5,
                'at_risk_count': 38,
                'avg_package_lpa': 12.8,
                'highest_package_lpa': 48.0
            },
            {
                'id': 'dept-it',
                'code': 'IT',
                'name': 'Information Technology',
                'hod': 'Dr. Meera Nambiar',
                'total_students': 1380,
                'faculty_count': 92,
                'avg_cgpa': 7.95,
                'avg_attendance': 83.1,
                'placement_rate': 86.4,
                'internship_rate': 72.8,
                'at_risk_count': 29,
                'avg_package_lpa': 10.9,
                'highest_package_lpa': 42.5
            },
            {
                'id': 'dept-ece',
                'code': 'ECE',
                'name': 'Electronics & Communication',
                'hod': 'Dr. Vikramaditya Sen',
                'total_students': 1680,
                'faculty_count': 112,
                'avg_cgpa': 7.74,
                'avg_attendance': 81.8,
                'placement_rate': 81.5,
                'internship_rate': 66.4,
                'at_risk_count': 62,
                'avg_package_lpa': 9.4,
                'highest_package_lpa': 36.0
            },
            {
                'id': 'dept-eee',
                'code': 'EEE',
                'name': 'Electrical & Electronics Engineering',
                'hod': 'Dr. Shalini Rao',
                'total_students': 1120,
                'faculty_count': 75,
                'avg_cgpa': 7.46,
                'avg_attendance': 79.5,
                'placement_rate': 73.2,
                'internship_rate': 58.1,
                'at_risk_count': 58,
                'avg_package_lpa': 8.2,
                'highest_package_lpa': 28.0
            },
            {
                'id': 'dept-mech',
                'code': 'Mechanical',
                'name': 'Mechanical Engineering',
                'hod': 'Dr. Rajeshwar Kulkarni',
                'total_students': 1250,
                'faculty_count': 84,
                'avg_cgpa': 7.28,
                'avg_attendance': 78.9,
                'placement_rate': 68.4,
                'internship_rate': 54.0,
                'at_risk_count': 84,
                'avg_package_lpa': 7.5,
                'highest_package_lpa': 24.0
            },
            {
                'id': 'dept-civil',
                'code': 'Civil',
                'name': 'Civil Engineering',
                'hod': 'Dr. Anita Banerjee',
                'total_students': 856,
                'faculty_count': 58,
                'avg_cgpa': 7.15,
                'avg_attendance': 77.8,
                'placement_rate': 62.1,
                'internship_rate': 48.6,
                'at_risk_count': 71,
                'avg_package_lpa': 6.8,
                'highest_package_lpa': 21.0
            },
        ]

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = Database()
        return cls._instance

    def get_all_students(self, department: Optional[str] = None, semester: Optional[int] = None, limit: int = 100) -> List[Dict[str, Any]]:
        df = self.students_df
        if department and department != 'All':
            df = df[df['department'] == department]
        if semester and semester > 0:
            df = df[df['semester'] == semester]
        return df.head(limit).to_dict(orient='records')

    def get_student_by_id(self, student_id: str) -> Optional[Dict[str, Any]]:
        match = self.students_df[self.students_df['student_id'] == student_id]
        if len(match) == 0:
            return None
        return match.iloc[0].to_dict()

    def get_departments(self) -> List[Dict[str, Any]]:
        return self.departments
