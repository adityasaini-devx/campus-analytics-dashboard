export interface AttendanceTier {
  category: string;
  range: string;
  count: number;
  percentage: number;
  color: string;
  status: 'optimal' | 'good' | 'warning' | 'critical';
}

export interface MonthlyAttendance {
  month: string;
  campusAvg: number;
  cse: number;
  it: number;
  ece: number;
  eee: number;
  mech: number;
  civil: number;
}

export interface DayOfWeekAttendance {
  day: string;
  avgAttendance: number;
  firstHalf: number;
  secondHalf: number;
}

export const ATTENDANCE_TIERS: AttendanceTier[] = [
  {
    category: 'Excellent',
    range: '≥ 85%',
    count: 4128,
    percentage: 49.0,
    color: '#10b981', // emerald
    status: 'optimal',
  },
  {
    category: 'Good',
    range: '75% – 84%',
    count: 2950,
    percentage: 35.0,
    color: '#6366f1', // indigo
    status: 'good',
  },
  {
    category: 'Warning',
    range: '65% – 74%',
    count: 926,
    percentage: 11.0,
    color: '#f59e0b', // amber
    status: 'warning',
  },
  {
    category: 'Critical',
    range: '< 65%',
    count: 422,
    percentage: 5.0,
    color: '#ef4444', // rose/red
    status: 'critical',
  },
];

export const TOTAL_STUDENTS_BELOW_CUTOFF = 926 + 422; // 1,348 (16.0% under statutory 75%)

export const MONTHLY_ATTENDANCE_TREND: MonthlyAttendance[] = [
  { month: 'Aug', campusAvg: 85.2, cse: 87.5, it: 86.2, ece: 85.0, eee: 83.2, mech: 83.0, civil: 82.5 },
  { month: 'Sep', campusAvg: 83.8, cse: 86.4, it: 85.0, ece: 84.1, eee: 81.8, mech: 81.2, civil: 80.0 },
  { month: 'Oct (Mid-terms)', campusAvg: 79.4, cse: 82.0, it: 81.0, ece: 80.2, eee: 77.5, mech: 76.8, civil: 75.5 },
  { month: 'Nov (Fest Season)', campusAvg: 78.1, cse: 81.2, it: 80.0, ece: 78.5, eee: 76.0, mech: 75.2, civil: 74.0 },
  { month: 'Dec (End-sems)', campusAvg: 82.5, cse: 85.8, it: 84.2, ece: 83.0, eee: 81.0, mech: 80.1, civil: 79.2 },
  { month: 'Jan', campusAvg: 84.0, cse: 87.0, it: 85.8, ece: 84.5, eee: 82.0, mech: 81.5, civil: 80.4 },
  { month: 'Feb', campusAvg: 82.2, cse: 85.2, it: 83.9, ece: 82.8, eee: 80.4, mech: 79.8, civil: 78.5 },
  { month: 'Mar (Pre-finals)', campusAvg: 81.4, cse: 84.6, it: 83.1, ece: 81.8, eee: 79.5, mech: 78.9, civil: 77.8 },
];

export const DAY_OF_WEEK_ATTENDANCE: DayOfWeekAttendance[] = [
  { day: 'Monday', avgAttendance: 84.2, firstHalf: 86.5, secondHalf: 81.9 },
  { day: 'Tuesday', avgAttendance: 83.5, firstHalf: 85.2, secondHalf: 81.8 },
  { day: 'Wednesday', avgAttendance: 82.8, firstHalf: 84.0, secondHalf: 81.6 },
  { day: 'Thursday', avgAttendance: 81.6, firstHalf: 83.1, secondHalf: 80.1 },
  { day: 'Friday', avgAttendance: 75.0, firstHalf: 79.2, secondHalf: 70.8 },
];

export const LOW_ATTENDANCE_ACTION_ITEMS = [
  {
    dept: 'Civil',
    concern: 'Highest percentage of students under 65% (8.3% of dept)',
    action: 'HOD convened emergency parent notification process.',
    urgency: 'Immediate',
  },
  {
    dept: 'Mechanical',
    concern: 'Friday laboratory attendance drops below 68% in 3rd year',
    action: 'Shifted lab schedules to Tuesday/Wednesday morning slots.',
    urgency: 'Medium',
  },
  {
    dept: 'EEE',
    concern: 'Control Systems theory class attendance at 71.2%',
    action: 'Dean assigned co-instructor and added interactive simulation modules.',
    urgency: 'High',
  },
];
