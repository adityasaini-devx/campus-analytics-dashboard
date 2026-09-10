/**
 * CampusPulse BI - Intelligence API Service Client
 * Connects React frontend to FastAPI backend (http://localhost:8000)
 * Includes seamless offline fallback to local inference if backend is offline.
 */

export interface RiskFactorItem {
  feature: string;
  label: string;
  impact_pct: number;
  attribution: number;
  type: 'risk_driver' | 'protective_driver';
  category: string;
}

export interface RiskPredictRequest {
  attendance: number;
  current_cgpa: number;
  previous_cgpa: number;
  backlogs: number;
  internal_marks?: number;
  assignment_score?: number;
  engagement_score?: number;
  department?: string;
  semester?: number;
  credits_completed?: number;
  internship_status?: string;
  placement_status?: string;
}

export interface RiskPredictResponse {
  risk_probability: number;
  risk_level: 'High' | 'Medium' | 'Low';
  baseline_score: number;
  baseline_level: 'High' | 'Medium' | 'Low';
  top_factors: RiskFactorItem[];
  protective_factors: RiskFactorItem[];
  recommendations: string[];
}

export interface ModelComparisonMetrics {
  accuracy: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  precision?: number;
}

export interface ModelMetricsResponse {
  champion_model: string;
  model_version: string;
  training_records: number;
  test_records: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  pr_auc?: number;
  class_imbalance?: {
    total_records: number;
    at_risk_records: number;
    at_risk_prevalence_pct: number;
    test_records: number;
    test_at_risk_records: number;
    test_at_risk_pct: number;
  };
  confusion_matrix: {
    tn: number;
    fp: number;
    fn: number;
    tp: number;
  };
  baseline_rule_model: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    roc_auc: number;
    pr_auc?: number;
    confusion_matrix: {
      tn: number;
      fp: number;
      fn: number;
      tp: number;
    };
  };
  comparison: {
    models: Record<string, ModelComparisonMetrics>;
  };
  top_feature_importances: Array<{
    feature: string;
    importance: number;
  }>;
}

export interface DashboardSummary {
  total_students: number;
  avg_attendance: number;
  avg_cgpa: number;
  placement_rate: number;
  internship_rate: number;
  at_risk_count: number;
  departments_count: number;
  trends: Record<string, number>;
}

export interface InsightItem {
  id: string;
  category: string;
  type: 'positive' | 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  metric?: string;
  recommendation?: string;
  department?: string;
  timestamp: string;
}

const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Fallback static test-set model metrics calibrated from ml/models/model_metrics.json
 */
export const FALLBACK_MODEL_METRICS: ModelMetricsResponse = {
  champion_model: 'Logistic Regression',
  model_version: 'v1.2-enterprise',
  training_records: 6740,
  test_records: 1686,
  accuracy: 0.9514,
  precision: 0.4933,
  recall: 0.9250,
  f1_score: 0.6435,
  roc_auc: 0.9844,
  pr_auc: 0.7825,
  class_imbalance: {
    total_records: 8426,
    at_risk_records: 402,
    at_risk_prevalence_pct: 4.77,
    test_records: 1686,
    test_at_risk_records: 80,
    test_at_risk_pct: 4.74,
  },
  confusion_matrix: {
    tn: 1530,
    fp: 76,
    fn: 6,
    tp: 74,
  },
  baseline_rule_model: {
    accuracy: 0.9561,
    precision: 0.7500,
    recall: 0.1125,
    f1_score: 0.1957,
    roc_auc: 0.9290,
    pr_auc: 0.4444,
    confusion_matrix: {
      tn: 1603,
      fp: 3,
      fn: 71,
      tp: 9,
    },
  },
  comparison: {
    models: {
      'Baseline Rule Model': {
        accuracy: 0.9561,
        recall: 0.1125,
        f1_score: 0.1957,
        roc_auc: 0.9290,
      },
      'Logistic Regression': {
        accuracy: 0.9514,
        recall: 0.9250,
        f1_score: 0.6435,
        roc_auc: 0.9844,
      },
      'Random Forest': {
        accuracy: 0.9650,
        recall: 0.7750,
        f1_score: 0.6776,
        roc_auc: 0.9818,
      },
      'Gradient Boosting': {
        accuracy: 0.9745,
        recall: 0.6500,
        f1_score: 0.7075,
        roc_auc: 0.9893,
      },
    },
  },
  top_feature_importances: [
    { feature: 'cgpa_change', importance: 1.9413 },
    { feature: 'current_cgpa', importance: 1.6167 },
    { feature: 'backlogs', importance: 1.3646 },
    { feature: 'attendance_gap', importance: 1.2121 },
    { feature: 'previous_cgpa', importance: 0.8398 },
    { feature: 'cgpa_trend_improving', importance: 0.7906 },
    { feature: 'internal_marks', importance: 0.5767 },
    { feature: 'internal_discrepancy', importance: 0.5457 },
    { feature: 'multiple_backlogs', importance: 0.5366 },
    { feature: 'cgpa_trend_stable', importance: 0.5322 },
    { feature: 'severe_attendance_deficit', importance: 0.5144 },
    { feature: 'compound_vulnerability', importance: 0.4668 },
  ],
};

/**
 * Local simulation of ML inference for when backend server is not running
 */
function localSimulatedInference(input: RiskPredictRequest): RiskPredictResponse {
  const attendance = input.attendance;
  const current_cgpa = input.current_cgpa;
  const previous_cgpa = input.previous_cgpa;
  const backlogs = input.backlogs || 0;
  const internal = input.internal_marks ?? 70;
  const engagement = input.engagement_score ?? 60;

  // 1. Calculate Baseline Rule Score (0.0 to 1.0)
  const attDeficit = Math.max(0, (75.0 - attendance) / 75.0);
  const attScore = Math.min(1.0, attDeficit * 1.5);
  const cgpaDiff = previous_cgpa - current_cgpa;
  const cgpaScore = cgpaDiff > 0 ? Math.min(1.0, cgpaDiff / 1.5) : 0.0;
  const backlogScore = Math.min(1.0, backlogs / 3.0);
  const engageScore = Math.max(0, (50.0 - engagement) / 50.0);

  const baseline_score = Number(
    (0.30 * attScore + 0.35 * cgpaScore + 0.20 * backlogScore + 0.15 * engageScore).toFixed(3)
  );
  const baseline_level = baseline_score >= 0.70 ? 'High' : baseline_score >= 0.40 ? 'Medium' : 'Low';

  // 2. Calculate ML Probability (calibrated Logistic formulation)
  const cgpa_change = current_cgpa - previous_cgpa;
  const attendance_gap = Math.max(0, 75.0 - attendance);
  const compound = (attendance < 75 && backlogs > 0) ? 1.0 : 0.0;
  const academic_decline = cgpa_change < -0.3 ? 1.0 : 0.0;

  let z = -2.85; // Calibrated intercept for ~4.8% prior
  z += (cgpa_change < 0 ? Math.abs(cgpa_change) * 2.2 : -cgpa_change * 1.1);
  z += (8.0 - current_cgpa) * 0.75;
  z += backlogs * 1.4;
  z += attendance_gap * 0.18;
  z += compound * 1.6;
  z += academic_decline * 1.2;
  z -= (internal - 60) * 0.04;
  z -= (engagement - 50) * 0.02;

  const prob = 1.0 / (1.0 + Math.exp(-z));
  const risk_probability = Number(Math.min(0.999, Math.max(0.001, prob)).toFixed(3));
  const risk_level = risk_probability >= 0.65 ? 'High' : risk_probability >= 0.35 ? 'Medium' : 'Low';

  // Factors
  const top_factors: RiskFactorItem[] = [];
  const protective_factors: RiskFactorItem[] = [];

  if (cgpa_change < -0.1) {
    top_factors.push({
      feature: 'cgpa_change',
      label: 'Semester CGPA Trend',
      impact_pct: Number((Math.abs(cgpa_change) * 16).toFixed(1)),
      attribution: 4.5,
      type: 'risk_driver',
      category: 'Academic',
    });
  }
  if (attendance < 75) {
    top_factors.push({
      feature: 'attendance_gap',
      label: 'Attendance Below 75% Cutoff',
      impact_pct: Number(((75 - attendance) * 0.8).toFixed(1)),
      attribution: 4.1,
      type: 'risk_driver',
      category: 'Attendance',
    });
  }
  if (backlogs > 0) {
    top_factors.push({
      feature: 'backlogs',
      label: 'Active Course Backlogs',
      impact_pct: Number((backlogs * 12.5).toFixed(1)),
      attribution: 3.8,
      type: 'risk_driver',
      category: 'Curriculum',
    });
  }
  if (current_cgpa < 6.5) {
    top_factors.push({
      feature: 'current_cgpa',
      label: 'Low Cumulative CGPA',
      impact_pct: Number(((7.0 - current_cgpa) * 10).toFixed(1)),
      attribution: 3.0,
      type: 'risk_driver',
      category: 'Academic',
    });
  }

  // Protective
  if (attendance >= 75) {
    protective_factors.push({
      feature: 'attendance_percentage',
      label: 'Consistent Class Attendance',
      impact_pct: -6.5,
      attribution: -1.2,
      type: 'protective_driver',
      category: 'Attendance',
    });
  }
  if (internal >= 65) {
    protective_factors.push({
      feature: 'internal_marks',
      label: 'Strong Continuous Assessment',
      impact_pct: -4.8,
      attribution: -0.9,
      type: 'protective_driver',
      category: 'Academic',
    });
  }
  if (engagement >= 60) {
    protective_factors.push({
      feature: 'engagement_score',
      label: 'Active Club/Event Participation',
      impact_pct: -3.2,
      attribution: -0.6,
      type: 'protective_driver',
      category: 'Engagement',
    });
  }

  // Recommendations
  const recommendations: string[] = [];
  if (attendance < 75) {
    recommendations.push('Mandatory Attendance Counseling: Review morning session and laboratory absences.');
  }
  if (cgpa_change < -0.2 || current_cgpa < 6.5) {
    recommendations.push('Academic Tutoring Intervention: Assign departmental peer mentor for core remediation.');
  }
  if (backlogs > 0) {
    recommendations.push('Backlog Clearance Blueprint: Schedule remedial doubt-clearing sessions before exams.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Routine Academic Advising: Student demonstrates sound academic resilience.');
  }

  return {
    risk_probability,
    risk_level,
    baseline_score,
    baseline_level,
    top_factors,
    protective_factors,
    recommendations,
  };
}

/**
 * Predict risk probability and explainability factors for a student profile
 */
export async function predictStudentRisk(data: RiskPredictRequest): Promise<RiskPredictResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${API_BASE_URL}/risk/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      return await response.json();
    }
  } catch (_err) {
    // Backend offline or timed out, gracefully use calibrated client fallback
  }

  return localSimulatedInference(data);
}

/**
 * Fetch ML Model test-set metrics and comparison data
 */
export async function getModelMetrics(): Promise<ModelMetricsResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${API_BASE_URL}/model/metrics`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      return await response.json();
    }
  } catch (_err) {
    // Graceful fallback
  }

  return FALLBACK_MODEL_METRICS;
}

/**
 * Check backend connection status
 */
export async function checkBackendHealth(): Promise<{ online: boolean; version?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const response = await fetch(`${API_BASE_URL}/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return { online: true, version: data.version };
    }
  } catch {
    // Offline
  }

  return { online: false };
}
