import React, { useState, useMemo } from 'react';
import {
  Search, ArrowUpDown, AlertTriangle, ChevronRight
} from 'lucide-react';
import { DEPARTMENTS, type Department } from '../data/departments';
import { PageHeader } from '../components/layout/PageHeader';

interface DepartmentsPageProps {
  onSelectDepartmentModal: (dept: Department) => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({
  onSelectDepartmentModal,
}) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof Department>('totalStudents');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredDepts = useMemo(() => {
    return DEPARTMENTS.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      d.hod.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [search, sortField, sortAsc]);

  const handleSort = (field: keyof Department) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Academic Departments Directory"
        description="Compare student intake, faculty ratios, placement metrics, and at-risk cohorts across all 6 engineering faculties."
        actions={
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search department or HOD..."
              className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 shadow-2xs placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>
        }
      />

      {/* Department Cards Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDepts.map(dept => (
          <div
            key={dept.id}
            onClick={() => onSelectDepartmentModal(dept)}
            className="group cursor-pointer rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800 transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  {dept.code}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">HOD: {dept.hod}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-indigo-600 transition-all" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-b border-slate-100 py-3 dark:border-slate-800/80 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium">Students</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {dept.totalStudents.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium">Avg CGPA</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {dept.avgCgpa.toFixed(2)}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium">Placed</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {dept.placementRate}%
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Attendance: <strong className="font-mono text-slate-700 dark:text-slate-300">{dept.avgAttendance}%</strong></span>
              <span className="flex items-center gap-1 font-medium text-rose-600 dark:text-rose-400">
                <AlertTriangle className="h-3 w-3" />
                {dept.atRiskCount} at risk
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Department Performance Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Comprehensive Department Benchmarking Table
          </h3>
          <span className="text-xs text-slate-400">Click column header to sort</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('code')}>
                  <div className="flex items-center gap-1">Department <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-indigo-600 text-right" onClick={() => handleSort('totalStudents')}>
                  <div className="flex items-center justify-end gap-1">Students <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-indigo-600 text-right" onClick={() => handleSort('facultyCount')}>
                  <div className="flex items-center justify-end gap-1">Faculty (Ratio) <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-indigo-600 text-right" onClick={() => handleSort('avgCgpa')}>
                  <div className="flex items-center justify-end gap-1">Avg CGPA <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-indigo-600 text-right" onClick={() => handleSort('avgAttendance')}>
                  <div className="flex items-center justify-end gap-1">Attendance <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-indigo-600 text-right" onClick={() => handleSort('placementRate')}>
                  <div className="flex items-center justify-end gap-1">Placement % <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-indigo-600 text-right" onClick={() => handleSort('internshipRate')}>
                  <div className="flex items-center justify-end gap-1">Internship % <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-indigo-600 text-right" onClick={() => handleSort('atRiskCount')}>
                  <div className="flex items-center justify-end gap-1">At-Risk <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredDepts.map(dept => (
                <tr
                  key={dept.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{dept.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{dept.code} • HOD: {dept.hod}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-900 dark:text-white">
                    {dept.totalStudents.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-600 dark:text-slate-300">
                    {dept.facultyCount} faculty <span className="text-slate-400">({dept.studentFacultyRatio}:1)</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {dept.avgCgpa.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-700 dark:text-slate-300 font-mono">
                    {dept.avgAttendance}%
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {dept.placementRate}%
                      </span>
                      <span className="text-[10px] text-slate-400">({dept.totalPlaced}/{dept.totalEligibleForPlacement})</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-cyan-600 dark:text-cyan-400">
                    {dept.internshipRate}%
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                      <AlertTriangle className="h-3 w-3" />
                      {dept.atRiskCount}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectDepartmentModal(dept)}
                      className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400"
                    >
                      Drill-down
                    </button>
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
