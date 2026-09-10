import React from 'react';
import { cn } from '../../utils/cn';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  heightVariant?: 'compact' | 'medium' | 'large';
  footer?: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  badge,
  action,
  children,
  className,
  heightVariant = 'medium',
  footer,
}) => {
  const getHeightClass = () => {
    switch (heightVariant) {
      case 'compact':
        return 'min-h-[220px]';
      case 'large':
        return 'min-h-[340px]';
      case 'medium':
      default:
        return 'min-h-[280px]';
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900/90',
        className
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h3>
            {badge && (
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>

      <div className={cn('relative w-full flex-1', getHeightClass())}>
        {children}
      </div>

      {footer && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
          {footer}
        </div>
      )}
    </div>
  );
};
