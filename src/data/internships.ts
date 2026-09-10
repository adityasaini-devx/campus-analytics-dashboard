export interface InternshipSector {
  sector: string;
  count: number;
  percentage: number;
  avgStipendK: number;
}

export interface InternshipDuration {
  duration: string;
  students: number;
  percentage: number;
}

export const INTERNSHIP_STATS = {
  totalEligible: 4280, // Pre-final & Final year students
  internshipsSecured: 2748, // 64.2% rate matching CAMPUS_INTERNSHIP_RATE
  participationRate: 64.2,
  paidPercentage: 78.4,
  unpaidPercentage: 21.6,
  averageStipendPerMonth: 28500, // INR
  highestStipendPerMonth: 125000, // Google / Uber
  ppoConversionRate: 42.8, // Pre-placement offers
};

export const INTERNSHIP_SECTORS: InternshipSector[] = [
  { sector: 'Software & SaaS', count: 1045, percentage: 38.0, avgStipendK: 36.5 },
  { sector: 'Semiconductor & Hardware', count: 480, percentage: 17.5, avgStipendK: 32.0 },
  { sector: 'FinTech & Banking', count: 412, percentage: 15.0, avgStipendK: 30.0 },
  { sector: 'Automotive & EV Tech', count: 358, percentage: 13.0, avgStipendK: 24.0 },
  { sector: 'Civil Infrastructure & EPC', count: 260, percentage: 9.5, avgStipendK: 18.5 },
  { sector: 'Renewable Energy & Power', count: 193, percentage: 7.0, avgStipendK: 20.0 },
];

export const INTERNSHIP_DURATIONS: InternshipDuration[] = [
  { duration: 'Summer (2 Months)', students: 1340, percentage: 48.8 },
  { duration: 'Semester-long (6 Months)', students: 980, percentage: 35.7 },
  { duration: 'Year-long Co-op (12 Months)', students: 310, percentage: 11.3 },
  { duration: 'Winter (4-6 Weeks)', students: 118, percentage: 4.2 },
];

export const INTERNSHIP_TOP_RECRUITERS = [
  { company: 'Google India', internsHired: 32, stipendMonthly: '₹1,25,000', ppoOffered: 26 },
  { company: 'Microsoft IDC', internsHired: 48, stipendMonthly: '₹1,10,000', ppoOffered: 38 },
  { company: 'Texas Instruments', internsHired: 28, stipendMonthly: '₹65,000', ppoOffered: 21 },
  { company: 'Amazon', internsHired: 52, stipendMonthly: '₹80,000', ppoOffered: 35 },
  { company: 'Qualcomm', internsHired: 22, stipendMonthly: '₹55,000', ppoOffered: 17 },
  { company: 'Tata Motors', internsHired: 45, stipendMonthly: '₹30,000', ppoOffered: 24 },
  { company: 'L&T Construction', internsHired: 60, stipendMonthly: '₹22,000', ppoOffered: 32 },
  { company: 'Siemens Energy', internsHired: 30, stipendMonthly: '₹28,000', ppoOffered: 18 },
];
