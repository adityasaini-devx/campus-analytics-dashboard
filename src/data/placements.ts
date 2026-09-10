export interface CompanyHiring {
  id: string;
  name: string;
  logoText: string;
  sector: 'Tech & Cloud' | 'Semiconductors' | 'Consulting & FinTech' | 'Automotive' | 'Core Engineering';
  studentsHired: number;
  avgPackageLPA: number;
  highestPackageLPA: number;
  roles: string[];
  tier: 'Marquee / Dream' | 'Super Dream' | 'Regular';
}

export interface PlacementYearTrend {
  year: string;
  eligible: number;
  placed: number;
  rate: number;
  avgPackageLPA: number;
  highestPackageLPA: number;
}

export interface SalaryDistribution {
  tier: string;
  range: string;
  count: number;
  percentage: number;
  color: string;
}

export const TOP_HIRING_COMPANIES: CompanyHiring[] = [
  {
    id: 'comp-1',
    name: 'Google India',
    logoText: 'GOOG',
    sector: 'Tech & Cloud',
    studentsHired: 28,
    avgPackageLPA: 38.5,
    highestPackageLPA: 48.0,
    roles: ['Software Engineer', 'Cloud Architect', 'Site Reliability Engineer'],
    tier: 'Marquee / Dream',
  },
  {
    id: 'comp-2',
    name: 'Microsoft IDC',
    logoText: 'MSFT',
    sector: 'Tech & Cloud',
    studentsHired: 42,
    avgPackageLPA: 34.0,
    highestPackageLPA: 45.0,
    roles: ['Software Engineer', 'Applied Scientist', 'Product Manager'],
    tier: 'Marquee / Dream',
  },
  {
    id: 'comp-3',
    name: 'Texas Instruments',
    logoText: 'TXN',
    sector: 'Semiconductors',
    studentsHired: 24,
    avgPackageLPA: 24.5,
    highestPackageLPA: 36.0,
    roles: ['Analog Design Engineer', 'VLSI Verification Engineer', 'Embedded Systems'],
    tier: 'Marquee / Dream',
  },
  {
    id: 'comp-4',
    name: 'Amazon Web Services',
    logoText: 'AMZN',
    sector: 'Tech & Cloud',
    studentsHired: 56,
    avgPackageLPA: 28.0,
    highestPackageLPA: 44.0,
    roles: ['SDE-1', 'Cloud Support Associate', 'DevOps Specialist'],
    tier: 'Marquee / Dream',
  },
  {
    id: 'comp-5',
    name: 'Deloitte USI',
    logoText: 'DEL',
    sector: 'Consulting & FinTech',
    studentsHired: 88,
    avgPackageLPA: 12.5,
    highestPackageLPA: 18.0,
    roles: ['Technology Consultant', 'Risk Advisory Analyst', 'Cybersecurity Specialist'],
    tier: 'Super Dream',
  },
  {
    id: 'comp-6',
    name: 'Larsen & Toubro Ltd',
    logoText: 'L&T',
    sector: 'Core Engineering',
    studentsHired: 64,
    avgPackageLPA: 9.8,
    highestPackageLPA: 16.5,
    roles: ['Graduate Engineer Trainee', 'Structural Planning Engineer', 'EPC Specialist'],
    tier: 'Regular',
  },
  {
    id: 'comp-7',
    name: 'Tata Motors & Jaguar',
    logoText: 'TATA',
    sector: 'Automotive',
    studentsHired: 38,
    avgPackageLPA: 11.2,
    highestPackageLPA: 18.5,
    roles: ['Vehicle Dynamics Engineer', 'EV Battery Systems Specialist', 'Design Engineer'],
    tier: 'Super Dream',
  },
  {
    id: 'comp-8',
    name: 'Qualcomm',
    logoText: 'QCOM',
    sector: 'Semiconductors',
    studentsHired: 19,
    avgPackageLPA: 26.0,
    highestPackageLPA: 38.0,
    roles: ['Hardware Engineer', 'Modem Firmware Developer', 'Wireless Tech'],
    tier: 'Marquee / Dream',
  },
  {
    id: 'comp-9',
    name: 'TCS Digital & Ninja',
    logoText: 'TCS',
    sector: 'Tech & Cloud',
    studentsHired: 165,
    avgPackageLPA: 7.5,
    highestPackageLPA: 12.0,
    roles: ['Digital Innovator', 'Systems Engineer', 'Cloud Developer'],
    tier: 'Regular',
  },
  {
    id: 'comp-10',
    name: 'Schneider Electric',
    logoText: 'SE',
    sector: 'Core Engineering',
    studentsHired: 32,
    avgPackageLPA: 10.4,
    highestPackageLPA: 16.0,
    roles: ['Automation Engineer', 'Power Grid Specialist', 'R&D Associate'],
    tier: 'Super Dream',
  },
];

export const PLACEMENT_HISTORICAL_TRENDS: PlacementYearTrend[] = [
  { year: '2021-22', eligible: 1820, placed: 1292, rate: 71.0, avgPackageLPA: 7.8, highestPackageLPA: 38.0 },
  { year: '2022-23', eligible: 1910, placed: 1413, rate: 74.0, avgPackageLPA: 8.6, highestPackageLPA: 42.0 },
  { year: '2023-24', eligible: 1980, placed: 1515, rate: 76.5, avgPackageLPA: 9.4, highestPackageLPA: 45.0 },
  { year: '2024-25', eligible: 2040, placed: 1581, rate: 77.5, avgPackageLPA: 10.1, highestPackageLPA: 46.5 },
  { year: '2025-26', eligible: 2066, placed: 1624, rate: 78.6, avgPackageLPA: 10.8, highestPackageLPA: 48.0 },
];

export const SALARY_DISTRIBUTIONS: SalaryDistribution[] = [
  { tier: 'Entry Level', range: '< ₹6 LPA', count: 488, percentage: 30.1, color: '#94a3b8' },
  { tier: 'Mid Tier', range: '₹6 – 10 LPA', count: 624, percentage: 38.4, color: '#6366f1' },
  { tier: 'Dream Tier', range: '₹10 – 18 LPA', count: 342, percentage: 21.1, color: '#0ea5e9' },
  { tier: 'Super Dream / Marquee', range: '> ₹18 LPA', count: 170, percentage: 10.4, color: '#10b981' },
];

export const OVERALL_ELIGIBLE_STUDENTS = 2066;
export const OVERALL_PLACED_STUDENTS = 1624;
export const OVERALL_PLACEMENT_RATE = 78.6; // 1624 / 2066 = 78.6%
export const OVERALL_AVG_PACKAGE = 10.8;
export const OVERALL_HIGHEST_PACKAGE = 48.0;
