import React, { useState, useEffect, useMemo } from 'react';
import { Search, LayoutDashboard, Building2, Users, ArrowRight, X, AlertTriangle, GraduationCap } from 'lucide-react';
import { type PageId } from './Sidebar';
import { STUDENTS, type Student } from '../../data/students';
import { DEPARTMENTS } from '../../data/departments';
import { cn } from '../../utils/cn';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageId) => void;
  onSelectStudent: (student: Student) => void;
}

type PaletteItem =
  | { type: 'page'; id: PageId; title: string; subtitle: string; icon: React.ElementType }
  | { type: 'student'; student: Student }
  | { type: 'dept'; code: string; name: string; hod: string };

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectStudent,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const pages: { id: PageId; title: string; subtitle: string; icon: React.ElementType }[] = [
    { id: 'dashboard', title: 'Dashboard', subtitle: 'Campus overview and institutional KPIs', icon: LayoutDashboard },
    { id: 'students', title: 'Students Roster', subtitle: 'Search and analyze student profiles', icon: Users },
    { id: 'risk', title: 'Risk Analysis', subtitle: 'AI early-warning retention & What-If simulator', icon: AlertTriangle },
    { id: 'academics', title: 'Academic Performance', subtitle: 'Curriculum progression & CGPA distribution', icon: GraduationCap },
    { id: 'attendance', title: 'Attendance Analytics', subtitle: 'Statutory 75% examination compliance', icon: GraduationCap },
    { id: 'departments', title: 'Departments Directory', subtitle: 'Engineering faculties and HOD directory', icon: Building2 },
    { id: 'placements', title: 'Placement Analytics', subtitle: 'Corporate hiring outcomes and salaries', icon: GraduationCap },
    { id: 'reports', title: 'Accreditation Reports', subtitle: 'Generate institutional PDF and CSV dossiers', icon: GraduationCap },
  ];

  // Flattened actionable list for keyboard navigation
  const filteredPages = useMemo(() => {
    return pages.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      p.id.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const filteredStudents = useMemo(() => {
    return STUDENTS.filter(s =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(query.toLowerCase()) ||
      s.department.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 4);
  }, [query]);

  const filteredDepts = useMemo(() => {
    return DEPARTMENTS.filter(d =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.code.toLowerCase().includes(query.toLowerCase()) ||
      d.hod.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);
  }, [query]);

  const allItems: PaletteItem[] = useMemo(() => {
    const items: PaletteItem[] = [];
    filteredPages.forEach(p => items.push({ type: 'page', ...p }));
    filteredStudents.forEach(s => items.push({ type: 'student', student: s }));
    filteredDepts.forEach(d => items.push({ type: 'dept', code: d.code, name: d.name, hod: d.hod }));
    return items;
  }, [filteredPages, filteredStudents, filteredDepts]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const executeItem = (item: PaletteItem) => {
    if (item.type === 'page') {
      onNavigate(item.id);
      onClose();
    } else if (item.type === 'student') {
      onSelectStudent(item.student);
      onClose();
    } else if (item.type === 'dept') {
      onNavigate('departments');
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
        }
        return;
      }

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (allItems.length > 0 ? (prev + 1) % allItems.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (allItems.length > 0 ? (prev - 1 + allItems.length) % allItems.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (allItems[selectedIndex]) {
          executeItem(allItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, allItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden animate-fade-in">
        {/* Search input bar */}
        <div className="flex items-center border-b border-slate-200/90 px-4 py-3 dark:border-slate-800">
          <Search className="h-4 w-4 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages, students, or departments... (Use ↑ ↓ to navigate)"
            autoFocus
            className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden dark:text-white"
          />
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 text-xs divide-y divide-slate-100 dark:divide-slate-800/60">
          {allItems.length === 0 ? (
            <div className="py-8 text-center text-slate-400 dark:text-slate-500">
              <p className="text-xs">No matching results found for "{query}"</p>
              <p className="text-[11px] mt-1 text-slate-400">Try searching for "Risk", "CSE", or a student name.</p>
            </div>
          ) : (
            <>
              {/* Category: Pages */}
              {filteredPages.length > 0 && (
                <div className="py-1.5">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Pages
                  </div>
                  {filteredPages.map((page) => {
                    const itemIdx = allItems.findIndex(it => it.type === 'page' && it.id === page.id);
                    const isSelected = itemIdx === selectedIndex;
                    const PageIcon = page.icon;
                    return (
                      <button
                        key={page.id}
                        onClick={() => executeItem(allItems[itemIdx])}
                        onMouseEnter={() => setSelectedIndex(itemIdx)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors',
                          isSelected
                            ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-200 font-medium'
                            : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60'
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <PageIcon className={cn('h-4 w-4', isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400')} />
                          <div>
                            <div className="font-semibold leading-tight">{page.title}</div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500">{page.subtitle}</div>
                          </div>
                        </div>
                        <ArrowRight className={cn('h-3.5 w-3.5', isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600')} />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Category: Students */}
              {filteredStudents.length > 0 && (
                <div className="py-1.5">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Students
                  </div>
                  {filteredStudents.map((st) => {
                    const itemIdx = allItems.findIndex(it => it.type === 'student' && it.student.id === st.id);
                    const isSelected = itemIdx === selectedIndex;
                    return (
                      <button
                        key={st.id}
                        onClick={() => executeItem(allItems[itemIdx])}
                        onMouseEnter={() => setSelectedIndex(itemIdx)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors',
                          isSelected
                            ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-200 font-medium'
                            : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60'
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100 dark:bg-indigo-950 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                            {st.name[0]}
                          </div>
                          <div>
                            <div className="font-semibold leading-tight">{st.name}</div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                              {st.rollNo} • {st.department} Sem {st.semester} • CGPA {st.cgpa}
                            </div>
                          </div>
                        </div>
                        <span className={cn(
                          'rounded px-1.5 py-0.5 text-[10px] font-semibold',
                          st.riskTier === 'High' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' :
                          st.riskTier === 'Medium' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                          'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        )}>
                          {st.riskTier} Risk
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Category: Departments */}
              {filteredDepts.length > 0 && (
                <div className="py-1.5">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Departments
                  </div>
                  {filteredDepts.map((d) => {
                    const itemIdx = allItems.findIndex(it => it.type === 'dept' && it.code === d.code);
                    const isSelected = itemIdx === selectedIndex;
                    return (
                      <button
                        key={d.code}
                        onClick={() => executeItem(allItems[itemIdx])}
                        onMouseEnter={() => setSelectedIndex(itemIdx)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors',
                          isSelected
                            ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-200 font-medium'
                            : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60'
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Building2 className={cn('h-4 w-4', isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400')} />
                          <div>
                            <div className="font-semibold leading-tight">{d.name} ({d.code})</div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500">HOD: {d.hod}</div>
                          </div>
                        </div>
                        <ArrowRight className={cn('h-3.5 w-3.5', isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600')} />
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-[10px] text-slate-400 dark:border-slate-800 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <span><kbd className="rounded border bg-white dark:bg-slate-800 px-1 py-0.5">↑</kbd> <kbd className="rounded border bg-white dark:bg-slate-800 px-1 py-0.5">↓</kbd> Navigate</span>
            <span><kbd className="rounded border bg-white dark:bg-slate-800 px-1 py-0.5">Enter</kbd> Select</span>
            <span><kbd className="rounded border bg-white dark:bg-slate-800 px-1 py-0.5">Esc</kbd> Close</span>
          </div>
          <span>CampusPulse Search</span>
        </div>
      </div>
    </div>
  );
};
