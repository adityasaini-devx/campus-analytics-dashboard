"""
Pydantic Data Contracts & Schemas for CampusPulse BI Backend
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# --- Health Check ---
class HealthResponse(BaseModel):
    status: str = "operational"
    service: str = "CampusPulse BI Intelligence API"
    version: str = "v1.2"
    timestamp: str

# --- Prediction Schemas ---
class RiskPredictRequest(BaseModel):
    attendance: float = Field(..., ge=0.0, le=100.0, description="Attendance percentage (0-100)")
    current_cgpa: float = Field(..., ge=0.0, le=10.0, description="Cumulative CGPA (0-10.0)")
    previous_cgpa: float = Field(..., ge=0.0, le=10.0, description="Previous semester CGPA (0-10.0)")
    backlogs: int = Field(0, ge=0, le=20, description="Number of unresolved backlogs")
    internal_marks: Optional[float] = Field(70.0, ge=0.0, le=100.0, description="Continuous assessment score (0-100)")
    assignment_score: Optional[float] = Field(75.0, ge=0.0, le=100.0, description="Assignment score (0-100)")
    engagement_score: Optional[float] = Field(60.0, ge=0.0, le=100.0, description="Campus event & club participation (0-100)")
    department: Optional[str] = Field("CSE", description="Department code (CSE, IT, ECE, EEE, Mechanical, Civil)")
    semester: Optional[int] = Field(6, ge=1, le=8, description="Academic semester (1-8)")
    credits_completed: Optional[int] = Field(120, ge=0, description="Cumulative credits completed")
    internship_status: Optional[str] = Field("None", description="Completed, Ongoing, or None")
    placement_status: Optional[str] = Field("In Process", description="Placement standing")

class RiskFactorItem(BaseModel):
    feature: str
    label: str
    impact_pct: float
    attribution: float
    type: str  # 'risk_driver' or 'protective_driver'
    category: str

class RiskPredictResponse(BaseModel):
    risk_probability: float
    risk_level: str  # 'High', 'Medium', 'Low'
    baseline_score: float
    baseline_level: str
    top_factors: List[RiskFactorItem]
    protective_factors: List[RiskFactorItem]
    recommendations: List[str]

# --- Student Schemas ---
class StudentSummary(BaseModel):
    id: str
    roll_no: str
    name: str
    department: str
    semester: int
    cgpa: float
    attendance: float
    backlogs: int
    placement_status: str
    risk_tier: str
    risk_score: float

class StudentDetail(StudentSummary):
    email: str
    credits: int
    internship_status: str
    skills: List[str]
    mentor: str
    semester_history: List[Dict[str, Any]]
    subject_attendance: List[Dict[str, Any]]
    risk_factors: List[RiskFactorItem]
    protective_factors: List[RiskFactorItem]
    recommended_interventions: List[str]

# --- Department Schemas ---
class DepartmentSummary(BaseModel):
    id: str
    code: str
    name: str
    hod: string = "Dr. Department Head" if False else str
    total_students: int
    faculty_count: int
    avg_cgpa: float
    avg_attendance: float
    placement_rate: float
    internship_rate: float
    at_risk_count: int
    avg_package_lpa: float
    highest_package_lpa: float

# --- Dashboard & Metrics Schemas ---
class DashboardSummary(BaseModel):
    total_students: int
    avg_attendance: float
    avg_cgpa: float
    placement_rate: float
    internship_rate: float
    at_risk_count: int
    departments_count: int
    trends: Dict[str, float]

class ModelMetricsResponse(BaseModel):
    champion_model: str
    model_version: str
    training_records: int
    test_records: int
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    pr_auc: Optional[float] = 0.7825
    confusion_matrix: Dict[str, int]
    baseline_rule_model: Dict[str, Any]
    comparison: Dict[str, Any]
    top_feature_importances: List[Dict[str, Any]]
    class_imbalance: Optional[Dict[str, Any]] = None

class InsightItem(BaseModel):
    id: str
    category: str
    type: str  # 'positive', 'warning', 'critical', 'info'
    title: str
    description: str
    metric: Optional[str] = None
    recommendation: Optional[str] = None
    department: Optional[str] = None
    timestamp: str
