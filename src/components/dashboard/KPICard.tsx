import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface KPICardProps {
  title: string;
  value: string | number;
  valueColor?: string;
  change?: number; // e.g. 4.8 or -12.0
  changeLabel?: string;
  subtitle?: string;
  sparklineData?: number[];
  hideSparkline?: boolean;
  icon: React.ElementType;
  iconBgColor?: string;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'purple' | string;
  trend?: 'up' | 'down' | 'neutral' | string;
  isPositiveImprovement?: boolean; // If true, negative change is good (e.g. at-risk students decreasing)
  badgeText?: string;
  className?: string;
  onClick?: () => void;
}

const colorMap: Record<string, string> = {
  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
  rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
  sky: 'bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400',
  violet: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  valueColor,
  change,
  changeLabel = 'vs last period',
  subtitle,
  sparklineData = [40, 55, 62, 58, 70, 82, 90],
  hideSparkline = false,
  icon: Icon,
  iconBgColor,
  color,
  trend: _trend,
  isPositiveImprovement = false,
  badgeText,
  className,
  onClick,
}) => {
  const resolvedIconBg = iconBgColor || (color && colorMap[color]) || 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400';
  // Determine if trend is favorable
  const isPositiveDelta = (change ?? 0) > 0;
  const isGood = isPositiveImprovement ? !isPositiveDelta : isPositiveDelta;

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all duration-200 hover:shadow-xs hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700 min-h-[140px]',
        onClick && 'cursor-pointer hover:-translate-y-0.5',
        className
      )}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
            {title}
          </p>
          <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105', resolvedIconBg)}>
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className={cn('text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white', valueColor)}>
            {value}
          </span>
          {badgeText && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {badgeText}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        {subtitle ? (
          <span className="text-slate-500 dark:text-slate-400 truncate">
            {subtitle}
          </span>
        ) : change !== undefined ? (
          <div className="flex items-center gap-1">
            <span
              className={cn(
                'inline-flex items-center font-semibold',
                isGood
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              )}
            >
              {change > 0 ? (
                <ArrowUpRight className="mr-0.5 h-3.5 w-3.5 stroke-[2.5]" />
              ) : change < 0 ? (
                <ArrowDownRight className="mr-0.5 h-3.5 w-3.5 stroke-[2.5]" />
              ) : (
                <Minus className="mr-0.5 h-3.5 w-3.5 stroke-[2.5]" />
              )}
              {Math.abs(change)}%
            </span>
            <span className="text-slate-500 dark:text-slate-400">{changeLabel}</span>
          </div>
        ) : (
          <span className="text-slate-400 dark:text-slate-500">Institutional Benchmark</span>
        )}

        {/* Mini Sparkline Bar Chart if not hidden and no custom subtitle */}
        {!hideSparkline && !subtitle && sparklineData && sparklineData.length > 0 && (
          <div className="flex items-end gap-0.5 h-4 shrink-0">
            {sparklineData.map((val, idx) => {
              const heightPct = Math.max(20, Math.min(100, val));
              return (
                <div
                  key={idx}
                  style={{ height: `${heightPct}%` }}
                  className={cn(
                    'w-1 rounded-xs transition-all duration-300',
                    idx === sparklineData.length - 1
                      ? isGood
                        ? 'bg-emerald-500'
                        : 'bg-rose-500'
                      : 'bg-slate-200 dark:bg-slate-700'
                  )}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
