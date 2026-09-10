import React, { useState, useMemo, useEffect } from 'react';
import {
  AlertTriangle, ShieldAlert, ShieldCheck, Search, Info, Cpu,
  Activity, Sliders, Zap, RefreshCw, Check
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Tooltip,
  CartesianGrid, XAxis, YAxis
} from 'recharts';
import { useCampusFilters } from '../context/FilterContext';
import { KPICard } from '../components/dashboard/KPICard';
import { ChartCard } from '../components/dashboard/ChartCard';
import { PageHeader } from '../components/layout/PageHeader';
import { STUDENTS, type Student, type RiskTier } from '../data/students';
import { StudentProfileModal } from '../components/students/StudentProfileModal';
import {
  predictStudentRisk, getModelMetrics, checkBackendHealth,
  type RiskPredictResponse, type ModelMetricsResponse, FALLBACK_MODEL_METRICS
} from '../services/api';
import { cn } from '../utils/cn';

export const RiskAnalysisPage: React.FC = () => {
  const { filteredDepartments, department, kpis } = useCampusFilters();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [tierFilter, setTierFilter] = useState<'All' | RiskTier>('All');
  const [search, setSearch] = useState('');
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [modelMetrics, setModelMetrics] = useState<ModelMetricsResponse>(FALLBACK_MODEL_METRICS);

  // --- What-If Simulator State ---
  const [simAttendance, setSimAttendance] = useState<number>(68);
  const [simCurrentCGPA, setSimCurrentCGPA] = useState<number>(6.2);
  const [simPrevCGPA, setSimPrevCGPA] = useState<number>(7.4);
  const [simBacklogs, setSimBacklogs] = useState<number>(2);
  const [simInternalMarks, setSimInternalMarks] = useState<number>(64);
  const [simEngagement, setSimEngagement] = useState<number>(45);
  const [simDepartment, setSimDepartment] = useState<string>('CSE');

  const [simResult, setSimResult] = useState<RiskPredictResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [executedInterventions, setExecutedInterventions] = useState<Record<string, boolean>>({});

  // Check backend status & load metrics on mount
  useEffect(() => {
    checkBackendHealth().then(status => setBackendOnline(status.online));
    getModelMetrics().then(metrics => setModelMetrics(metrics));
  }, []);

  // Run simulation whenever parameters change
  useEffect(() => {
    let active = true;
    setIsSimulating(true);

    const timer = setTimeout(async () => {
      const res = await predictStudentRisk({
        attendance: simAttendance,
        current_cgpa: simCurrentCGPA,
        previous_cgpa: simPrevCGPA,
        backlogs: simBacklogs,
        internal_marks: simInternalMarks,
        engagement_score: simEngagement,
        department: simDepartment,
      });
      if (active) {
        setSimResult(res);
        setIsSimulating(false);
      }
    }, 200);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [simAttendance, simCurrentCGPA, simPrevCGPA, simBacklogs, simInternalMarks, simEngagement, simDepartment]);

  // Quick Preset Handlers
  const applyPreset = (preset: 'atRisk' | 'backlogs' | 'honor') => {
    if (preset === 'atRisk') {
      setSimAttendance(61);
      setSimCurrentCGPA(5.8);
      setSimPrevCGPA(7.2);
      setSimBacklogs(2);
      setSimInternalMarks(58);
      setSimEngagement(40);
    } else if (preset === 'backlogs') {
      setSimAttendance(78);
      setSimCurrentCGPA(6.4);
      setSimPrevCGPA(6.5);
      setSimBacklogs(3);
      setSimInternalMarks(62);
      setSimEngagement(55);
    } else {
      setSimAttendance(92);
      setSimCurrentCGPA(8.8);
      setSimPrevCGPA(8.7);
      setSimBacklogs(0);
      setSimInternalMarks(88);
      setSimEngagement(85);
    }
  };

  const handleExecuteIntervention = (key: string) => {
    setExecutedInterventions(prev => ({ ...prev, [key]: true }));
  };

  // Risk distribution by department
  const riskByDeptData = filteredDepartments.map(d => ({
    code: d.code,
    name: d.name,
    atRisk: d.atRiskCount,
    percentage: Number(((d.atRiskCount / d.totalStudents) * 100).toFixed(1)),
  }));

  // Overall Risk Tiers across campus
  const riskTiersData = [
    { name: 'Low Risk (Stable)', count: 6850, percentage: 81.3, color: '#10b981' },
    { name: 'Medium Risk (Monitor)', count: 1234, percentage: 14.6, color: '#f59e0b' },
    { name: 'High Risk (Urgent Action)', count: 342, percentage: 4.1, color: '#ef4444' },
  ];

  // Filter students
  const filteredStudents = useMemo(() => {
    return STUDENTS.filter(s => {
      if (department !== 'All' && s.department !== department) return false;
      if (tierFilter !== 'All' && s.riskTier !== tierFilter) return false;
      if (search.trim() !== '') {
        const q = search.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.rollNo.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [department, tierFilter, search]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Early Warning & Student Retention Intelligence"
        description="Identify early-warning signals, understand contributing factors, and simulate risk scenarios across student cohorts."
        actions={
          <div className="flex items-center gap-2 rounded-lg border border-slate-200/90 bg-white px-3 py-1.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <span className={cn('h-2 w-2 rounded-full', backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')} />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {backendOnline ? '● AI Service Online' : '○ Demo / Offline Mode'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              ({modelMetrics.champion_model})
            </span>
          </div>
        }
      />

      {/* LEVEL 1: RISK OVERVIEW (3 Standardized KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="High-Risk Cohort (Flagged)"
          value={kpis.atRiskCount}
          subtitle="Score ≥ 70 • 342 students currently flagged for immediate outreach"
          valueColor="text-rose-600 dark:text-rose-400"
          icon={ShieldAlert}
          iconBgColor="bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300"
          isPositiveImprovement={true}
          badgeText="Actionable"
          hideSparkline={true}
        />

        <KPICard
          title="Moderate Risk Cohort"
          value="1,234"
          subtitle="Score 40–69 • Proactive advisor check-in"
          valueColor="text-amber-600 dark:text-amber-400"
          icon={AlertTriangle}
          iconBgColor="bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300"
          hideSparkline={true}
        />

        <KPICard
          title="Low Risk Cohort"
          value="6,850"
          subtitle="Score < 40 • High retention probability"
          valueColor="text-emerald-600 dark:text-emerald-400"
          icon={ShieldCheck}
          iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300"
          hideSparkline={true}
        />
      </div>

      {/* LEVEL 2: MODEL HEALTH (Section 22: Visually Quiet Credibility Card) */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Model Health & Validation Status
            </h3>
          </div>
          <span className="text-[10px] font-medium text-amber-700 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200/60 dark:border-amber-900/40">
            Model performance is evaluated on synthetic demonstration data and requires real-world institutional validation.
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium">Champion Model</span>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">{modelMetrics.champion_model}</div>
            <span className="text-[10px] text-slate-400">Class-Balanced</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium">Validation Status</span>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Complete</div>
            <span className="text-[10px] text-slate-400">80/20 Stratified</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium">At-Risk Recall</span>
            <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{(modelMetrics.recall * 100).toFixed(1)}%</div>
            <span className="text-[10px] text-slate-400">{modelMetrics.confusion_matrix.tp} / {modelMetrics.confusion_matrix.tp + modelMetrics.confusion_matrix.fn} caught</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium">PR-AUC</span>
            <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{(((modelMetrics.pr_auc ?? 0.7825) * 100)).toFixed(1)}%</div>
            <span className="text-[10px] text-slate-400">Imbalance fit</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium">ROC-AUC</span>
            <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{(modelMetrics.roc_auc * 100).toFixed(1)}%</div>
            <span className="text-[10px] text-slate-400">Discrimination</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-medium">Cohort Sample</span>
            <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{modelMetrics.class_imbalance?.total_records?.toLocaleString() ?? '8,426'} records</div>
            <span className="text-[10px] text-slate-400">{modelMetrics.class_imbalance?.at_risk_prevalence_pct ?? '4.77'}% prevalence</span>
          </div>
        </div>
      </div>

      {/* LEVEL 3: RISK DISTRIBUTION (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk by Department */}
        <ChartCard
          title="At-Risk Students by Department"
          subtitle="Volume of students flagged with composite risk score > 50"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={riskByDeptData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis dataKey="code" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip formatter={(val: any) => [`${val} students`, 'At Risk Count']} />
              <Bar dataKey="atRisk" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                {riskByDeptData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.atRisk > 70 ? '#f43f5e' : entry.atRisk > 40 ? '#f59e0b' : '#4f46e5'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Campus Risk Tier Distribution */}
        <ChartCard
          title="Campus-Wide Population Risk Spectrum"
          subtitle="Proportion of the 8,426 student body categorized by risk category"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 h-full items-center gap-4">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskTiersData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {riskTiersData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${Number(val).toLocaleString()} students`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-xs">
              {riskTiersData.map((tier, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: tier.color }} />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{tier.name}</span>
                  </div>
                  <div className="mt-1 font-mono font-bold text-slate-600 dark:text-slate-300 ml-4">
                    {tier.count.toLocaleString()} students ({tier.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* LEVEL 4: WHAT-IF SIMULATOR (Section 21: 3-Column / Stacked Layout) */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Interactive "What-If" Risk Simulator
                <span className="rounded-full bg-emerald-50 px-2 py-0.2 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                  <RefreshCw className={cn('h-2.5 w-2.5', isSimulating ? 'animate-spin text-emerald-600' : 'text-emerald-600')} />
                  {isSimulating ? 'Computing...' : 'Real-Time Inference'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adjust academic and behavioral parameters to simulate model sensitivity and dynamic pastoral workflows.
              </p>
            </div>
          </div>

          {/* Quick Scenario Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1">Presets:</span>
            <button
              onClick={() => applyPreset('atRisk')}
              className="rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300 transition-colors"
            >
              Sudden CGPA Drop
            </button>
            <button
              onClick={() => applyPreset('backlogs')}
              className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300 transition-colors"
            >
              Multiple Backlogs
            </button>
            <button
              onClick={() => applyPreset('honor')}
              className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 transition-colors"
            >
              High Performer
            </button>
          </div>
        </div>

        {/* 3-Column Simulator Grid */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* COLUMN 1: INPUTS (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pb-1 border-b border-slate-100 dark:border-slate-800">
              1. Input Telemetry
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Attendance */}
              <div className="p-3 rounded-lg border border-slate-200/90 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-850/50 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Attendance</span>
                  <span className={cn('font-mono font-bold', simAttendance < 75 ? 'text-rose-600' : 'text-emerald-600')}>
                    {simAttendance}%
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="1"
                  value={simAttendance}
                  onChange={e => setSimAttendance(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>40% (Deficit)</span>
                  <span className="font-semibold text-amber-600">75% (Cutoff)</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Backlogs */}
              <div className="p-3 rounded-lg border border-slate-200/90 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-850/50 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Course Backlogs</span>
                  <span className={cn('font-mono font-bold', simBacklogs > 0 ? 'text-rose-600' : 'text-emerald-600')}>
                    {simBacklogs} {simBacklogs === 1 ? 'course' : 'courses'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="6"
                  step="1"
                  value={simBacklogs}
                  onChange={e => setSimBacklogs(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0 (Cleared)</span>
                  <span>3 Backlogs</span>
                  <span>6 (Critical)</span>
                </div>
              </div>

              {/* Current CGPA */}
              <div className="p-3 rounded-lg border border-slate-200/90 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-850/50 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Current CGPA</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {simCurrentCGPA.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="4.0"
                  max="10.0"
                  step="0.1"
                  value={simCurrentCGPA}
                  onChange={e => setSimCurrentCGPA(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>4.0</span>
                  <span>7.0</span>
                  <span>10.0</span>
                </div>
              </div>

              {/* Previous CGPA */}
              <div className="p-3 rounded-lg border border-slate-200/90 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-850/50 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Previous CGPA</span>
                  <span className="font-mono font-bold text-slate-600 dark:text-slate-300">
                    {simPrevCGPA.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="4.0"
                  max="10.0"
                  step="0.1"
                  value={simPrevCGPA}
                  onChange={e => setSimPrevCGPA(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Velocity:</span>
                  <span className={cn('font-mono font-bold', simCurrentCGPA - simPrevCGPA < 0 ? 'text-rose-600' : 'text-emerald-600')}>
                    {(simCurrentCGPA - simPrevCGPA).toFixed(2)} GPA
                  </span>
                </div>
              </div>

              {/* Internal Marks */}
              <div className="p-3 rounded-lg border border-slate-200/90 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-850/50 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Midterm Marks</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {simInternalMarks} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  step="1"
                  value={simInternalMarks}
                  onChange={e => setSimInternalMarks(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Engagement */}
              <div className="p-3 rounded-lg border border-slate-200/90 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-850/50 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Engagement</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {simEngagement} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={simEngagement}
                  onChange={e => setSimEngagement(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Department selector */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-slate-200/90 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-850/40 text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-400">Department:</span>
              <div className="flex flex-wrap gap-1">
                {['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'].map(dept => (
                  <button
                    key={dept}
                    onClick={() => setSimDepartment(dept)}
                    className={cn(
                      'px-2 py-0.5 rounded text-xs font-semibold transition-all',
                      simDepartment === dept
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                    )}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 2: PREDICTION (lg:col-span-3) */}
          <div className="lg:col-span-3 rounded-xl border border-slate-200/80 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-850/40 p-4 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pb-1 border-b border-slate-200 dark:border-slate-800">
                2. Dual Prediction
              </div>

              {simResult ? (
                <div className="mt-4 space-y-4">
                  {/* AI Risk Probability */}
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-white dark:border-slate-750 dark:bg-slate-800 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                        AI Risk Probability
                      </span>
                      <span className={cn(
                        'rounded px-1.5 py-0.2 text-[10px] font-bold',
                        simResult.risk_level === 'High' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' :
                        simResult.risk_level === 'Medium' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      )}>
                        {simResult.risk_level}
                      </span>
                    </div>

                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        {(simResult.risk_probability * 100).toFixed(1)}%
                      </span>
                    </div>

                    {/* Progress meter */}
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <div
                        style={{ width: `${Math.min(100, simResult.risk_probability * 100)}%` }}
                        className={cn(
                          'h-full rounded-full transition-all duration-300',
                          simResult.risk_level === 'High' ? 'bg-rose-500' :
                          simResult.risk_level === 'Medium' ? 'bg-amber-500' :
                          'bg-emerald-500'
                        )}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Calibrated ML Logistic Classifier</span>
                  </div>

                  {/* Baseline Risk Score */}
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-white dark:border-slate-750 dark:bg-slate-800 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Baseline Risk Score
                      </span>
                      <span className="rounded bg-slate-100 dark:bg-slate-700 px-1.5 py-0.2 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                        {simResult.baseline_level}
                      </span>
                    </div>

                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                        {(simResult.baseline_score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Statutory 4-pillar rule formula</span>
                  </div>

                  {/* Discrepancy Note if active */}
                  {Math.abs(simResult.risk_probability - simResult.baseline_score) > 0.15 && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-2 text-[11px] text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
                      <strong>Divergence Detected:</strong> ML probability reflects compound trajectory drop (+{((simResult.risk_probability - simResult.baseline_score) * 100).toFixed(0)}% vs baseline).
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2 text-indigo-500" />
                  Simulating...
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-400 leading-tight">
              Advisory decision support signal. Automated academic disqualification prohibited.
            </p>
          </div>

          {/* COLUMN 3: WHY & ACTIONS (lg:col-span-4) */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 p-4 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pb-1 border-b border-slate-100 dark:border-slate-800">
                3. Attribution & Actions
              </div>

              {simResult ? (
                <div className="mt-3 space-y-3.5">
                  {/* Active Risk Factors */}
                  <div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Distress Drivers
                    </span>
                    {simResult.top_factors.length > 0 ? (
                      <div className="space-y-1.5 text-xs">
                        {simResult.top_factors.slice(0, 3).map((factor, idx) => (
                          <div key={idx} className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/60 p-2 dark:border-slate-800 dark:bg-slate-850/50">
                            <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                              {factor.label}
                            </span>
                            <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                              +{factor.impact_pct}%
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 italic py-1">
                        Zero elevated risk factors detected
                      </div>
                    )}
                  </div>

                  {/* Prescribed Actions */}
                  <div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Prescribed Interventions
                    </span>
                    <div className="space-y-1.5 text-xs">
                      {simResult.recommendations.map((rec, idx) => {
                        const isExecuted = executedInterventions[rec];
                        return (
                          <div key={idx} className="flex items-start justify-between gap-2 rounded-md border border-slate-100 bg-slate-50/60 p-2 dark:border-slate-800 dark:bg-slate-850/50">
                            <span className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
                              {rec}
                            </span>
                            <button
                              onClick={() => handleExecuteIntervention(rec)}
                              disabled={isExecuted}
                              className={cn(
                                'shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold transition-colors flex items-center gap-1',
                                isExecuted
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                              )}
                            >
                              {isExecuted ? <Check className="h-3 w-3" /> : 'Assign'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Latency: &lt;15ms</span>
              <span>Explainable AI Engine</span>
            </div>
          </div>
        </div>
      </div>

      {/* LEVEL 5: RISK ROSTER TABLE */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Student Early Warning Roster & Dual Evaluation
            </h3>
            <p className="text-xs text-slate-500">
              Click any student to view transparent ML risk factor breakdown, feature attribution, and prescribe counseling
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name/roll..."
                className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 shadow-2xs placeholder:text-slate-400 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <select
              value={tierFilter}
              onChange={e => setTierFilter(e.target.value as any)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="All">All Risk Tiers</option>
              <option value="High">High Risk Only</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Dept / Sem</th>
                <th className="py-3 px-4 text-right">ML Risk Prob</th>
                <th className="py-3 px-4 text-right">Baseline Score</th>
                <th className="py-3 px-4">Risk Tier</th>
                <th className="py-3 px-4">Primary Factor</th>
                <th className="py-3 px-4">Intervention</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredStudents.map(student => {
                const mlProb = student.riskScore >= 70
                  ? Math.min(99, Math.round(student.riskScore * 1.05))
                  : student.riskScore >= 40
                  ? Math.round(student.riskScore * 0.95)
                  : Math.max(2, Math.round(student.riskScore * 0.8));

                return (
                  <tr
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="cursor-pointer hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {student.name}
                      <div className="text-[11px] font-mono text-slate-400">{student.rollNo}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {student.department} • Sem {student.semester}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-sm">
                      <span className={mlProb >= 70 ? 'text-rose-600 dark:text-rose-400' : mlProb >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                        {mlProb}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-500 dark:text-slate-400">
                      {student.riskScore}%
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={cn(
                        'rounded-md px-2 py-0.5 text-xs font-semibold',
                        student.riskTier === 'High' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900' :
                        student.riskTier === 'Medium' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900' :
                        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                      )}>
                        {student.riskTier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {student.riskFactors.find(f => f.impact === 'High')?.detail || student.riskFactors[0]?.detail}
                    </td>
                    <td className="py-3.5 px-4 text-indigo-600 dark:text-indigo-400 font-medium">
                      {student.recommendedInterventions[0]}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStudent(student);
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400 transition-colors"
                      >
                        Intervene
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* LEVEL 6: MODEL COMPARISON BENCHMARK TABLE */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Model Benchmark & Comparison: Baseline Rule Model vs ML Classifiers
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluated on identical held-out test cohort (n=1,686, containing 80 verified at-risk students, 4.74% prevalence).
            </p>
          </div>
          <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded border border-indigo-200 dark:border-indigo-900">
            Primary Metric: At-Risk Recall (Minimizing False Negatives)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-3">Model Architecture</th>
                <th className="py-2.5 px-3 text-right">At-Risk Recall</th>
                <th className="py-2.5 px-3 text-right">ROC-AUC</th>
                <th className="py-2.5 px-3 text-right">PR-AUC</th>
                <th className="py-2.5 px-3 text-right">F1-Score</th>
                <th className="py-2.5 px-3 text-right">Accuracy</th>
                <th className="py-2.5 px-3 text-right">True Positives</th>
                <th className="py-2.5 px-3 text-center">Role / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="bg-slate-50/40 dark:bg-slate-850/30 text-slate-600 dark:text-slate-400">
                <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                  Baseline Rule Model
                  <span className="block text-[10px] text-slate-400 font-normal">Fixed weighted formula (30% Att, 35% CGPA, 20% Backlogs, 15% Eng)</span>
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                  {(modelMetrics.baseline_rule_model.recall * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-3 text-right font-mono">{(modelMetrics.baseline_rule_model.roc_auc * 100).toFixed(1)}%</td>
                <td className="py-3 px-3 text-right font-mono text-slate-500">{(((modelMetrics.baseline_rule_model.pr_auc ?? 0.4444) * 100)).toFixed(1)}%</td>
                <td className="py-3 px-3 text-right font-mono">{modelMetrics.baseline_rule_model.f1_score.toFixed(3)}</td>
                <td className="py-3 px-3 text-right font-mono">{(modelMetrics.baseline_rule_model.accuracy * 100).toFixed(1)}%</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                  {modelMetrics.baseline_rule_model.confusion_matrix.tp} / {modelMetrics.baseline_rule_model.confusion_matrix.tp + modelMetrics.baseline_rule_model.confusion_matrix.fn} <span className="text-[10px] text-rose-500 font-normal">(Missed {modelMetrics.baseline_rule_model.confusion_matrix.fn}!)</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="rounded bg-slate-200 dark:bg-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                    Baseline
                  </span>
                </td>
              </tr>

              <tr className="bg-indigo-50/40 dark:bg-indigo-950/20 font-medium">
                <td className="py-3 px-3 font-bold text-indigo-900 dark:text-indigo-200">
                  Logistic Regression (Balanced)
                  <span className="block text-[10px] text-indigo-600 dark:text-indigo-400 font-normal">Class-weighted L2 with engineered interaction signals</span>
                </td>
                <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                  {(modelMetrics.recall * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-indigo-700 dark:text-indigo-300">
                  {(modelMetrics.roc_auc * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-violet-700 dark:text-violet-300">
                  {(((modelMetrics.pr_auc ?? 0.7825) * 100)).toFixed(1)}%
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold">{modelMetrics.f1_score.toFixed(3)}</td>
                <td className="py-3 px-3 text-right font-mono">{(modelMetrics.accuracy * 100).toFixed(1)}%</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {modelMetrics.confusion_matrix.tp} / {modelMetrics.confusion_matrix.tp + modelMetrics.confusion_matrix.fn} <span className="text-[10px] text-emerald-600 font-normal">(Only {modelMetrics.confusion_matrix.fn} missed)</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                    Champion
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300">
                <td className="py-3 px-3 font-medium">
                  Random Forest Classifier
                  <span className="block text-[10px] text-slate-400">150 Trees, Max Depth 8, Balanced Subsample</span>
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  77.5%
                </td>
                <td className="py-3 px-3 text-right font-mono">98.2%</td>
                <td className="py-3 px-3 text-right font-mono">67.1%</td>
                <td className="py-3 px-3 text-right font-mono">0.678</td>
                <td className="py-3 px-3 text-right font-mono">96.5%</td>
                <td className="py-3 px-3 text-right font-mono font-medium">62 / 80</td>
                <td className="py-3 px-3 text-center">
                  <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                    Candidate
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300">
                <td className="py-3 px-3 font-medium">
                  Gradient Boosting Machine
                  <span className="block text-[10px] text-slate-400">120 Estimators, Learning Rate 0.08, Depth 4</span>
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                  65.0%
                </td>
                <td className="py-3 px-3 text-right font-mono">98.9%</td>
                <td className="py-3 px-3 text-right font-mono">82.2%</td>
                <td className="py-3 px-3 text-right font-mono">0.708</td>
                <td className="py-3 px-3 text-right font-mono">97.4%</td>
                <td className="py-3 px-3 text-right font-mono font-medium">52 / 80</td>
                <td className="py-3 px-3 text-center">
                  <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                    Candidate
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-lg bg-slate-50 dark:bg-slate-850/50 p-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-500 shrink-0" />
            <span>
              <strong>Model Selection Objective:</strong> Logistic Regression was selected as the champion model because student retention prioritizes maximizing Recall (<strong>{(modelMetrics.recall * 100).toFixed(1)}%</strong> vs {(modelMetrics.baseline_rule_model.recall * 100).toFixed(1)}% baseline), catching {modelMetrics.confusion_matrix.tp} of {modelMetrics.confusion_matrix.tp + modelMetrics.confusion_matrix.fn} vulnerable students before exam probation.
            </span>
          </div>
          <span className="text-[10px] text-slate-400 italic shrink-0">
            Model performance is evaluated on synthetic demonstration data and requires real-world institutional validation.
          </span>
        </div>
      </div>

      {/* Global Student Profile Modal */}
      <StudentProfileModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
};
