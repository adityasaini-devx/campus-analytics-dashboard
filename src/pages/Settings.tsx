import React, { useState } from 'react';
import {
  Sliders, Bell, Shield, Database,
  CheckCircle2, Save
} from 'lucide-react';
import { useCampusFilters } from '../context/FilterContext';
import { PageHeader } from '../components/layout/PageHeader';

export const SettingsPage: React.FC = () => {
  const { academicYear, setAcademicYear } = useCampusFilters();

  const [attendanceThreshold, setAttendanceThreshold] = useState(75);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <PageHeader
        title="System Administration & Academic Configuration"
        description="Configure institutional thresholds, risk model weights, alert notification policies, and database sync pipelines."
      />

      {saveSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>System configurations successfully persisted.</span>
        </div>
      )}

      {/* Academic Year & Session */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
          <Sliders className="h-4 w-4 text-indigo-600" />
          <span>Institutional Academic Session</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Active Academic Year
            </label>
            <select
              value={academicYear}
              onChange={e => setAcademicYear(e.target.value as any)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="2025–26">Academic Year 2025–26 (Current Active)</option>
              <option value="2024–25">Academic Year 2024–25 (Historical)</option>
              <option value="2023–24">Academic Year 2023–24 (Archived)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Statutory Examination Attendance Cutoff (%)
            </label>
            <input
              type="number"
              value={attendanceThreshold}
              onChange={e => setAttendanceThreshold(Number(e.target.value))}
              min={60}
              max={85}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            />
            <p className="mt-1 text-[11px] text-slate-400">Standard institutional cutoff is 75.0%</p>
          </div>
        </div>
      </div>

      {/* Risk Engine Model Parameters */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
          <Shield className="h-4 w-4 text-rose-500" />
          <span>Early Warning & Risk Algorithm Weights</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <span className="text-slate-400">Attendance Deficit</span>
            <div className="mt-1 font-mono font-bold text-slate-900 dark:text-white">30% Weight</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <span className="text-slate-400">Academic CGPA Trend</span>
            <div className="mt-1 font-mono font-bold text-slate-900 dark:text-white">35% Weight</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <span className="text-slate-400">Active Backlog Load</span>
            <div className="mt-1 font-mono font-bold text-slate-900 dark:text-white">20% Weight</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <span className="text-slate-400">Campus Engagement</span>
            <div className="mt-1 font-mono font-bold text-slate-900 dark:text-white">15% Weight</div>
          </div>
        </div>
      </div>

      {/* Notifications & Automation */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
          <Bell className="h-4 w-4 text-indigo-600" />
          <span>Automated Alerts & Dispatch Channels</span>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Weekly HOD Attendance Digest</div>
              <div className="text-slate-400">Automated Monday email summarizing department deficit list</div>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={e => setEmailAlerts(e.target.checked)}
              className="rounded text-indigo-600 h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">SMS Alerts for Severe Deficits (&lt;65%)</div>
              <div className="text-slate-400">Direct alert to guardian mobile contacts</div>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={e => setSmsAlerts(e.target.checked)}
              className="rounded text-indigo-600 h-4 w-4"
            />
          </label>
        </div>
      </div>

      {/* System Status & Pipeline */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
            <Database className="h-4 w-4 text-emerald-500" />
            <span>Database Pipeline & Cloud Sync Status</span>
          </div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            Live Sync Operational
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400">ERP Student Sync</span>
            <div className="font-semibold text-slate-900 dark:text-white mt-0.5">Every 15 minutes</div>
          </div>
          <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400">Biometric Attendance Bridge</span>
            <div className="font-semibold text-slate-900 dark:text-white mt-0.5">Real-time Webhook</div>
          </div>
          <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400">Placement Portal Feed</span>
            <div className="font-semibold text-slate-900 dark:text-white mt-0.5">Active (Supabase/PostgreSQL)</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>Save System Configurations</span>
        </button>
      </div>
    </div>
  );
};
