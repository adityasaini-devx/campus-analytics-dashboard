import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatCurrencyLakhs(num: number): string {
  return `₹${num.toFixed(1)} LPA`;
}

export function formatPercent(num: number): string {
  return `${num.toFixed(1)}%`;
}
