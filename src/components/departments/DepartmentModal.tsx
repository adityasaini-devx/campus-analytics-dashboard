import React from 'react';
import { X, Building2, Users, GraduationCap, Briefcase, Award, BookOpen, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { type Department } from '../../data/departments';

interface DepartmentModalProps {
  department: Department | null;
  onClose: () => void;
  onFilterDepartment?: (deptCode: string) => void;
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({
  department,
  onClose,
  onFilterDepartment,
}) => {
  if (!department) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-xs">
      <div
        className="relative w-full max-w-4xl rounded-xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 overflow-hidden max-h-[90vh] flex flex-col animate-fade-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200/80 px-6 py-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white text-sm shadow-xs">
              {department.code}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {department.name}
                </h2>
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                  {department.code}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Head of Department: <span className="font-semibold text-slate-700 dark:text-slate-200">{department.hod}</span> ({department.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {department.description}
          </p>

          {/* Key KPI Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Users className="h-4 w-4 text-indigo-500" />
                Enrolled Students
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {department.totalStudents.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-slate-400">{department.facultyCount} Faculty (15:1 Ratio)</div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <GraduationCap className="h-4 w-4 text-emerald-500" />
                Average CGPA
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {department.avgCgpa.toFixed(2)}
              </div>
              <div className="mt-1 text-xs text-slate-400">{department.avgAttendance}% Avg Attendance</div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Briefcase className="h-4 w-4 text-sky-500" />
                Placement Rate
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                {department.placementRate}%
              </div>
              <div className="mt-1 text-xs text-slate-400">Avg ₹{department.avgPackageLPA} LPA (Max ₹{department.highestPackageLPA} LPA)</div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                At-Risk Students
              </div>
              <div className="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">
                {department.atRiskCount}
              </div>
              <div className="mt-1 text-xs text-slate-400">{((department.atRiskCount / department.totalStudents) * 100).toFixed(1)}% of cohort</div>
            </div>
          </div>

          {/* Semester-wise Academic Performance Chart */}
          <div className="rounded-xl border border-slate-200 p-5 dark:border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Semester Performance & Pass Percentage
            </h4>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={department.semesterPerformance} margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
                  <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Pass Rate']}
                  />
                  <Bar dataKey="passRate" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Curriculum Insights: Top vs Weak Subjects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
              <h5 className="text-xs font-semibold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-1">
                <Award className="h-4 w-4" /> Strongest Performing Subjects
              </h5>
              <div className="space-y-2">
                {department.topSubjects.map((sub, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-white/80 dark:bg-slate-850 p-2 rounded">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{sub.name}</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{sub.passRate}% Pass</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
              <h5 className="text-xs font-semibold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" /> Subjects Requiring Tutorial Support
              </h5>
              <div className="space-y-2">
                {department.weakSubjects.map((sub, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-white/80 dark:bg-slate-850 p-2 rounded">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{sub.name}</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{sub.passRate}% Pass</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Infrastructure & Research */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-500" />
              <span>Specialized Research Labs: <strong>{department.labsCount} Laboratories</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-500" />
              <span>Publications This Academic Year: <strong>{department.researchPapers} Papers</strong></span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          {onFilterDepartment && (
            <button
              onClick={() => {
                onFilterDepartment(department.code);
                onClose();
              }}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700"
            >
              Filter Dashboard by {department.code}
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
