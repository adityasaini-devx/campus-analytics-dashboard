import React from 'react';
import {
  LayoutDashboard, GraduationCap, Clock, Building2, Users,
  Briefcase, Award, Zap, AlertTriangle, FileText, Calendar,
  BookOpen, Settings, HelpCircle, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { cn } from '../../utils/cn';

export type PageId =
  | 'dashboard'
  | 'academics'
  | 'attendance'
  | 'departments'
  | 'students'
  | 'placements'
  | 'internships'
  | 'skills'
  | 'risk'
  | 'events'
  | 'faculty'
  | 'reports'
  | 'settings'
  | 'help';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavGroup {
  label: string;
  items: {
    id: PageId;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navGroups: NavGroup[] = [
    {
      label: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Academics',
      items: [
        { id: 'academics', label: 'Academic Performance', icon: GraduationCap },
        { id: 'attendance', label: 'Attendance', icon: Clock },
        { id: 'departments', label: 'Departments', icon: Building2 },
        { id: 'students', label: 'Students', icon: Users },
      ],
    },
    {
      label: 'Career & Industry',
      items: [
        { id: 'placements', label: 'Placements', icon: Briefcase },
        { id: 'internships', label: 'Internships', icon: Award },
        { id: 'skills', label: 'Skills & Gap Analysis', icon: Zap },
      ],
    },
    {
      label: 'Campus Life',
      items: [
        { id: 'events', label: 'Events & Engagement', icon: Calendar },
        { id: 'faculty', label: 'Faculty Analytics', icon: BookOpen },
      ],
    },
    {
      label: 'Intelligence',
      items: [
        { id: 'risk', label: 'Risk Analysis', icon: AlertTriangle, badge: 'Early Warning' },
        { id: 'reports', label: 'Accreditation Reports', icon: FileText },
      ],
    },
  ];

  const handleNavClick = (pageId: PageId) => {
    onSelectPage(pageId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200/80 bg-white transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900 lg:static lg:z-auto',
          isCollapsed ? 'lg:w-20' : 'lg:w-64',
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Campus<span className="text-indigo-600 dark:text-indigo-400">Pulse</span>
                </span>
                <span className="text-[10px] font-medium tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                  Institutional BI
                </span>
              </div>
            )}
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Item List */}
        <div className="flex-1 overflow-y-auto px-3 py-3.5 space-y-5">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx}>
              {(!isCollapsed || isMobileOpen) && (
                <div className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {group.label}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const ItemIcon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      title={isCollapsed && !isMobileOpen ? item.label : undefined}
                      className={cn(
                        'group flex w-full items-center rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150',
                        isActive
                          ? 'bg-indigo-50/90 text-indigo-700 shadow-2xs dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                      )}
                    >
                      <ItemIcon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-colors',
                          isActive
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300',
                          (!isCollapsed || isMobileOpen) ? 'mr-2.5' : 'mx-auto'
                        )}
                      />
                      {(!isCollapsed || isMobileOpen) && (
                        <span className="truncate flex-1 text-left">{item.label}</span>
                      )}
                      {(!isCollapsed || isMobileOpen) && item.badge && (
                        <span className="ml-auto rounded-md border border-amber-200/70 bg-amber-50 px-1.5 py-0.2 text-[9px] font-medium text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/60 dark:text-amber-300">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Nav: Settings, Help & Collapse Trigger */}
        <div className="border-t border-slate-100 p-3 dark:border-slate-800 space-y-1">
          <button
            onClick={() => handleNavClick('settings')}
            className={cn(
              'group flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-800/60',
              currentPage === 'settings' && 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold'
            )}
          >
            <Settings className={cn('h-4 w-4 shrink-0', (!isCollapsed || isMobileOpen) ? 'mr-3 text-slate-400' : 'mx-auto text-slate-400')} />
            {(!isCollapsed || isMobileOpen) && <span>Settings</span>}
          </button>

          <button
            onClick={() => handleNavClick('help')}
            className={cn(
              'group flex w-full items-center rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-800/60',
              currentPage === 'help' && 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold'
            )}
          >
            <HelpCircle className={cn('h-4 w-4 shrink-0', (!isCollapsed || isMobileOpen) ? 'mr-3 text-slate-400' : 'mx-auto text-slate-400')} />
            {(!isCollapsed || isMobileOpen) && <span>Help & Docs</span>}
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
            className="hidden lg:flex w-full items-center justify-center rounded-lg border border-slate-200/80 p-1.5 text-xs text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>
    </>
  );
};
