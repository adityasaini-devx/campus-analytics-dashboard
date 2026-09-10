import React, { useState, useMemo } from 'react';
import {
  Search, ArrowUpDown, ChevronLeft, ChevronRight,
  ShieldCheck, AlertTriangle, AlertCircle, Eye
} from 'lucide-react';
import { STUDENTS, type Student, type RiskTier, type PlacementStatus } from '../data/students';
import { useCampusFilters } from '../context/FilterContext';
import { StudentProfileModal } from '../components/students/StudentProfileModal';
import { PageHeader } from '../components/layout/PageHeader';
import { cn } from '../utils/cn';

interface StudentsPageProps {
  onSelectStudentModal?: (student: Student) => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = () => {
  const { department, semester, setDepartment } = useCampusFilters();

  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'All' | RiskTier>('All');
  const [placementFilter, setPlacementFilter] = useState<'All' | PlacementStatus>('All');
  const [sortField, setSortField] = useState<keyof Student>('cgpa');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Filter students
  const filtered = useMemo(() => {
    return STUDENTS.filter(student => {
      // Dept filter
      if (department !== 'All' && student.department !== department) return false;

      // Semester filter
      if (semester !== 'All') {
        if (semester === 'Odd Sems' && student.semester % 2 === 0) return false;
        if (semester === 'Even Sems' && student.semester % 2 !== 0) return false;
        if (semester.startsWith('Sem ') && student.semester !== parseInt(semester.replace('Sem ', ''))) return false;
      }

      // Risk filter
      if (riskFilter !== 'All' && student.riskTier !== riskFilter) return false;

      // Placement filter
      if (placementFilter !== 'All' && student.placementStatus !== placementFilter) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = student.name.toLowerCase().includes(q);
        const matchRoll = student.rollNo.toLowerCase().includes(q);
        const matchSkills = student.skills.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchRoll && !matchSkills) return false;
      }

      return true;
    }).sort((a, b) => {
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
  }, [department, semester, riskFilter, placementFilter, searchQuery, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getRiskBadge = (tier: RiskTier) => {
    switch (tier) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            <AlertTriangle className="h-3 w-3" /> High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
            <AlertCircle className="h-3 w-3" /> Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            <ShieldCheck className="h-3 w-3" /> Low
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Standardized Page Header */}
      <PageHeader
        title="Students Roster"
        description="Search and analyze student profiles, cumulative GPA progression, attendance compliance, and early warning risk models."
        actions={
          <span className="rounded-lg border border-slate-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            Showing {filtered.length} of {STUDENTS.length} sample records (8,426 enrolled campus-wide)
          </span>
        }
      />

      {/* Filter and Search Ribbon */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by student name, roll no, or skill..."
              className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 shadow-2xs placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={department}
              onChange={e => {
                setDepartment(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="All">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <select
              value={riskFilter}
              onChange={e => {
                setRiskFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="All">All Risk Levels</option>
              <option value="High">High Risk (Immediate Action)</option>
              <option value="Medium">Medium Risk (Monitoring)</option>
              <option value="Low">Low Risk (On Track)</option>
            </select>
          </div>

          {/* Placement Filter */}
          <div>
            <select
              value={placementFilter}
              onChange={e => {
                setPlacementFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="All">All Placement Statuses</option>
              <option value="Placed">Placed</option>
              <option value="Eligible">Eligible</option>
              <option value="In Process">In Process</option>
              <option value="Not Eligible">Not Eligible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/70 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">Student & Roll No <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('department')}>
                  <div className="flex items-center gap-1">Department <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('semester')}>
                  <div className="flex items-center gap-1">Semester <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-indigo-600 text-right" onClick={() => handleSort('cgpa')}>
                  <div className="flex items-center justify-end gap-1">CGPA <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-indigo-600 text-right" onClick={() => handleSort('attendance')}>
                  <div className="flex items-center justify-end gap-1">Attendance <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('placementStatus')}>
                  <div className="flex items-center gap-1">Placement Status <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('riskTier')}>
                  <div className="flex items-center gap-1">Risk Tier <ArrowUpDown className="h-3 w-3" /></div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {paginatedStudents.map(student => (
                <tr
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className="group cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 shrink-0">
                        {student.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors">
                          {student.name}
                        </div>
                        <div className="font-mono text-[11px] text-slate-400">
                          {student.rollNo} • {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    {student.department}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    Semester {student.semester}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {student.cgpa.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={cn(
                      'font-mono font-bold',
                      student.attendance >= 75
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    )}>
                      {student.attendance.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-900 dark:text-slate-200">
                      {student.placementStatus}
                    </span>
                    {student.companyPlaced && (
                      <div className="text-[10px] text-slate-400">
                        {student.companyPlaced} (₹{student.packageLPA} LPA)
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {getRiskBadge(student.riskTier)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudent(student);
                      }}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <Eye className="h-3 w-3 text-slate-400" />
                      Profile
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedStudents.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No students found matching your criteria.</p>
                      <button
                        onClick={() => { setSearchQuery(''); setDepartment('All'); setRiskFilter('All'); setPlacementFilter('All'); }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Showing Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filtered.length} total filtered results)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Profile View */}
      <StudentProfileModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
};
