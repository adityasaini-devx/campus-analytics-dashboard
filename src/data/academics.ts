export interface GradeDistribution {
  grade: string;
  range: string;
  count: number;
  percentage: number;
  color: string;
}

export interface SemesterMetric {
  semester: string;
  avgCgpa: number;
  passPercentage: number;
  backlogPercentage: number;
  distinctionPercentage: number;
}

export const CAMPUS_ACADEMIC_STATS = {
  avgCgpa: 7.62,
  passRate: 91.4,
  backlogRate: 8.2, // 8.2% of students have 1 or more backlogs
  distinctionRate: 28.5,
  improvingStudentsPercentage: 63.8, // Percentage of students whose CGPA improved or maintained
};

export const GRADE_DISTRIBUTIONS: GradeDistribution[] = [
  { grade: 'O', range: '9.0 – 10.0', count: 944, percentage: 11.2, color: '#10b981' },
  { grade: 'A+', range: '8.0 – 8.99', count: 2494, percentage: 29.6, color: '#6366f1' },
  { grade: 'A', range: '7.0 – 7.99', count: 2932, percentage: 34.8, color: '#0ea5e9' },
  { grade: 'B+', range: '6.0 – 6.99', count: 1365, percentage: 16.2, color: '#f59e0b' },
  { grade: 'B', range: '5.5 – 5.99', count: 455, percentage: 5.4, color: '#fb923c' },
  { grade: 'C', range: '5.0 – 5.49', count: 135, percentage: 1.6, color: '#a855f7' },
  { grade: 'F / Backlog', range: '< 5.0', count: 101, percentage: 1.2, color: '#ef4444' },
];

export const SEMESTER_PERFORMANCE_METRICS: SemesterMetric[] = [
  { semester: 'Sem 1', avgCgpa: 7.78, passPercentage: 91.8, backlogPercentage: 8.2, distinctionPercentage: 29.0 },
  { semester: 'Sem 2', avgCgpa: 7.68, passPercentage: 90.2, backlogPercentage: 9.8, distinctionPercentage: 27.4 },
  { semester: 'Sem 3', avgCgpa: 7.48, passPercentage: 87.5, backlogPercentage: 12.5, distinctionPercentage: 24.1 },
  { semester: 'Sem 4', avgCgpa: 7.44, passPercentage: 86.8, backlogPercentage: 13.2, distinctionPercentage: 23.5 },
  { semester: 'Sem 5', avgCgpa: 7.58, passPercentage: 89.6, backlogPercentage: 10.4, distinctionPercentage: 26.8 },
  { semester: 'Sem 6', avgCgpa: 7.69, passPercentage: 91.2, backlogPercentage: 8.8, distinctionPercentage: 29.2 },
  { semester: 'Sem 7', avgCgpa: 7.82, passPercentage: 93.4, backlogPercentage: 6.6, distinctionPercentage: 32.5 },
  { semester: 'Sem 8', avgCgpa: 7.95, passPercentage: 96.2, backlogPercentage: 3.8, distinctionPercentage: 36.0 },
];
