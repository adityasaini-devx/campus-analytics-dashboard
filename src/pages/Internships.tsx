import React from 'react';
import {
  Award, DollarSign, TrendingUp, Building2, Briefcase
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Tooltip,
  CartesianGrid, XAxis, YAxis
} from 'recharts';
import { useCampusFilters } from '../context/FilterContext';
import { PageHeader } from '../components/layout/PageHeader';
import { KPICard } from '../components/dashboard/KPICard';
import { ChartCard } from '../components/dashboard/ChartCard';
import {
  INTERNSHIP_STATS, INTERNSHIP_SECTORS, INTERNSHIP_DURATIONS,
  INTERNSHIP_TOP_RECRUITERS
} from '../data/internships';

export const InternshipsPage: React.FC = () => {
  const { filteredDepartments, kpis } = useCampusFilters();

  const deptInternshipData = filteredDepartments.map(d => ({
    code: d.code,
    name: d.name,
    rate: d.internshipRate,
    students: Math.round((d.totalStudents * d.internshipRate) / 100),
  }));

  const paidUnpaidData = [
    { name: 'Paid Corporate Internships', value: INTERNSHIP_STATS.paidPercentage, color: '#10b981' },
    { name: 'Academic / Unpaid Research', value: INTERNSHIP_STATS.unpaidPercentage, color: '#94a3b8' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Internship Analytics & Industry Engagement"
        description="Tracking experiential learning, pre-placement offers (PPO), stipend compensation, and sector distributions."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Participation Rate"
          value={`${kpis.internshipRate}%`}
          subtitle={`${INTERNSHIP_STATS.internshipsSecured.toLocaleString()} students interned`}
          icon={Award}
          color="indigo"
        />

        <KPICard
          title="Paid Proportion"
          value={`${INTERNSHIP_STATS.paidPercentage}%`}
          subtitle="Avg stipend: ₹28,500 / month"
          icon={DollarSign}
          color="emerald"
          valueColor="text-emerald-600 dark:text-emerald-400"
        />

        <KPICard
          title="PPO Conversion"
          value={`${INTERNSHIP_STATS.ppoConversionRate}%`}
          subtitle="Converted to full-time job offers"
          icon={Briefcase}
          color="sky"
          valueColor="text-sky-600 dark:text-sky-400"
        />

        <KPICard
          title="Top Monthly Stipend"
          value="₹1,25,000"
          subtitle="Google India R&D Center"
          icon={TrendingUp}
          color="amber"
          valueColor="text-amber-600 dark:text-amber-400"
        />

        <KPICard
          title="Industry Sectors"
          value="6 Dominant"
          subtitle="Tech, Hardware, FinTech, Auto, Civil, Power"
          icon={Building2}
          color="indigo"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department-wise Internship Rate */}
        <ChartCard
          title="Department-wise Internship Participation"
          subtitle="Proportion of pre-final & final year students holding verified internships"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={deptInternshipData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="code" tick={{ fontSize: 11 }} />
              <YAxis domain={[40, 90]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(val: any) => [`${val}%`, 'Internship Rate']} />
              <Bar dataKey="rate" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
                {deptInternshipData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.rate >= 70 ? '#4f46e5' : entry.rate >= 55 ? '#0ea5e9' : '#f59e0b'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Industry Sector Distribution */}
        <ChartCard
          title="Internship Distribution by Industry Sector"
          subtitle="Volume of student internships hosted across domain categories"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={INTERNSHIP_SECTORS}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="sector"
                tick={{ fontSize: 10, fontWeight: 500 }}
                width={120}
              />
              <Tooltip formatter={(val: any) => [`${val} Students`, 'Interns Hosted']} />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Paid vs Unpaid Donut */}
        <ChartCard
          title="Paid vs Academic / Research Ratio"
          subtitle="Demonstrates industry stipend compliance and scholarship stipends"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 h-full items-center gap-4">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paidUnpaidData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paidUnpaidData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val}%`, 'Proportion']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 text-xs">
              {paidUnpaidData.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                  </div>
                  <div className="mt-1 font-mono font-bold text-slate-600 dark:text-slate-400 ml-4">
                    {item.value}% of internships
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Duration Breakdown */}
        <ChartCard
          title="Internship Term & Duration Breakdown"
          subtitle="Summer, semester-long, and co-op research assignments"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={INTERNSHIP_DURATIONS} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="duration" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: any) => [`${val} Students`, 'Total Interns']} />
              <Bar dataKey="students" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Internship Employers Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Top Internship Recruiters & Pre-Placement Offers (PPO)
          </h3>
          <p className="text-xs text-slate-500">Corporate partners offering summer stipends and direct full-time conversions</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Recruiting Enterprise</th>
                <th className="py-3 px-4 text-right">Interns Hired</th>
                <th className="py-3 px-4 text-right">Monthly Stipend</th>
                <th className="py-3 px-4 text-right">PPO Conversion Offers</th>
                <th className="py-3 px-4 text-right">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {INTERNSHIP_TOP_RECRUITERS.map((item, idx) => {
                const convRate = ((item.ppoOffered / item.internsHired) * 100).toFixed(1);
                return (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {item.company}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold">
                      {item.internsHired} students
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {item.stipendMonthly}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {item.ppoOffered} offers
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold font-mono text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {convRate}% PPO
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
