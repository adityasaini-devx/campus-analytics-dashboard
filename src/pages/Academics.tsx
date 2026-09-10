import React from 'react';
import {
  GraduationCap, TrendingUp, AlertCircle, CheckCircle2, Award,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, BarChart, Bar, Cell, Legend
} from 'recharts';
import { useCampusFilters } from '../context/FilterContext';
import { PageHeader } from '../components/layout/PageHeader';
import { KPICard } from '../components/dashboard/KPICard';
import { ChartCard } from '../components/dashboard/ChartCard';
import { CAMPUS_ACADEMIC_STATS, GRADE_DISTRIBUTIONS, SEMESTER_PERFORMANCE_METRICS } from '../data/academics';

export const AcademicsPage: React.FC = () => {
  const { kpis, filteredDepartments } = useCampusFilters();

  const deptComparisonData = filteredDepartments.map(d => ({
    code: d.code,
    name: d.name,
    cgpa: d.avgCgpa,
    benchmark: 7.62,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Academic Performance & CGPA Analytics"
        description="Comprehensive curriculum progression, grade distributions, pass percentages, and distinction rates across campus."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Average CGPA"
          value={kpis.avgCgpa.toFixed(2)}
          change={0.15}
          changeLabel="vs prior semester"
          trend="up"
          icon={GraduationCap}
          color="indigo"
        />

        <KPICard
          title="Pass Rate"
          value={`${CAMPUS_ACADEMIC_STATS.passRate}%`}
          subtitle="All curriculum exams combined"
          icon={CheckCircle2}
          color="emerald"
          valueColor="text-emerald-600 dark:text-emerald-400"
        />

        <KPICard
          title="Backlog Rate"
          value={`${CAMPUS_ACADEMIC_STATS.backlogRate}%`}
          subtitle="Students with ≥ 1 active backlog"
          icon={AlertCircle}
          color="rose"
          valueColor="text-rose-600 dark:text-rose-400"
        />

        <KPICard
          title="Distinction (≥8.5)"
          value={`${CAMPUS_ACADEMIC_STATS.distinctionRate}%`}
          subtitle="2,401 honors students"
          icon={Award}
          color="amber"
          valueColor="text-amber-600 dark:text-amber-400"
        />

        <KPICard
          title="Improving Cohort"
          value={`${CAMPUS_ACADEMIC_STATS.improvingStudentsPercentage}%`}
          subtitle="Maintained or raised GPA"
          icon={TrendingUp}
          color="sky"
          valueColor="text-sky-600 dark:text-sky-400"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semester Performance Metric */}
        <ChartCard
          title="Semester-by-Semester Progression"
          subtitle="Average CGPA evolution from Freshman (Sem 1) to Final Year (Sem 8)"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={SEMESTER_PERFORMANCE_METRICS} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
              <YAxis domain={[7.0, 8.5]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: any) => [`${val} CGPA`, 'Average GPA']} />
              <Line type="monotone" dataKey="avgCgpa" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Department vs Campus Benchmark */}
        <ChartCard
          title="Department CGPA vs Campus Benchmark (7.62)"
          subtitle="Showing relative academic performance against institutional baseline"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={deptComparisonData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="code" tick={{ fontSize: 11 }} />
              <YAxis domain={[6.5, 8.5]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: any) => [`${val} CGPA`, 'Department Avg']} />
              <Bar dataKey="cgpa" fill="#6366f1" radius={[4, 4, 0, 0]}>
                {deptComparisonData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.cgpa >= 8.0 ? '#4f46e5' : entry.cgpa >= 7.62 ? '#0ea5e9' : '#f59e0b'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Grade Distribution Bar */}
        <ChartCard
          title="Letter Grade Distribution (Relative Grading Scale)"
          subtitle="Campus-wide student population distribution across grading tiers"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={GRADE_DISTRIBUTIONS} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="grade" tick={{ fontSize: 11, fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val: any, _name: any, item: any) => [
                  `${val.toLocaleString()} students (${item.payload.percentage}%)`,
                  `Grade ${item.payload.grade} (${item.payload.range})`
                ]}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {GRADE_DISTRIBUTIONS.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Semester Pass & Backlog Rates */}
        <ChartCard
          title="Semester Pass vs Backlog Concentration"
          subtitle="Identifying structural bottleneck semesters across engineering curricula"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={SEMESTER_PERFORMANCE_METRICS} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(val: any) => [`${val}%`, 'Rate']} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="passPercentage" name="Pass Rate" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="backlogPercentage" name="Backlog Rate" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Dynamic Key Academic Insights Panel */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6 dark:border-indigo-900/60 dark:bg-indigo-950/20">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
            Key Academic Observations & Pedagogical Recommendations
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-lg bg-white/80 p-3.5 shadow-2xs dark:bg-slate-900/80">
            <span className="font-bold text-slate-900 dark:text-white">CSE & IT Outperforming Baseline</span>
            <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
              Computer Science (8.12) and Information Tech (7.95) lead campus CGPA, with over 36% of students securing &gt; 8.5 distinction marks.
            </p>
          </div>
          <div className="rounded-lg bg-white/80 p-3.5 shadow-2xs dark:bg-slate-900/80">
            <span className="font-bold text-slate-900 dark:text-white">Semester 3 & 4 Bottleneck Identified</span>
            <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
              Backlog rates spike to 13.2% in Semester 4, driven predominantly by core applied mathematics, thermodynamics, and signals & systems.
            </p>
          </div>
          <div className="rounded-lg bg-white/80 p-3.5 shadow-2xs dark:bg-slate-900/80">
            <span className="font-bold text-slate-900 dark:text-white">Senior Year Recovery Trajectory</span>
            <p className="mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
              Semesters 7 & 8 demonstrate a 96.2% pass rate as students transition to capstone project work and specialized technical electives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
