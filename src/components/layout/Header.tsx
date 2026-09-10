import React, { useState } from 'react';
import {
  Search, Bell, Moon, Sun, Menu, ChevronDown, Check, LogOut
} from 'lucide-react';
import { useCampusFilters, type AcademicYear, type SemesterFilter, type DepartmentFilter } from '../../context/FilterContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

interface HeaderProps {
  pageTitle: string;
  breadcrumb?: string;
  onOpenMobileMenu: () => void;
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pageTitle,
  breadcrumb = 'Overview',
  onOpenMobileMenu,
  onOpenCommandPalette,
}) => {
  const { academicYear, semester, department, setAcademicYear, setSemester, setDepartment } = useCampusFilters();
  const { theme, toggleTheme } = useTheme();
  const { user, demoLogin, logout } = useAuth();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Attendance Dip Flagged', desc: 'Civil Engineering 3rd Sem Friday lab attendance dropped to 66.2%.', time: '10m ago', unread: true },
    { id: 2, title: 'Placement Offer Milestone', desc: 'Texas Instruments released 24 dream-tier VLSI offers.', time: '1h ago', unread: true },
    { id: 3, title: 'Risk Cohort Alert', desc: '3 new students entered High-Risk status due to consecutive test absences.', time: '2h ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/95">
      {/* Left: Hamburger + Page Title & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">CampusPulse BI</span>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300">{breadcrumb}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              {pageTitle}
            </h1>
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-amber-200/70 bg-amber-50/70 px-2.5 py-0.5 text-[10px] font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              DEMO ENVIRONMENT • Synthetic Dataset
            </span>
          </div>
        </div>
      </div>

      {/* Right: Interactive Global Filters & Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Academic Year Selector */}
        <div className="relative hidden md:block">
          <select
            value={academicYear}
            onChange={e => setAcademicYear(e.target.value as AcademicYear)}
            className="h-9 cursor-pointer appearance-none rounded-lg border border-slate-200/90 bg-slate-50/70 pl-3 pr-8 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700/60 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-colors"
          >
            <option value="2025–26">AY 2025–26</option>
            <option value="2024–25">AY 2024–25</option>
            <option value="2023–24">AY 2023–24</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        </div>

        {/* Semester Selector */}
        <div className="relative hidden xl:block">
          <select
            value={semester}
            onChange={e => setSemester(e.target.value as SemesterFilter)}
            className="h-9 cursor-pointer appearance-none rounded-lg border border-slate-200/90 bg-slate-50/70 pl-3 pr-8 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700/60 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-colors"
          >
            <option value="All">All Semesters</option>
            <option value="Odd Sems">Odd Semesters (1, 3, 5, 7)</option>
            <option value="Even Sems">Even Semesters (2, 4, 6, 8)</option>
            <option value="Sem 1">Sem 1 (Freshmen)</option>
            <option value="Sem 2">Sem 2</option>
            <option value="Sem 3">Sem 3</option>
            <option value="Sem 4">Sem 4 (Sophomore)</option>
            <option value="Sem 5">Sem 5</option>
            <option value="Sem 6">Sem 6 (Pre-Final)</option>
            <option value="Sem 7">Sem 7</option>
            <option value="Sem 8">Sem 8 (Final Year)</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        </div>

        {/* Department Filter */}
        <div className="relative hidden sm:block">
          <select
            value={department}
            onChange={e => setDepartment(e.target.value as DepartmentFilter)}
            className="h-9 cursor-pointer appearance-none rounded-lg border border-slate-200/90 bg-slate-50/70 pl-3 pr-8 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700/60 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-colors"
          >
            <option value="All">All Departments (6)</option>
            <option value="CSE">CSE (Computer Science)</option>
            <option value="IT">IT (Information Tech)</option>
            <option value="ECE">ECE (Electronics & Comm)</option>
            <option value="EEE">EEE (Electrical)</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        </div>

        {/* Global Search Button / Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex h-9 items-center gap-2 rounded-lg border border-slate-200/90 bg-slate-50/70 px-3 text-xs text-slate-500 shadow-2xs hover:bg-slate-100 hover:text-slate-700 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-700/60 dark:hover:text-slate-200 transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden rounded bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-400 shadow-2xs border border-slate-200 dark:border-slate-600 dark:bg-slate-700 sm:inline">
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme mode"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 shadow-2xs hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-slate-600" />
          )}
        </button>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 shadow-2xs hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">Campus Alerts</span>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  2 New
                </span>
              </div>
              <div className="mt-2 space-y-2">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className="rounded-lg p-2 text-left text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="mt-0.5 text-slate-500 dark:text-slate-400">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown & Demo Role Switch */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {user ? user.name[0] : 'U'}
            </div>
            <div className="hidden text-left lg:block">
              <div className="text-xs font-semibold text-slate-900 dark:text-white leading-none">
                {user?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                {user?.role || 'Campus Admin'}
              </div>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900 text-xs">
              <div className="border-b border-slate-100 p-2 dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{user?.email}</p>
                <span className="mt-1 inline-block rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Role: {user?.role}
                </span>
              </div>

              {/* Demo Role Switcher */}
              <div className="p-2">
                <span className="text-[10px] font-semibold uppercase text-slate-400">
                  Switch Persona (Demo)
                </span>
                <div className="mt-1 space-y-1">
                  {(['Administrator', 'Dean of Academics', 'Head of Department', 'Placement Director'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        demoLogin(role);
                        setShowProfileMenu(false);
                      }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors',
                        user?.role === role
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      )}
                    >
                      <span>{role}</span>
                      {user?.role === role && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 p-1 dark:border-slate-800">
                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
