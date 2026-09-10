export interface Department {
  id: string;
  code: string;
  name: string;
  hod: string;
  email: string;
  totalStudents: number;
  facultyCount: number;
  avgCgpa: number;
  avgAttendance: number;
  placementRate: number;
  internshipRate: number;
  atRiskCount: number;
  avgPackageLPA: number;
  highestPackageLPA: number;
  totalEligibleForPlacement: number;
  totalPlaced: number;
  labsCount: number;
  researchPapers: number;
  studentFacultyRatio: number;
  semesterPerformance: { semester: string; avgCgpa: number; passRate: number }[];
  topSubjects: { name: string; passRate: number; avgAttendance: number }[];
  weakSubjects: { name: string; passRate: number; avgAttendance: number }[];
  description: string;
}

export const DEPARTMENTS: Department[] = [
  {
    id: 'dept-cse',
    code: 'CSE',
    name: 'Computer Science & Engineering',
    hod: 'Dr. Aris Thorne',
    email: 'hod.cse@campuspulse.edu',
    totalStudents: 2140,
    facultyCount: 138,
    avgCgpa: 8.12,
    avgAttendance: 84.6,
    placementRate: 89.2,
    internshipRate: 76.5,
    atRiskCount: 38,
    avgPackageLPA: 12.8,
    highestPackageLPA: 48.0,
    totalEligibleForPlacement: 520,
    totalPlaced: 464,
    labsCount: 16,
    researchPapers: 142,
    studentFacultyRatio: 15.5,
    semesterPerformance: [
      { semester: 'Sem 1', avgCgpa: 8.24, passRate: 94.2 },
      { semester: 'Sem 2', avgCgpa: 8.18, passRate: 93.1 },
      { semester: 'Sem 3', avgCgpa: 8.10, passRate: 91.5 },
      { semester: 'Sem 4', avgCgpa: 8.05, passRate: 90.8 },
      { semester: 'Sem 5', avgCgpa: 8.15, passRate: 92.4 },
      { semester: 'Sem 6', avgCgpa: 8.22, passRate: 93.8 },
      { semester: 'Sem 7', avgCgpa: 8.30, passRate: 95.1 },
      { semester: 'Sem 8', avgCgpa: 8.35, passRate: 97.0 },
    ],
    topSubjects: [
      { name: 'Data Structures & Algorithms', passRate: 95.4, avgAttendance: 87.2 },
      { name: 'Distributed Systems', passRate: 93.8, avgAttendance: 86.0 },
      { name: 'Machine Learning', passRate: 94.1, avgAttendance: 88.5 },
    ],
    weakSubjects: [
      { name: 'Theory of Computation', passRate: 82.5, avgAttendance: 76.2 },
      { name: 'Compiler Design', passRate: 84.1, avgAttendance: 78.4 },
    ],
    description: 'Premier department specializing in AI/ML, cloud computing, cyber-security, and high-performance software engineering.',
  },
  {
    id: 'dept-it',
    code: 'IT',
    name: 'Information Technology',
    hod: 'Dr. Meera Nambiar',
    email: 'hod.it@campuspulse.edu',
    totalStudents: 1380,
    facultyCount: 92,
    avgCgpa: 7.95,
    avgAttendance: 83.1,
    placementRate: 86.4,
    internshipRate: 72.8,
    atRiskCount: 29,
    avgPackageLPA: 10.9,
    highestPackageLPA: 42.5,
    totalEligibleForPlacement: 338,
    totalPlaced: 292,
    labsCount: 11,
    researchPapers: 89,
    studentFacultyRatio: 15.0,
    semesterPerformance: [
      { semester: 'Sem 1', avgCgpa: 8.05, passRate: 92.8 },
      { semester: 'Sem 2', avgCgpa: 7.98, passRate: 91.4 },
      { semester: 'Sem 3', avgCgpa: 7.88, passRate: 89.2 },
      { semester: 'Sem 4', avgCgpa: 7.92, passRate: 90.1 },
      { semester: 'Sem 5', avgCgpa: 7.96, passRate: 91.5 },
      { semester: 'Sem 6', avgCgpa: 8.02, passRate: 92.6 },
      { semester: 'Sem 7', avgCgpa: 8.14, passRate: 94.0 },
      { semester: 'Sem 8', avgCgpa: 8.21, passRate: 95.8 },
    ],
    topSubjects: [
      { name: 'Web Architecture & Cloud', passRate: 94.2, avgAttendance: 85.9 },
      { name: 'Database Management Systems', passRate: 93.0, avgAttendance: 84.7 },
    ],
    weakSubjects: [
      { name: 'Computer Network Security', passRate: 83.2, avgAttendance: 77.5 },
    ],
    description: 'Focuses on enterprise cloud solutions, full-stack application development, devops, and information security.',
  },
  {
    id: 'dept-ece',
    code: 'ECE',
    name: 'Electronics & Communication',
    hod: 'Dr. Vikramaditya Sen',
    email: 'hod.ece@campuspulse.edu',
    totalStudents: 1680,
    facultyCount: 112,
    avgCgpa: 7.74,
    avgAttendance: 81.8,
    placementRate: 81.5,
    internshipRate: 66.4,
    atRiskCount: 62,
    avgPackageLPA: 9.4,
    highestPackageLPA: 36.0,
    totalEligibleForPlacement: 412,
    totalPlaced: 336,
    labsCount: 14,
    researchPapers: 118,
    studentFacultyRatio: 15.0,
    semesterPerformance: [
      { semester: 'Sem 1', avgCgpa: 7.90, passRate: 90.5 },
      { semester: 'Sem 2', avgCgpa: 7.82, passRate: 88.9 },
      { semester: 'Sem 3', avgCgpa: 7.65, passRate: 86.4 },
      { semester: 'Sem 4', avgCgpa: 7.60, passRate: 85.2 },
      { semester: 'Sem 5', avgCgpa: 7.72, passRate: 87.8 },
      { semester: 'Sem 6', avgCgpa: 7.81, passRate: 89.4 },
      { semester: 'Sem 7', avgCgpa: 7.92, passRate: 91.2 },
      { semester: 'Sem 8', avgCgpa: 8.04, passRate: 93.5 },
    ],
    topSubjects: [
      { name: 'VLSI System Design', passRate: 91.4, avgAttendance: 83.5 },
      { name: 'Embedded Systems & IoT', passRate: 92.0, avgAttendance: 84.1 },
    ],
    weakSubjects: [
      { name: 'Signals & Systems', passRate: 79.8, avgAttendance: 74.6 },
      { name: 'Electromagnetic Field Theory', passRate: 77.2, avgAttendance: 72.8 },
    ],
    description: 'Leading research in semiconductor chips, VLSI design, wireless communications, embedded robotics, and signal processing.',
  },
  {
    id: 'dept-eee',
    code: 'EEE',
    name: 'Electrical & Electronics Engineering',
    hod: 'Dr. Shalini Rao',
    email: 'hod.eee@campuspulse.edu',
    totalStudents: 1120,
    facultyCount: 75,
    avgCgpa: 7.46,
    avgAttendance: 79.5,
    placementRate: 73.2,
    internshipRate: 58.1,
    atRiskCount: 58,
    avgPackageLPA: 8.2,
    highestPackageLPA: 28.0,
    totalEligibleForPlacement: 276,
    totalPlaced: 202,
    labsCount: 9,
    researchPapers: 76,
    studentFacultyRatio: 14.9,
    semesterPerformance: [
      { semester: 'Sem 1', avgCgpa: 7.68, passRate: 88.2 },
      { semester: 'Sem 2', avgCgpa: 7.55, passRate: 86.5 },
      { semester: 'Sem 3', avgCgpa: 7.35, passRate: 83.2 },
      { semester: 'Sem 4', avgCgpa: 7.30, passRate: 82.0 },
      { semester: 'Sem 5', avgCgpa: 7.45, passRate: 84.9 },
      { semester: 'Sem 6', avgCgpa: 7.56, passRate: 86.8 },
      { semester: 'Sem 7', avgCgpa: 7.68, passRate: 88.5 },
      { semester: 'Sem 8', avgCgpa: 7.82, passRate: 91.0 },
    ],
    topSubjects: [
      { name: 'Renewable Energy Systems', passRate: 90.2, avgAttendance: 82.1 },
      { name: 'Power Electronics', passRate: 88.5, avgAttendance: 80.4 },
    ],
    weakSubjects: [
      { name: 'Power System Dynamics', passRate: 76.5, avgAttendance: 73.2 },
      { name: 'Control Systems', passRate: 78.0, avgAttendance: 74.0 },
    ],
    description: 'Advancing research in smart grids, electric vehicle battery technology, power systems, and industrial automation.',
  },
  {
    id: 'dept-mech',
    code: 'Mechanical',
    name: 'Mechanical Engineering',
    hod: 'Dr. Rajeshwar Kulkarni',
    email: 'hod.mech@campuspulse.edu',
    totalStudents: 1250,
    facultyCount: 84,
    avgCgpa: 7.28,
    avgAttendance: 78.9,
    placementRate: 68.4,
    internshipRate: 54.0,
    atRiskCount: 84,
    avgPackageLPA: 7.5,
    highestPackageLPA: 24.0,
    totalEligibleForPlacement: 308,
    totalPlaced: 211,
    labsCount: 12,
    researchPapers: 68,
    studentFacultyRatio: 14.8,
    semesterPerformance: [
      { semester: 'Sem 1', avgCgpa: 7.50, passRate: 86.0 },
      { semester: 'Sem 2', avgCgpa: 7.38, passRate: 84.5 },
      { semester: 'Sem 3', avgCgpa: 7.15, passRate: 80.8 },
      { semester: 'Sem 4', avgCgpa: 7.10, passRate: 79.5 },
      { semester: 'Sem 5', avgCgpa: 7.25, passRate: 82.1 },
      { semester: 'Sem 6', avgCgpa: 7.36, passRate: 84.4 },
      { semester: 'Sem 7', avgCgpa: 7.48, passRate: 86.9 },
      { semester: 'Sem 8', avgCgpa: 7.62, passRate: 89.2 },
    ],
    topSubjects: [
      { name: 'CAD/CAM & Robotics', passRate: 88.9, avgAttendance: 81.3 },
      { name: 'Additive Manufacturing', passRate: 89.5, avgAttendance: 82.0 },
    ],
    weakSubjects: [
      { name: 'Thermodynamics & Heat Transfer', passRate: 74.2, avgAttendance: 71.5 },
      { name: 'Fluid Mechanics', passRate: 75.8, avgAttendance: 72.8 },
    ],
    description: 'Expertise in mechatronics, autonomous robotics, aerospace thermal design, and sustainable automotive engineering.',
  },
  {
    id: 'dept-civil',
    code: 'Civil',
    name: 'Civil Engineering',
    hod: 'Dr. Anita Banerjee',
    email: 'hod.civil@campuspulse.edu',
    totalStudents: 856,
    facultyCount: 58,
    avgCgpa: 7.15,
    avgAttendance: 77.8,
    placementRate: 62.1,
    internshipRate: 48.6,
    atRiskCount: 71,
    avgPackageLPA: 6.8,
    highestPackageLPA: 21.0,
    totalEligibleForPlacement: 212,
    totalPlaced: 132,
    labsCount: 8,
    researchPapers: 52,
    studentFacultyRatio: 14.7,
    semesterPerformance: [
      { semester: 'Sem 1', avgCgpa: 7.42, passRate: 84.8 },
      { semester: 'Sem 2', avgCgpa: 7.26, passRate: 82.5 },
      { semester: 'Sem 3', avgCgpa: 7.02, passRate: 78.4 },
      { semester: 'Sem 4', avgCgpa: 6.98, passRate: 77.1 },
      { semester: 'Sem 5', avgCgpa: 7.12, passRate: 80.5 },
      { semester: 'Sem 6', avgCgpa: 7.22, passRate: 82.8 },
      { semester: 'Sem 7', avgCgpa: 7.35, passRate: 85.0 },
      { semester: 'Sem 8', avgCgpa: 7.50, passRate: 88.0 },
    ],
    topSubjects: [
      { name: 'GIS & Remote Sensing', passRate: 87.8, avgAttendance: 80.5 },
      { name: 'Green Building Infrastructure', passRate: 88.5, avgAttendance: 81.2 },
    ],
    weakSubjects: [
      { name: 'Structural Analysis II', passRate: 72.4, avgAttendance: 70.1 },
      { name: 'Geotechnical Engineering', passRate: 74.0, avgAttendance: 71.4 },
    ],
    description: 'Pioneering smart city infrastructure, earthquake-resistant structural analysis, BIM, and environmental water resources.',
  },
];

export const TOTAL_CAMPUS_STUDENTS = DEPARTMENTS.reduce((sum, d) => sum + d.totalStudents, 0); // 8426
export const TOTAL_CAMPUS_FACULTY = DEPARTMENTS.reduce((sum, d) => sum + d.facultyCount, 0); // 563
export const TOTAL_AT_RISK_STUDENTS = DEPARTMENTS.reduce((sum, d) => sum + d.atRiskCount, 0); // 342
export const CAMPUS_AVG_CGPA = Number(
  (DEPARTMENTS.reduce((sum, d) => sum + d.avgCgpa * d.totalStudents, 0) / TOTAL_CAMPUS_STUDENTS).toFixed(2)
); // 7.62
export const CAMPUS_AVG_ATTENDANCE = Number(
  (DEPARTMENTS.reduce((sum, d) => sum + d.avgAttendance * d.totalStudents, 0) / TOTAL_CAMPUS_STUDENTS).toFixed(1)
); // 81.4
export const CAMPUS_PLACEMENT_RATE = Number(
  (DEPARTMENTS.reduce((sum, d) => sum + d.placementRate * d.totalStudents, 0) / TOTAL_CAMPUS_STUDENTS).toFixed(1)
); // 78.6
export const CAMPUS_INTERNSHIP_RATE = Number(
  (DEPARTMENTS.reduce((sum, d) => sum + d.internshipRate * d.totalStudents, 0) / TOTAL_CAMPUS_STUDENTS).toFixed(1)
); // 64.2
