import React from 'react';
import {
  BookOpen, Key, Mail, Sparkles
} from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';

export const HelpPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Help, Documentation & Metric Glossaries"
        description="User manual, operational definitions, keyboard navigation shortcuts, and administrative guides."
      />

      {/* Quick Start Guide */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
          <BookOpen className="h-4 w-4 text-indigo-600" />
          <span>Product Overview & Navigation</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          CampusPulse is a comprehensive Higher Education Intelligence & Analytics SaaS designed to convert raw academic, attendance, recruitment, and student life data into proactive decisions.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <span className="font-bold text-slate-900 dark:text-white">Global Filter Ribbon</span>
            <p className="mt-1 text-slate-500">Header dropdowns dynamically filter all charts, KPIs, and rosters simultaneously.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <span className="font-bold text-slate-900 dark:text-white">Deep-Dive Modals</span>
            <p className="mt-1 text-slate-500">Click any student or department row/bar to inspect detailed semester curves and attendance breakdowns.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <span className="font-bold text-slate-900 dark:text-white">Live Data Consistency</span>
            <p className="mt-1 text-slate-500">All numbers across all pages derive from a single unified relational mock model with zero conflicting figures.</p>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
          <Key className="h-4 w-4 text-amber-500" />
          <span>Keyboard Shortcuts</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded border border-slate-100 dark:border-slate-800">
            <span className="text-slate-700 dark:text-slate-300">Open Command Palette / Global Search</span>
            <kbd className="rounded border bg-slate-50 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Ctrl + K / ⌘K
            </kbd>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded border border-slate-100 dark:border-slate-800">
            <span className="text-slate-700 dark:text-slate-300">Close Open Modal / Drawer</span>
            <kbd className="rounded border bg-slate-50 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Esc
            </kbd>
          </div>
        </div>
      </div>

      {/* Institutional Metrics Glossary */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span>Core Metric Definitions</span>
        </div>
        <div className="space-y-3 text-xs">
          <div className="border-b border-slate-100 pb-2 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white">Cumulative Grade Point Average (CGPA):</span>
            <p className="text-slate-500 mt-0.5">Weighted grade point average earned across all completed semesters on a standard 10.0 grading scale.</p>
          </div>
          <div className="border-b border-slate-100 pb-2 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white">Statutory Attendance Threshold (75.0%):</span>
            <p className="text-slate-500 mt-0.5">Minimum class attendance percentage required by university statutes for end-term examination admission without medical condonation.</p>
          </div>
          <div className="border-b border-slate-100 pb-2 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white">Composite Risk Score (0–100):</span>
            <p className="text-slate-500 mt-0.5">Calculated as: Attendance Deficit (30%) + Academic Trend (35%) + Backlogs (20%) + Engagement (15%). Used to trigger mentoring interventions.</p>
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Pre-Placement Offer (PPO):</span>
            <p className="text-slate-500 mt-0.5">Direct full-time employment contracts awarded to students based on outstanding performance during their summer internships.</p>
          </div>
        </div>
      </div>

      {/* Support & Contacts */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-indigo-500" />
          <span>Technical Support & ERP Integration: <strong>support@campuspulse.edu</strong></span>
        </div>
        <span className="font-mono text-[11px]">v2.4.0 (Enterprise)</span>
      </div>
    </div>
  );
};
