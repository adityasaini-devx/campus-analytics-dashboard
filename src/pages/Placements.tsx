import React, { useState } from 'react';
import {
  TrendingUp, DollarSign, Award, Users, Building2, Search
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useCampusFilters } from '../context/FilterContext';
import { PageHeader } from '../components/layout/PageHeader';
import { KPICard } from '../components/dashboard/KPICard';
import { ChartCard } from '../components/dashboard/ChartCard';
import {
  TOP_HIRING_COMPANIES, PLACEMENT_HISTORICAL_TRENDS, SALARY_DISTRIBUTIONS,
  OVERALL_ELIGIBLE_STUDENTS, OVERALL_PLACED_STUDENTS
} from '../data/placements';

export const PlacementsPage: React.FC = () => {
  const { kpis, filteredDepartments } = useCampusFilters();
  const [searchCompany, setSearchCompany] = useState('');

  const deptPlacementData = filteredDepartments.map(d => ({
    code: d.code,
    name: d.name,
    placementRate: d.placementRate,
    avgPackage: d.avgPackageLPA,
    highestPackage: d.highestPackageLPA,
  }));

  const filteredCompanies = TOP_HIRING_COMPANIES.filter(c =>
    c.name.toLowerCase().includes(searchCompany.toLowerCase()) ||
    c.sector.toLowerCase().includes(searchCompany.toLowerCase()) ||
    c.roles.some(r => r.toLowerCase().includes(searchCompany.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Campus Placements & Corporate Recruitment Analytics"
        description="Tracking graduate hiring outcomes, compensation brackets, corporate recruitment partners, and multi-year placement rates."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Placement Rate"
          value={`${kpis.placementRate}%`}
          change={6.2}
          changeLabel="YoY growth"
          trend="up"
          icon={TrendingUp}
          color="emerald"
          valueColor="text-emerald-600 dark:text-emerald-400"
        />

        <KPICard
          title="Students Placed"
          value={OVERALL_PLACED_STUDENTS.toLocaleString()}
          subtitle={`Out of ${OVERALL_ELIGIBLE_STUDENTS.toLocaleString()} eligible seniors`}
          icon={Users}
          color="indigo"
        />

        <KPICard
          title="Average CTC"
          value={`₹${kpis.avgPackageLPA} LPA`}
          change={0.7}
          changeLabel="vs prior batch"
          trend="up"
          icon={DollarSign}
          color="indigo"
        />

        <KPICard
          title="Highest Package"
          value={`₹${kpis.highestPackageLPA} LPA`}
          subtitle="Google Cloud (CSE Dept)"
          icon={Award}
          color="amber"
          valueColor="text-amber-600 dark:text-amber-400"
        />

        <KPICard
          title="Active Recruiters"
          value="184"
          subtitle="Participating companies"
          icon={Building2}
          color="sky"
          valueColor="text-sky-600 dark:text-sky-400"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5-Year YoY Placement Growth */}
        <ChartCard
          title="5-Year Placement & CTC Trajectory"
          subtitle="Longitudinal placement percentage and average compensation growth"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={PLACEMENT_HISTORICAL_TRENDS} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" domain={[65, 85]} tick={{ fontSize: 11 }} unit="%" />
              <YAxis yAxisId="right" orientation="right" domain={[5, 15]} tick={{ fontSize: 11 }} unit="L" />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="left" type="monotone" dataKey="rate" name="Placement Rate (%)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="avgPackageLPA" name="Average CTC (LPA)" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Department-wise Placement Rates */}
        <ChartCard
          title="Department Placement Rate Comparison"
          subtitle="Percentage of eligible graduating seniors successfully placed"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={deptPlacementData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="code" tick={{ fontSize: 11 }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(val: any) => [`${val}%`, 'Placement Rate']} />
              <Bar dataKey="placementRate" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                {deptPlacementData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.placementRate >= 85 ? '#4f46e5' : entry.placementRate >= 75 ? '#0ea5e9' : '#f59e0b'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Salary Brackets Distribution */}
        <ChartCard
          title="Salary Bracket Distribution (CTC Tiers)"
          subtitle="Breakdown of placed candidates across compensation bands"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 h-full items-center gap-4">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SALARY_DISTRIBUTIONS}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {SALARY_DISTRIBUTIONS.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val} students`, 'Placed']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-xs">
              {SALARY_DISTRIBUTIONS.map((tier, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: tier.color }} />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{tier.tier} ({tier.range})</span>
                  </div>
                  <span className="font-mono font-bold text-slate-600 dark:text-slate-400">{tier.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Average vs Highest Package by Dept */}
        <ChartCard
          title="Department Compensation Ranges (LPA)"
          subtitle="Comparing average vs highest packages secured per branch"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={deptPlacementData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="code" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="L" />
              <Tooltip formatter={(val: any) => [`₹${val} LPA`, 'Package']} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="avgPackage" name="Average Package" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="highestPackage" name="Highest Package" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Recruiting Companies Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Corporate Recruitment Partners & Hiring Records
            </h3>
            <p className="text-xs text-slate-500">Details of top campus recruiters, compensation, and offers</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchCompany}
              onChange={e => setSearchCompany(e.target.value)}
              placeholder="Search company or sector..."
              className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 shadow-2xs placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Company Name</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">Recruitment Tier</th>
                <th className="py-3 px-4 text-right">Students Hired</th>
                <th className="py-3 px-4 text-right">Avg Package</th>
                <th className="py-3 px-4 text-right">Highest Package</th>
                <th className="py-3 px-4">Primary Roles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredCompanies.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 font-bold text-[10px] text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {c.logoText}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                    {c.sector}
                  </td>
                  <td className="py-3 px-4">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {c.tier}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white font-mono">
                    {c.studentsHired}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    ₹{c.avgPackageLPA} LPA
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{c.highestPackageLPA} LPA
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {c.roles.join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
