import React, { useState } from 'react';
import {
  Users, Award, Star, Search, FileText, ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, Cell
} from 'recharts';
import { useCampusFilters } from '../context/FilterContext';
import { PageHeader } from '../components/layout/PageHeader';
import { KPICard } from '../components/dashboard/KPICard';
import { ChartCard } from '../components/dashboard/ChartCard';
import { FACULTY_STATS, FACULTY_MEMBERS } from '../data/faculty';

export const FacultyPage: React.FC = () => {
  const { department, filteredDepartments } = useCampusFilters();
  const [search, setSearch] = useState('');

  const deptFacultyDistribution = filteredDepartments.map(d => ({
    code: d.code,
    name: d.name,
    faculty: d.facultyCount,
    ratio: d.studentFacultyRatio,
    papers: d.researchPapers,
  }));

  const filteredFaculty = FACULTY_MEMBERS.filter(f => {
    if (department !== 'All' && f.department !== department) return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return f.name.toLowerCase().includes(q) || f.specialization.toLowerCase().includes(q) || f.department.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Faculty Analytics & Academic Research Outputs"
        description="Tracking teacher-student ratios, doctoral qualifications, student feedback scores, and research publications."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Faculty"
          value={FACULTY_STATS.totalFaculty}
          subtitle="Across 6 academic schools"
          icon={Users}
          color="indigo"
        />

        <KPICard
          title="Student : Faculty"
          value={FACULTY_STATS.studentFacultyRatio}
          subtitle="Compliant with AICTE / ABET"
          icon={ShieldCheck}
          color="emerald"
          valueColor="text-emerald-600 dark:text-emerald-400"
        />

        <KPICard
          title="Ph.D. Qualified"
          value={`${FACULTY_STATS.phdPercentage}%`}
          subtitle="Doctoral degrees completed"
          icon={Award}
          color="indigo"
        />

        <KPICard
          title="Research Papers"
          value={FACULTY_STATS.totalResearchPapersThisYear}
          subtitle="Scopus / IEEE Indexed"
          icon={FileText}
          color="sky"
          valueColor="text-sky-600 dark:text-sky-400"
        />

        <KPICard
          title="Avg Student Rating"
          value={`${FACULTY_STATS.avgStudentFeedbackRating} / 5.0`}
          subtitle="Based on 32,000+ course reviews"
          icon={Star}
          color="amber"
          valueColor="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Faculty Count by Department */}
        <ChartCard
          title="Faculty Headcount by Department"
          subtitle="Full-time academic professors, associate professors, and lecturers"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={deptFacultyDistribution} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="code" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: any) => [`${val} Faculty`, 'Teaching Staff']} />
              <Bar dataKey="faculty" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                {deptFacultyDistribution.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.faculty > 100 ? '#4f46e5' : '#6366f1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Research Publications Output */}
        <ChartCard
          title="Peer-Reviewed Publications Output"
          subtitle="Departmental research papers published in Scopus/Web of Science journals"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={deptFacultyDistribution} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="code" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: any) => [`${val} Papers`, 'Publications']} />
              <Bar dataKey="papers" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Key Faculty Directory Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-5 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Senior Faculty & HOD Directory
            </h3>
            <p className="text-xs text-slate-500">Academic leadership, research areas, and student feedback ratings</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search faculty name or area..."
              className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-900 shadow-2xs placeholder:text-slate-400 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Faculty Member</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Research Specialization</th>
                <th className="py-3 px-4">Doctoral Qualification</th>
                <th className="py-3 px-4 text-right">Experience</th>
                <th className="py-3 px-4 text-right">Publications</th>
                <th className="py-3 px-4 text-right">Student Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredFaculty.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{f.name}</div>
                    <div className="text-[11px] text-slate-400">{f.title}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {f.department}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                    {f.specialization}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {f.qualification}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                    {f.experienceYears} yrs
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {f.publicationsCount} papers
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-600 dark:text-amber-400">
                      <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
                      {f.studentFeedbackRating.toFixed(2)}
                    </span>
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
