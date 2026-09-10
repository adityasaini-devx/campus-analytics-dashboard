export interface CampusSkill {
  name: string;
  category: 'Software' | 'Hardware/Core' | 'Data & AI' | 'Soft Skills';
  studentCount: number;
  percentage: number;
}

export interface SkillGapItem {
  skill: string;
  studentProficiency: number; // % of campus having verified skill
  industryDemand: number;     // % of hiring partners requiring it
  gap: number;                // studentProficiency - industryDemand
  urgency: 'High' | 'Moderate' | 'Low';
  category: string;
}

export const TOP_CAMPUS_SKILLS: CampusSkill[] = [
  { name: 'Python', category: 'Software', studentCount: 6572, percentage: 78.0 },
  { name: 'Communication', category: 'Soft Skills', studentCount: 6066, percentage: 72.0 },
  { name: 'Java', category: 'Software', studentCount: 5814, percentage: 69.0 },
  { name: 'JavaScript & TS', category: 'Software', studentCount: 5392, percentage: 64.0 },
  { name: 'SQL & Relational DB', category: 'Data & AI', studentCount: 5140, percentage: 61.0 },
  { name: 'Machine Learning', category: 'Data & AI', studentCount: 3960, percentage: 47.0 },
  { name: 'React & Frontend', category: 'Software', studentCount: 3707, percentage: 44.0 },
  { name: 'Data Analysis', category: 'Data & AI', studentCount: 3455, percentage: 41.0 },
  { name: 'Cloud (AWS/GCP)', category: 'Software', studentCount: 3033, percentage: 36.0 },
  { name: 'Embedded C / RTOS', category: 'Hardware/Core', studentCount: 2359, percentage: 28.0 },
  { name: 'CAD / SolidWorks', category: 'Hardware/Core', studentCount: 1938, percentage: 23.0 },
  { name: 'STAAD / BIM', category: 'Hardware/Core', studentCount: 1095, percentage: 13.0 },
];

export const SKILL_GAP_ANALYSIS: SkillGapItem[] = [
  { skill: 'Cloud & Kubernetes', studentProficiency: 36, industryDemand: 78, gap: -42, urgency: 'High', category: 'Infrastructure' },
  { skill: 'GenAI & LLM Ops', studentProficiency: 32, industryDemand: 72, gap: -40, urgency: 'High', category: 'Data & AI' },
  { skill: 'System Design', studentProficiency: 26, industryDemand: 65, gap: -39, urgency: 'High', category: 'Architecture' },
  { skill: 'DevOps & CI/CD', studentProficiency: 29, industryDemand: 62, gap: -33, urgency: 'High', category: 'DevOps' },
  { skill: 'Cybersecurity & IAM', studentProficiency: 22, industryDemand: 54, gap: -32, urgency: 'Moderate', category: 'Security' },
  { skill: 'Full Stack Development', studentProficiency: 64, industryDemand: 74, gap: -10, urgency: 'Moderate', category: 'Development' },
  { skill: 'Data Structures & Alg', studentProficiency: 74, industryDemand: 80, gap: -6, urgency: 'Low', category: 'Core CS' },
  { skill: 'Core Python/Java', studentProficiency: 82, industryDemand: 84, gap: -2, urgency: 'Low', category: 'Programming' },
];

export const CERTIFICATIONS_DATA = [
  { cert: 'AWS Certified Cloud Practitioner / Solutions Architect', holders: 642, growth: '+28%' },
  { cert: 'Google Cloud Associate Cloud Engineer', holders: 390, growth: '+34%' },
  { cert: 'NVIDIA Deep Learning Institute (DLI)', holders: 285, growth: '+52%' },
  { cert: 'Cisco Certified Network Associate (CCNA)', holders: 310, growth: '+15%' },
  { cert: 'Autodesk Certified Professional (CAD/BIM)', holders: 220, growth: '+12%' },
];
