import React, { useState, useEffect } from 'react';
import {
  X, AlertTriangle, AlertCircle, ShieldCheck, GraduationCap, Clock,
  User, Mail, Zap, ArrowUpRight, Check
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { type Student, getStudentSemesterHistory, getStudentSubjectAttendance } from '../../data/students';
import { predictStudentRisk, type RiskPredictResponse } from '../../services/api';
import { cn } from '../../utils/cn';

interface StudentProfileModalProps {
  student: Student | null;
  onClose: () => void;
  onInterventionAction?: (student: Student, action: string) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
  onInterventionAction,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'attendance' | 'details'>('profile');
  const [executedActions, setExecutedActions] = useState<Record<string, boolean>>({});
  const [prediction, setPrediction] = useState<RiskPredictResponse | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState<boolean>(false);

  useEffect(() => {
    if (!student) return;

    setExecutedActions({});
    setLoadingPrediction(true);

    const semHistory = getStudentSemesterHistory(student);
    const prevCgpa = semHistory.length > 1 ? semHistory[semHistory.length - 2].cgpa : student.cgpa;

    predictStudentRisk({
      attendance: student.attendance,
      current_cgpa: student.cgpa,
      previous_cgpa: prevCgpa,
      backlogs: student.backlogs,
      department: student.department,
      semester: student.semester,
      credits_completed: student.credits,
    }).then(res => {
      setPrediction(res);
      setLoadingPrediction(false);
    });
  }, [student]);

  if (!student) return null;

  const semHistory = getStudentSemesterHistory(student);
  const subjectAttendance = getStudentSubjectAttendance(student);

  // Subtle, calm risk badge
  const getRiskBadge = (tier: Student['riskTier']) => {
    switch (tier) {
      case 'High':
        return {
          bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
          icon: AlertTriangle,
          label: 'HIGH RISK',
        };
      case 'Medium':
        return {
          bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
          icon: AlertCircle,
          label: 'MODERATE RISK',
        };
      case 'Low':
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
          icon: ShieldCheck,
          label: 'LOW RISK',
        };
    }
  };

  const riskBadge = getRiskBadge(student.riskTier);
  const RiskIcon = riskBadge.icon;

  const handleAction = (actionKey: string) => {
    setExecutedActions(prev => ({ ...prev, [actionKey]: true }));
    if (onInterventionAction) onInterventionAction(student, actionKey);
  };

  const riskProbabilityPct = prediction
    ? (prediction.risk_probability * 100).toFixed(1)
    : student.riskScore.toString();

  const baselineScorePct = prediction
    ? (prediction.baseline_score * 100).toFixed(1)
    : ((student.riskScore * 0.75) + 10).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs">
      <div
        className="relative w-full max-w-3xl rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden max-h-[92vh] flex flex-col animate-fade-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Sticky Header */}
        <div className="flex items-start justify-between border-b border-slate-200/80 px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span>Student Profile</span>
              <span>•</span>
              <span className="font-mono text-slate-600 dark:text-slate-300">{student.rollNo}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {student.name}
              </h2>
              <span className={cn('inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold', riskBadge.bg)}>
                <RiskIcon className="h-3 w-3" />
                {riskBadge.label}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <span>Dept of {student.department}</span>
              <span>•</span>
              <span>Semester {student.semester}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {student.email}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><User className="h-3 w-3" /> Mentor: {student.mentor}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 text-xs">
          {[
            { id: 'profile', label: 'Executive Overview' },
            { id: 'attendance', label: 'Course Attendance' },
            { id: 'details', label: 'Academic Details' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'border-b-2 py-2.5 px-3.5 font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'profile' && (
            <>
              {/* 3 HERO CARDS (Section 19) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. CGPA */}
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>Cumulative CGPA</span>
                    <GraduationCap className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {student.cgpa.toFixed(2)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    {student.cgpa >= 7.5 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center font-medium">
                        <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> First Class Distinction
                      </span>
                    ) : (
                      <span className="text-slate-500">Scale of 10.0</span>
                    )}
                  </div>
                </div>

                {/* 2. Attendance */}
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>Aggregate Attendance</span>
                    <Clock className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {student.attendance.toFixed(1)}%
                  </div>
                  <div className="mt-1 text-xs font-medium">
                    {student.attendance >= 75 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">Statutory Eligible (≥ 75%)</span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400">Condonation Required (&lt; 75%)</span>
                    )}
                  </div>
                </div>

                {/* 3. AI Risk Probability */}
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span>AI Risk Probability</span>
                    <Zap className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-baseline gap-2">
                    <span>{riskProbabilityPct}%</span>
                    <span className="text-xs font-normal text-slate-400">Baseline: {baselineScorePct}%</span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {loadingPrediction ? 'Updating ML inference...' : `${student.riskTier} retention priority tier`}
                  </div>
                </div>
              </div>

              {/* ACADEMIC PROGRESSION TREND (Section 19) */}
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Academic Progression Trend
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Semester-by-semester CGPA progression vs campus benchmark (7.62)
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    Current: Sem {student.semester}
                  </span>
                </div>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={semHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
                      <XAxis dataKey="semester" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis domain={[4.0, 10.0]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          borderRadius: '8px',
                          border: 'none',
                          color: '#fff',
                          fontSize: '12px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="cgpa"
                        name="Student CGPA"
                        stroke="#4f46e5"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: '#4f46e5' }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* WHY IS THIS STUDENT AT RISK? (Section 19) */}
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
                <div className="mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Why is this student at risk? (Domain Factor Attribution)
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Decomposed attribution identifying institutional root causes of risk
                  </p>
                </div>

                {prediction && prediction.top_factors && prediction.top_factors.length > 0 ? (
                  <div className="space-y-2">
                    {prediction.top_factors.map((factor, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 p-2.5 dark:border-slate-800/80 dark:bg-slate-800/40 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{factor.label}</span>
                          <span className="rounded bg-slate-200/70 px-1.5 py-0.2 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            {factor.category}
                          </span>
                        </div>
                        <span className="font-semibold text-rose-600 dark:text-rose-400 font-mono">
                          +{Math.abs(factor.impact_pct)}% risk elevation
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/40 p-3 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-300 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span>All core metrics (attendance, CGPA velocity, course completions) are in healthy standing. No active distress factors detected.</span>
                  </div>
                )}
                <p className="text-[10px] text-slate-400 mt-2.5 italic">
                  Model performance is evaluated on synthetic demonstration data and requires real-world institutional validation.
                </p>
              </div>

              {/* RECOMMENDED ACTIONS (Section 19) */}
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-2xs">
                <div className="mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Recommended Pastoral Interventions
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Proactive institutional workflows assigned based on specific risk factors
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      id: 'counseling',
                      title: 'Mandatory Attendance Counseling',
                      desc: 'Schedule a 1-on-1 review with Faculty Advisor regarding laboratory absences.',
                    },
                    {
                      id: 'tutoring',
                      title: 'Remedial Peer Tutoring Assignment',
                      desc: 'Assign departmental peer mentor for core analytical subjects.',
                    },
                    {
                      id: 'backlog_plan',
                      title: 'Backlog Clearance Blueprint',
                      desc: 'Enroll in remedial weekend doubt-clearing sessions prior to end-term exams.',
                    },
                  ].map(action => {
                    const isExecuted = executedActions[action.id];
                    return (
                      <div
                        key={action.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800/80 dark:bg-slate-800/40"
                      >
                        <div className="text-xs">
                          <span className="font-semibold text-slate-900 dark:text-white block">
                            {action.title}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                            {action.desc}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAction(action.id)}
                          disabled={isExecuted}
                          className={cn(
                            'shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5',
                            isExecuted
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
                          )}
                        >
                          {isExecuted ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>Scheduled</span>
                            </>
                          ) : (
                            <span>Execute Action</span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3.5">Course Name</th>
                      <th className="py-2.5 px-3.5">Code</th>
                      <th className="py-2.5 px-3.5 text-right">Attended / Held</th>
                      <th className="py-2.5 px-3.5 text-right">Attendance %</th>
                      <th className="py-2.5 px-3.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {subjectAttendance.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3.5 font-medium text-slate-900 dark:text-white">{sub.subject}</td>
                        <td className="py-2.5 px-3.5 font-mono text-slate-500">{sub.code}</td>
                        <td className="py-2.5 px-3.5 text-right font-mono text-slate-600 dark:text-slate-300">{sub.attended}/{sub.total}</td>
                        <td className="py-2.5 px-3.5 text-right font-mono font-semibold">
                          <span className={sub.percentage >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                            {sub.percentage}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 text-center">
                          <span className={cn(
                            'inline-block px-2 py-0.5 rounded text-[10px] font-semibold',
                            sub.percentage >= 75
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          )}>
                            {sub.percentage >= 75 ? 'Eligible' : 'Deficit'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40">
                  <span className="text-slate-400 uppercase text-[10px]">Backlogs</span>
                  <div className="text-lg font-bold mt-1 text-slate-900 dark:text-white">{student.backlogs} courses</div>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40">
                  <span className="text-slate-400 uppercase text-[10px]">Credits Earned</span>
                  <div className="text-lg font-bold mt-1 text-slate-900 dark:text-white">{student.credits} / 160</div>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40">
                  <span className="text-slate-400 uppercase text-[10px]">Placement Status</span>
                  <div className="text-base font-bold mt-1 text-slate-900 dark:text-white truncate">{student.placementStatus}</div>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40">
                  <span className="text-slate-400 uppercase text-[10px]">Internship</span>
                  <div className="text-base font-bold mt-1 text-slate-900 dark:text-white">{student.internshipStatus}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">Verified Technical Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {student.skills.map((skill, idx) => (
                    <span key={idx} className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="flex items-center justify-between border-t border-slate-200/80 px-6 py-3 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0 text-xs text-slate-500">
          <span>Confidential Institutional Academic Record • FERPA Protected</span>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
