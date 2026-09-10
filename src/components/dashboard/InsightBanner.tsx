import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, ChevronRight, X } from 'lucide-react';
import { type CampusInsight } from '../../data/insightEngine';
import { cn } from '../../utils/cn';

interface InsightBannerProps {
  insights: CampusInsight[];
  onNavigateToRisk?: () => void;
}

export const InsightBanner: React.FC<InsightBannerProps> = ({
  insights,
  onNavigateToRisk,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  if (insights.length === 0 || dismissed) return null;

  const current = insights[activeIdx % insights.length];

  const getStyle = (type: CampusInsight['type']) => {
    switch (type) {
      case 'critical':
        return {
          border: 'border-rose-200 dark:border-rose-900/50',
          bg: 'bg-rose-50/40 dark:bg-rose-950/20',
          badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
          iconColor: 'text-rose-600 dark:text-rose-400',
          Icon: AlertTriangle,
        };
      case 'warning':
        return {
          border: 'border-amber-200 dark:border-amber-900/50',
          bg: 'bg-amber-50/40 dark:bg-amber-950/20',
          badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
          iconColor: 'text-amber-600 dark:text-amber-400',
          Icon: AlertTriangle,
        };
      case 'positive':
        return {
          border: 'border-emerald-200 dark:border-emerald-900/50',
          bg: 'bg-emerald-50/40 dark:bg-emerald-950/20',
          badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          Icon: CheckCircle2,
        };
      case 'info':
      default:
        return {
          border: 'border-slate-200/80 dark:border-slate-800',
          bg: 'bg-slate-50/60 dark:bg-slate-900/40',
          badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
          iconColor: 'text-indigo-600 dark:text-indigo-400',
          Icon: Info,
        };
    }
  };

  const style = getStyle(current.type);
  const CurrentIcon = style.Icon;

  return (
    <div
      className={cn(
        'relative mb-6 rounded-xl border p-4 transition-all',
        style.bg,
        style.border
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={cn('mt-0.5 rounded-lg p-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shrink-0', style.iconColor)}>
            <CurrentIcon className="h-4 w-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Institutional Alert
              </span>
              <span className={cn('rounded-md px-2 py-0.5 text-[10px] font-semibold', style.badge)}>
                {current.category}
              </span>
              {current.metric && (
                <span className="rounded-md border border-slate-200/60 bg-white px-2 py-0.5 text-[10px] font-mono font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  {current.metric}
                </span>
              )}
            </div>
            <h4 className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {current.title}
            </h4>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 max-w-4xl leading-relaxed">
              {current.description}
            </p>
            {current.recommendation && (
              <p className="mt-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-200">Action:</span>
                {current.recommendation}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mr-2">
            <span>{activeIdx + 1}</span>
            <span>/</span>
            <span>{insights.length}</span>
          </div>
          <button
            onClick={() => setActiveIdx(prev => (prev + 1) % insights.length)}
            className="flex items-center gap-1 rounded-lg border border-slate-300/80 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          {onNavigateToRisk && current.type === 'critical' && (
            <button
              onClick={onNavigateToRisk}
              className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-medium text-white shadow-xs hover:bg-rose-700"
            >
              Intervene
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss insight banner"
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
