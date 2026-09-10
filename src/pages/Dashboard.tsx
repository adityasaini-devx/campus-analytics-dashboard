import React, { useState } from 'react';
import {
  Users, Clock, GraduationCap, Briefcase, Award, AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useCampusFilters } from '../context/FilterContext';
import { KPICard } from '../components/dashboard/KPICard';
import { ChartCard } from '../components/dashboard/ChartCard';
import { InsightBanner } from '../components/dashboard/InsightBanner';
import { PageHeader } from '../components/layout/PageHeader';
import { ATTENDANCE_TIERS } from '../data/attendance';
import { PLACEMENT_HISTORICAL_TRENDS } from '../data/placements';
import { type PageId } from '../components/layout/Sidebar';
import { type Department } from '../data/departments';

interface DashboardProps {
  onNavigate: (page: PageId) => void;
  onSelectDepartment: (dept: Department) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onSelectDepartment,
}) => {
  const { kpis, filteredDepartments, insights, department } = useCampusFilters();
  const [placementMetric, setPlacementMetric] = useState<'counts' | 'packages'>('counts');
  const [enrollmentView, setEnrollmentView] = useState<'overall' | 'department'>('overall');

  // Enrollment trend data (Sem 1 to Sem 8 across campus)
  const enrollmentTrendData = [
    { period: '2021-22', total: 7680, cse: 1950, it: 1200, ece: 1540, eee: 1050, mech: 1180, civil: 760 },
    { period: '2022-23', total: 7920, cse: 2020, it: 1260, ece: 1590, eee: 1080, mech: 1210, civil: 760 },
    { period: '2023-24', total: 8140, cse: 2080, it: 1320, ece: 1640, eee: 1100, mech: 1230, civil: 770 },
    { period: '2024-25', total: 8290, cse: 2110, it: 1350, ece: 1660, eee: 1110, mech: 1240, civil: 820 },
    { period: '2025-26', total: 8426, cse: 2140, it: 1380, ece: 1680, eee: 1120, mech: 1250, civil: 856 },
  ];

  // Department comparison data sorted by CGPA
  const deptPerformanceData = [...filteredDepartments]
    .sort((a, b) => b.avgCgpa - a.avgCgpa)
    .map(d => ({
      code: d.code,
      name: d.name,
      cgpa: d.avgCgpa,
      attendance: d.avgAttendance,
      placementRate: d.placementRate,
      students: d.totalStudents,
      rawDept: d,
    }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Executive Overview"
        description="Campus overview and institutional performance across academics, attendance, and placements."
      />

      {/* Dynamic AI Insights Banner */}
      <InsightBanner
        insights={insights}
        onNavigateToRisk={() => onNavigate('risk')}
      />

      {/* Top Section: 6 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Enrolled"
          value={kpis.totalStudents.toLocaleString()}
          change={kpis.trends.studentsDelta}
          changeLabel="vs last year"
          icon={Users}
          color="indigo"
          onClick={() => onNavigate('students')}
        />

        <KPICard
          title="Average Attendance"
          value={`${kpis.avgAttendance}%`}
          change={kpis.trends.attendanceDelta}
          changeLabel="vs last sem"
          icon={Clock}
          color="emerald"
          onClick={() => onNavigate('attendance')}
        />

        <KPICard
          title="Average CGPA"
          value={kpis.avgCgpa.toFixed(2)}
          change={kpis.trends.cgpaDelta}
          changeLabel="vs last sem"
          icon={GraduationCap}
          color="indigo"
          onClick={() => onNavigate('academics')}
        />

        <KPICard
          title="Placement Rate"
          value={`${kpis.placementRate}%`}
          change={kpis.trends.placementDelta}
          changeLabel="YoY growth"
          icon={Briefcase}
          color="emerald"
          onClick={() => onNavigate('placements')}
        />

        <KPICard
          title="Internship Rate"
          value={`${kpis.internshipRate}%`}
          change={kpis.trends.internshipDelta}
          changeLabel="vs last cycle"
          icon={Award}
          color="indigo"
          onClick={() => onNavigate('internships')}
        />

        {/* Elevated At-Risk Metric Card */}
        <div
          onClick={() => onNavigate('risk')}
          className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-rose-200/80 bg-rose-50/40 p-5 shadow-2xs hover:border-rose-300 dark:border-rose-900/40 dark:bg-rose-950/20 dark:hover:border-rose-800 transition-all cursor-pointer min-h-[140px]"
        >
          <div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-800 dark:text-rose-300 truncate">
                Students Currently Flagged
              </span>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-700 dark:text-rose-300 font-mono">
                {kpis.atRiskCount}
              </span>
              <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                ({kpis.totalStudents > 0 ? ((kpis.atRiskCount / kpis.totalStudents) * 100).toFixed(1) : '0.0'}%)
              </span>
            </div>
            <span className="text-[10px] text-rose-600/80 dark:text-rose-400/80 block mt-0.5">
              High-Risk Tier (Score ≥ 70) • Actionable
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between pt-2 border-t border-rose-200/60 dark:border-rose-900/40 text-xs">
            <span className="text-rose-700 dark:text-rose-400 font-medium flex items-center gap-1">
              <span className="font-bold">↓ 0.6%</span> vs prior sem
            </span>
            <span className="font-semibold text-rose-700 dark:text-rose-300 group-hover:underline">
              Inspect →
            </span>
          </div>
        </div>
      </div>

      {/* Main Analytics Section: 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Student Enrollment Trend */}
        <ChartCard
          title="Student Enrollment Trend"
          subtitle="Multi-year longitudinal enrollment trajectory across colleges"
          action={
            <div className="flex items-center rounded-lg bg-slate-100 p-0.5 text-xs dark:bg-slate-800">
              <button
                onClick={() => setEnrollmentView('overall')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  enrollmentView === 'overall'
                    ? 'bg-white shadow-2xs text-slate-900 dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                Campus Total
              </button>
              <button
                onClick={() => setEnrollmentView('department')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  enrollmentView === 'department'
                    ? 'bg-white shadow-2xs text-slate-900 dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                By Department
              </button>
            </div>
          }
          footer={
            <div className="flex items-center justify-between">
              <span>Annual Compound Growth Rate: <strong>+2.4% CAGR</strong></span>
              <button
                onClick={() => onNavigate('students')}
                className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                View Roster <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={270}>
            {enrollmentView === 'overall' ? (
              <AreaChart data={enrollmentTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis domain={[7000, 9000]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString()} Students`, 'Total Enrolled']}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#enrollGrad)"
                />
              </AreaChart>
            ) : (
              <AreaChart data={enrollmentTrendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 2500]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="cse" name="CSE" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.15} />
                <Area type="monotone" dataKey="ece" name="ECE" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.15} />
                <Area type="monotone" dataKey="it" name="IT" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                <Area type="monotone" dataKey="mech" name="Mech" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
                <Area type="monotone" dataKey="eee" name="EEE" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} />
                <Area type="monotone" dataKey="civil" name="Civil" stroke="#ec4899" fill="#ec4899" fillOpacity={0.15} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 2: Department Performance (Horizontal Bar Chart) */}
        <ChartCard
          title="Department Academic Performance"
          subtitle="Comparative Average CGPA across 6 academic departments"
          action={
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Campus Avg: {kpis.avgCgpa.toFixed(2)}
            </span>
          }
          footer={
            <div className="flex items-center justify-between">
              <span>Click a department bar to inspect syllabus and pass rates</span>
              <button
                onClick={() => onNavigate('departments')}
                className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                All Departments <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={270}>
            <BarChart
              data={deptPerformanceData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[6.5, 9.0]} tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="code"
                tick={{ fontSize: 11, fontWeight: 600 }}
                width={50}
              />
              <Tooltip
                formatter={(val: any, _name: any, item: any) => [
                  `${val} CGPA (${item.payload.students.toLocaleString()} students)`,
                  item.payload.name
                ]}
              />
              <Bar
                dataKey="cgpa"
                radius={[0, 4, 4, 0]}
                onClick={(entry: any) => onSelectDepartment(entry.rawDept)}
                className="cursor-pointer"
              >
                {deptPerformanceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.cgpa >= 8.0 ? '#4f46e5' : entry.cgpa >= 7.5 ? '#6366f1' : '#818cf8'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 3: Attendance Distribution (Donut Chart) */}
        <ChartCard
          title="Attendance Distribution"
          subtitle="Mandatory 75% examination compliance threshold status"
          footer={
            <div className="flex items-center justify-between">
              <span className="text-rose-600 dark:text-rose-400 font-medium">
                1,348 students (16.0%) below 75% cutoff
              </span>
              <button
                onClick={() => onNavigate('attendance')}
                className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Attendance Details <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 h-full items-center gap-4">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ATTENDANCE_TIERS}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {ATTENDANCE_TIERS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, _name: any, item: any) => [
                      `${val.toLocaleString()} students (${item.payload.percentage}%)`,
                      `${item.payload.category} (${item.payload.range})`
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend & Counts */}
            <div className="space-y-2.5 text-xs">
              {ATTENDANCE_TIERS.map((tier, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-2 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-850/40"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: tier.color }}
                    />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {tier.category} ({tier.range})
                      </div>
                      <div className="text-[10px] text-slate-400">{tier.count.toLocaleString()} Students</div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {tier.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Chart 4: Placement Overview (Switchable Bar/Line Chart) */}
        <ChartCard
          title="Placement & Package Dynamics"
          subtitle="Eligible vs placed students and average salary growth over 5 years"
          action={
            <div className="flex items-center rounded-lg bg-slate-100 p-0.5 text-xs dark:bg-slate-800">
              <button
                onClick={() => setPlacementMetric('counts')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  placementMetric === 'counts'
                    ? 'bg-white shadow-2xs text-slate-900 dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                Hiring Counts
              </button>
              <button
                onClick={() => setPlacementMetric('packages')}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  placementMetric === 'packages'
                    ? 'bg-white shadow-2xs text-slate-900 dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                Compensation (LPA)
              </button>
            </div>
          }
          footer={
            <div className="flex items-center justify-between">
              <span>Highest Offer: <strong>₹{kpis.highestPackageLPA} LPA (Google)</strong></span>
              <button
                onClick={() => onNavigate('placements')}
                className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Hiring Partners <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={270}>
            {placementMetric === 'counts' ? (
              <BarChart data={PLACEMENT_HISTORICAL_TRENDS} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `${val.toLocaleString()} students`,
                    name === 'eligible' ? 'Eligible Candidates' : 'Placed Students'
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="eligible" name="Eligible Pool" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="placed" name="Placed Students" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={PLACEMENT_HISTORICAL_TRENDS} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} unit="L" />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    `₹${val} LPA`,
                    name === 'avgPackageLPA' ? 'Average CTC' : 'Highest CTC'
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="avgPackageLPA" name="Average CTC" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="highestPackageLPA" name="Highest CTC" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Quick Action Cohort Bar */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Need to take administrative action on the {department === 'All' ? 'Campus-wide' : department} cohort?
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Identify at-risk students, trigger faculty counseling sessions, or generate official accreditation dossiers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('risk')}
            className="rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700 transition-colors"
          >
            Review {kpis.atRiskCount} Flagged Students
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Export Comprehensive Report
          </button>
        </div>
      </div>
    </div>
  );
};
