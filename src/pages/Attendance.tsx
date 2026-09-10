import React, { useState } from 'react';
import {
  Clock, AlertTriangle, CheckCircle2, ShieldAlert,
  TrendingDown
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useCampusFilters } from '../context/FilterContext';
import { PageHeader } from '../components/layout/PageHeader';
import { KPICard } from '../components/dashboard/KPICard';
import { ChartCard } from '../components/dashboard/ChartCard';
import { ATTENDANCE_TIERS, MONTHLY_ATTENDANCE_TREND, DAY_OF_WEEK_ATTENDANCE, LOW_ATTENDANCE_ACTION_ITEMS } from '../data/attendance';
import { STUDENTS, type Student } from '../data/students';
import { StudentProfileModal } from '../components/students/StudentProfileModal';

export const AttendancePage: React.FC = () => {
  const { kpis, filteredDepartments } = useCampusFilters();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Department attendance bar data
  const deptAttendanceData = filteredDepartments.map(d => ({
    name: d.name,
    code: d.code,
    attendance: d.avgAttendance,
    studentsBelow75: Math.round(d.totalStudents * ((100 - d.avgAttendance) / 100) * 0.8),
  }));

  // Low attendance students watchlist (<70%)
  const lowAttendanceStudents = STUDENTS.filter(s => s.attendance < 72);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Campus Attendance Analytics & Compliance"
        description="Monitoring statutory 75.0% examination threshold compliance across departments and sessions."
      />

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Campus Average"
          value={`${kpis.avgAttendance}%`}
          change={1.2}
          changeLabel="vs prior sem"
          trend="up"
          icon={Clock}
          color="indigo"
        />

        <KPICard
          title="Below 75% Cutoff"
          value="1,348"
          subtitle="16.0% student population at risk"
          icon={AlertTriangle}
          color="rose"
          valueColor="text-rose-600 dark:text-rose-400"
        />

        <KPICard
          title="Above 85% Honors"
          value="4,128"
          subtitle="49.0% exemplary compliance"
          icon={CheckCircle2}
          color="emerald"
          valueColor="text-emerald-600 dark:text-emerald-400"
        />

        <KPICard
          title="Friday Lab Dip"
          value="75.0%"
          subtitle="Lowest weekday aggregate attendance"
          icon={TrendingDown}
          color="amber"
          valueColor="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Main Visuals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <ChartCard
          title="Monthly Campus Attendance Progression"
          subtitle="Longitudinal tracker showing mid-term and examination dips"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={MONTHLY_ATTENDANCE_TREND} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis domain={[70, 90]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: any) => [`${val}%`, 'Attendance']} />
              <Line type="monotone" dataKey="campusAvg" name="Campus Avg" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="cse" name="CSE" stroke="#10b981" strokeWidth={1.5} strokeDasharray="3 3" />
              <Line type="monotone" dataKey="civil" name="Civil" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Department Attendance Benchmarks */}
        <ChartCard
          title="Department Attendance Comparison"
          subtitle="Average attendance by department with 75% cutoff threshold"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={deptAttendanceData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="code" tick={{ fontSize: 11 }} />
              <YAxis domain={[60, 95]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: any) => [`${val}%`, 'Avg Attendance']} />
              <Bar dataKey="attendance" fill="#6366f1" radius={[4, 4, 0, 0]}>
                {deptAttendanceData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.attendance >= 82 ? '#4f46e5' : entry.attendance >= 79 ? '#818cf8' : '#fb923c'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Attendance Tiers (Donut) */}
        <ChartCard
          title="Attendance Distribution by Compliance Tier"
          subtitle="Proportion of students falling within standard bands"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 h-full items-center gap-4">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ATTENDANCE_TIERS}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {ATTENDANCE_TIERS.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${Number(val).toLocaleString()} students`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-xs">
              {ATTENDANCE_TIERS.map((tier, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tier.color }} />
                    <span className="font-semibold">{tier.category} ({tier.range})</span>
                  </div>
                  <span className="font-mono text-slate-500">{tier.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Day of Week Breakdown */}
        <ChartCard
          title="Day-of-Week Attendance Fluctuation"
          subtitle="Comparing First Half vs Second Half laboratory engagement"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={DAY_OF_WEEK_ATTENDANCE} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis domain={[65, 95]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="firstHalf" name="Morning Sessions" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="secondHalf" name="Afternoon Sessions" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Critical Action Items & Low Attendance Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Action Feed */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-500" />
            Administrative Interventions In Progress
          </h3>
          <div className="space-y-3">
            {LOW_ATTENDANCE_ACTION_ITEMS.map((item, idx) => (
              <div key={idx} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{item.dept} Department</span>
                  <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    {item.urgency}
                  </span>
                </div>
                <p className="mt-1 text-slate-600 dark:text-slate-300">{item.concern}</p>
                <div className="mt-1.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                  Resolution: {item.action}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Watchlist Table */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Critical Attendance Deficit Watchlist (&lt; 70%)
            </h3>
            <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              Requires immediate condonation or mentoring
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 uppercase">
                <tr>
                  <th className="p-2.5">Student</th>
                  <th className="p-2.5">Dept / Sem</th>
                  <th className="p-2.5 text-right">Attendance</th>
                  <th className="p-2.5 text-right">CGPA</th>
                  <th className="p-2.5 text-right">Backlogs</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {lowAttendanceStudents.map(st => (
                  <tr key={st.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                      {st.name} <span className="font-mono font-normal text-slate-400">({st.rollNo})</span>
                    </td>
                    <td className="p-2.5 text-slate-600 dark:text-slate-300">
                      {st.department} • Sem {st.semester}
                    </td>
                    <td className="p-2.5 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                      {st.attendance}%
                    </td>
                    <td className="p-2.5 text-right font-mono text-slate-700 dark:text-slate-300">{st.cgpa.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-bold text-rose-600">{st.backlogs}</td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => setSelectedStudent(st)}
                        className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400"
                      >
                        Inspect Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <StudentProfileModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
};
