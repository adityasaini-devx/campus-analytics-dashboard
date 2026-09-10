export type RiskTier = 'Low' | 'Medium' | 'High';
export type PlacementStatus = 'Placed' | 'In Process' | 'Eligible' | 'Not Eligible' | 'Higher Studies';
export type InternshipStatus = 'Completed' | 'Ongoing' | 'None';

export interface SubjectAttendance {
  subject: string;
  code: string;
  attended: number;
  total: number;
  percentage: number;
}

export interface SemesterCGPA {
  semester: string;
  cgpa: number;
  credits: number;
}

export interface RiskFactor {
  factor: string;
  category: 'Attendance' | 'Academic Trend' | 'Backlogs' | 'Engagement';
  weight: number; // e.g. 0.30 for attendance
  score: number;  // 0-100 subscore
  impact: 'High' | 'Moderate' | 'Low';
  detail: string;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  department: string;
  semester: number;
  cgpa: number;
  attendance: number;
  credits: number;
  backlogs: number;
  placementStatus: PlacementStatus;
  companyPlaced?: string;
  packageLPA?: number;
  internshipStatus: InternshipStatus;
  internshipCompany?: string;
  skills: string[];
  riskTier: RiskTier;
  riskScore: number; // 0-100
  riskFactors: RiskFactor[];
  recommendedInterventions: string[];
  mentor: string;
  avatarSeed: string;
}

// Generate realistic students across departments and semesters
export const STUDENTS: Student[] = [
  {
    id: 'stu-101',
    rollNo: '21CS101',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@campuspulse.edu',
    department: 'CSE',
    semester: 8,
    cgpa: 9.35,
    attendance: 92.4,
    credits: 168,
    backlogs: 0,
    placementStatus: 'Placed',
    companyPlaced: 'Google Cloud',
    packageLPA: 44.5,
    internshipStatus: 'Completed',
    internshipCompany: 'Google India',
    skills: ['Go', 'Kubernetes', 'Distributed Systems', 'Python', 'React'],
    riskTier: 'Low',
    riskScore: 8,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 95, impact: 'Low', detail: 'Consistent 92%+ attendance' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 96, impact: 'Low', detail: 'Steady 9.0+ CGPA progression' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 100, impact: 'Low', detail: 'Zero active or historical backlogs' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 90, impact: 'Low', detail: 'Hackathon finalist and active open source contributor' }
    ],
    recommendedInterventions: ['Nominate for Department Valedictorian', 'Peer Mentor Lead'],
    mentor: 'Dr. Aris Thorne',
    avatarSeed: 'Aarav',
  },
  {
    id: 'stu-102',
    rollNo: '21CS142',
    name: 'Priya Iyer',
    email: 'priya.iyer@campuspulse.edu',
    department: 'CSE',
    semester: 8,
    cgpa: 8.84,
    attendance: 88.0,
    credits: 164,
    backlogs: 0,
    placementStatus: 'Placed',
    companyPlaced: 'Microsoft IDC',
    packageLPA: 38.0,
    internshipStatus: 'Completed',
    internshipCompany: 'Microsoft',
    skills: ['C++', 'Algorithms', 'Azure', 'Machine Learning', 'TypeScript'],
    riskTier: 'Low',
    riskScore: 12,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 88, impact: 'Low', detail: 'Above department standard' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 90, impact: 'Low', detail: 'Stable top-decile performance' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 100, impact: 'Low', detail: 'Zero backlogs' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 85, impact: 'Low', detail: 'Women in Tech chapter lead' }
    ],
    recommendedInterventions: ['Research track mentorship', 'Alumni speaker panelist'],
    mentor: 'Dr. Aris Thorne',
    avatarSeed: 'Priya',
  },
  {
    id: 'stu-103',
    rollNo: '22CS215',
    name: 'Rohan Deshmukh',
    email: 'rohan.deshmukh@campuspulse.edu',
    department: 'CSE',
    semester: 6,
    cgpa: 6.42,
    attendance: 63.8,
    credits: 110,
    backlogs: 2,
    placementStatus: 'Not Eligible',
    internshipStatus: 'None',
    skills: ['Java', 'SQL', 'HTML/CSS'],
    riskTier: 'High',
    riskScore: 78,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 32, impact: 'High', detail: 'Attendance 63.8% (below statutory 75% cutoff)' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 38, impact: 'High', detail: 'CGPA dropped from 7.20 to 6.42 over 3 semesters' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 25, impact: 'High', detail: '2 active backlogs: Theory of Computation, OS' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 20, impact: 'Moderate', detail: 'Zero club participations or technical events logged' }
    ],
    recommendedInterventions: ['Mandatory academic counseling', 'Special makeup remedial sessions', 'Parent-Teacher conference scheduled'],
    mentor: 'Prof. Ramesh Gupta',
    avatarSeed: 'Rohan',
  },
  {
    id: 'stu-104',
    rollNo: '22IT108',
    name: 'Ananya Verma',
    email: 'ananya.verma@campuspulse.edu',
    department: 'IT',
    semester: 6,
    cgpa: 8.52,
    attendance: 86.5,
    credits: 122,
    backlogs: 0,
    placementStatus: 'Eligible',
    internshipStatus: 'Completed',
    internshipCompany: 'Amazon Web Services',
    skills: ['Python', 'AWS', 'Docker', 'React', 'GraphQL'],
    riskTier: 'Low',
    riskScore: 14,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 86, impact: 'Low', detail: 'Healthy attendance records' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 88, impact: 'Low', detail: 'Consistent 8.5+ CGPA' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 100, impact: 'Low', detail: 'No backlogs' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 82, impact: 'Low', detail: 'AWS student ambassador' }
    ],
    recommendedInterventions: ['Fast-track placement drive registration'],
    mentor: 'Dr. Meera Nambiar',
    avatarSeed: 'Ananya',
  },
  {
    id: 'stu-105',
    rollNo: '22IT144',
    name: 'Devansh Kothari',
    email: 'devansh.k@campuspulse.edu',
    department: 'IT',
    semester: 6,
    cgpa: 7.15,
    attendance: 72.1,
    credits: 114,
    backlogs: 1,
    placementStatus: 'In Process',
    internshipStatus: 'Ongoing',
    internshipCompany: 'FinTech Startup',
    skills: ['Node.js', 'Express', 'MongoDB', 'JavaScript'],
    riskTier: 'Medium',
    riskScore: 54,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 58, impact: 'Moderate', detail: '72.1% is below minimum 75% exam requirement' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 62, impact: 'Moderate', detail: 'Fluctuating between 6.9 and 7.3' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 50, impact: 'Moderate', detail: '1 backlog in Computer Networks' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 70, impact: 'Low', detail: 'Participating in startup internship' }
    ],
    recommendedInterventions: ['Attendance condonation review', 'Targeted weekend tutoring on Networks'],
    mentor: 'Dr. Meera Nambiar',
    avatarSeed: 'Devansh',
  },
  {
    id: 'stu-106',
    rollNo: '21EC112',
    name: 'Siddharth Nair',
    email: 'siddharth.n@campuspulse.edu',
    department: 'ECE',
    semester: 8,
    cgpa: 8.65,
    attendance: 87.2,
    credits: 162,
    backlogs: 0,
    placementStatus: 'Placed',
    companyPlaced: 'Texas Instruments',
    packageLPA: 24.5,
    internshipStatus: 'Completed',
    internshipCompany: 'Qualcomm',
    skills: ['Verilog', 'VLSI', 'MATLAB', 'C', 'Embedded C'],
    riskTier: 'Low',
    riskScore: 16,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 87, impact: 'Low', detail: 'Strong attendance' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 86, impact: 'Low', detail: 'Positive trajectory' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 100, impact: 'Low', detail: 'Clean record' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 78, impact: 'Low', detail: 'IEEE Student Branch Officer' }
    ],
    recommendedInterventions: ['Encourage IEEE conference paper publication'],
    mentor: 'Dr. Vikramaditya Sen',
    avatarSeed: 'Siddharth',
  },
  {
    id: 'stu-107',
    rollNo: '22EC201',
    name: 'Kavya Sunder',
    email: 'kavya.s@campuspulse.edu',
    department: 'ECE',
    semester: 6,
    cgpa: 6.22,
    attendance: 61.4,
    credits: 106,
    backlogs: 3,
    placementStatus: 'Not Eligible',
    internshipStatus: 'None',
    skills: ['C', 'Basic Electronics', 'Circuit Simulation'],
    riskTier: 'High',
    riskScore: 84,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 26, impact: 'High', detail: 'Critical attendance deficit: 61.4%' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 32, impact: 'High', detail: 'Continuous decline over 4 semesters' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 10, impact: 'High', detail: '3 active backlogs: Signals, EM Fields, Analog IC' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 15, impact: 'High', detail: 'Zero extracurricular participation' }
    ],
    recommendedInterventions: ['Direct HOD consultation', 'Assign 1-on-1 faculty tutor', 'Academic probation notice sent'],
    mentor: 'Dr. Vikramaditya Sen',
    avatarSeed: 'Kavya',
  },
  {
    id: 'stu-108',
    rollNo: '22EE104',
    name: 'Vikram Joshi',
    email: 'vikram.j@campuspulse.edu',
    department: 'EEE',
    semester: 6,
    cgpa: 7.68,
    attendance: 82.5,
    credits: 120,
    backlogs: 0,
    placementStatus: 'Eligible',
    internshipStatus: 'Completed',
    internshipCompany: 'ABB Power Grids',
    skills: ['MATLAB/Simulink', 'Power Electronics', 'PLC/SCADA', 'Python'],
    riskTier: 'Low',
    riskScore: 22,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 82, impact: 'Low', detail: 'Consistent attendance' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 78, impact: 'Low', detail: 'Upward trend in core electrical labs' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 100, impact: 'Low', detail: 'No backlogs' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 72, impact: 'Low', detail: 'Robotics club electrical lead' }
    ],
    recommendedInterventions: ['Core engineering drive preparation'],
    mentor: 'Dr. Shalini Rao',
    avatarSeed: 'Vikram',
  },
  {
    id: 'stu-109',
    rollNo: '23EE145',
    name: 'Tanvi Patel',
    email: 'tanvi.p@campuspulse.edu',
    department: 'EEE',
    semester: 4,
    cgpa: 6.84,
    attendance: 73.0,
    credits: 76,
    backlogs: 1,
    placementStatus: 'In Process',
    internshipStatus: 'None',
    skills: ['Circuit Analysis', 'C++', 'Arduino'],
    riskTier: 'Medium',
    riskScore: 48,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 62, impact: 'Moderate', detail: 'Borderline attendance (73.0%)' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 60, impact: 'Moderate', detail: 'Dipped slightly in Sem 3 math' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 55, impact: 'Moderate', detail: '1 backlog in Power Systems I' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 50, impact: 'Moderate', detail: 'Moderate engagement' }
    ],
    recommendedInterventions: ['Remedial sessions in Power Systems', 'Attendance warning notice'],
    mentor: 'Dr. Shalini Rao',
    avatarSeed: 'Tanvi',
  },
  {
    id: 'stu-110',
    rollNo: '21ME102',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@campuspulse.edu',
    department: 'Mechanical',
    semester: 8,
    cgpa: 8.42,
    attendance: 84.1,
    credits: 160,
    backlogs: 0,
    placementStatus: 'Placed',
    companyPlaced: 'Tata Motors',
    packageLPA: 14.2,
    internshipStatus: 'Completed',
    internshipCompany: 'Mahindra EV Tech',
    skills: ['SolidWorks', 'ANSYS', 'AutoCAD', 'Python', 'Mechatronics'],
    riskTier: 'Low',
    riskScore: 18,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 84, impact: 'Low', detail: 'Steady lab attendance' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 84, impact: 'Low', detail: 'Strong final year performance' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 100, impact: 'Low', detail: 'Zero backlogs' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 88, impact: 'Low', detail: 'SAE Baja Team Captain' }
    ],
    recommendedInterventions: ['Automotive design project lead'],
    mentor: 'Dr. Rajeshwar Kulkarni',
    avatarSeed: 'Arjun',
  },
  {
    id: 'stu-111',
    rollNo: '22ME205',
    name: 'Kunal Choudhury',
    email: 'kunal.c@campuspulse.edu',
    department: 'Mechanical',
    semester: 6,
    cgpa: 5.92,
    attendance: 58.5,
    credits: 98,
    backlogs: 3,
    placementStatus: 'Not Eligible',
    internshipStatus: 'None',
    skills: ['Basic CAD', 'Manufacturing Processes'],
    riskTier: 'High',
    riskScore: 88,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 20, impact: 'High', detail: 'Severely deficient: 58.5% attendance' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 28, impact: 'High', detail: 'Sub-6.0 CGPA warning threshold breached' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 12, impact: 'High', detail: '3 backlogs: Heat Transfer, Kinematics, Math III' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 10, impact: 'High', detail: 'Unengaged in campus activities' }
    ],
    recommendedInterventions: ['De-registration warning issued', 'Mandatory daily attendance check-in with HOD', 'Immediate parent counselor conference'],
    mentor: 'Dr. Rajeshwar Kulkarni',
    avatarSeed: 'Kunal',
  },
  {
    id: 'stu-112',
    rollNo: '21CE104',
    name: 'Sneha Mukherjee',
    email: 'sneha.m@campuspulse.edu',
    department: 'Civil',
    semester: 8,
    cgpa: 8.20,
    attendance: 85.0,
    credits: 160,
    backlogs: 0,
    placementStatus: 'Placed',
    companyPlaced: 'Larsen & Toubro ECC',
    packageLPA: 11.5,
    internshipStatus: 'Completed',
    internshipCompany: 'L&T Infrastructure',
    skills: ['STAAD Pro', 'Revit BIM', 'ArcGIS', 'AutoCAD', 'Structural Health'],
    riskTier: 'Low',
    riskScore: 20,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 85, impact: 'Low', detail: 'Good attendance across field work' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 82, impact: 'Low', detail: 'Consistent high marks in Structural Design' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 100, impact: 'Low', detail: 'Clear academic record' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 75, impact: 'Low', detail: 'Civil Engineering Society Treasurer' }
    ],
    recommendedInterventions: ['Chartered Engineer trainee sponsorship'],
    mentor: 'Dr. Anita Banerjee',
    avatarSeed: 'Sneha',
  },
  {
    id: 'stu-113',
    rollNo: '22CE130',
    name: 'Aditya Reddy',
    email: 'aditya.reddy@campuspulse.edu',
    department: 'Civil',
    semester: 6,
    cgpa: 6.30,
    attendance: 66.2,
    credits: 104,
    backlogs: 2,
    placementStatus: 'Not Eligible',
    internshipStatus: 'None',
    skills: ['Surveying', 'AutoCAD Civil 3D'],
    riskTier: 'High',
    riskScore: 76,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 38, impact: 'High', detail: '66.2% attendance in core geotechnical labs' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 40, impact: 'High', detail: 'Declined from 7.10 in Sem 2 to 6.30' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 28, impact: 'High', detail: '2 backlogs in Structural Analysis II, Soil Mechanics' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 30, impact: 'Moderate', detail: 'Minimal club participation' }
    ],
    recommendedInterventions: ['Geotechnical remedial lab', 'Weekly progress reporting to academic dean'],
    mentor: 'Dr. Anita Banerjee',
    avatarSeed: 'Aditya',
  },
  {
    id: 'stu-114',
    rollNo: '23CS189',
    name: 'Ishaan Bhatia',
    email: 'ishaan.b@campuspulse.edu',
    department: 'CSE',
    semester: 4,
    cgpa: 8.92,
    attendance: 94.1,
    credits: 82,
    backlogs: 0,
    placementStatus: 'Eligible',
    internshipStatus: 'Ongoing',
    internshipCompany: 'Swiggy Tech',
    skills: ['TypeScript', 'Rust', 'Next.js', 'PostgreSQL', 'Docker'],
    riskTier: 'Low',
    riskScore: 10,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 94, impact: 'Low', detail: 'Top percentile attendance' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 92, impact: 'Low', detail: 'Nearly perfect scores in Operating Systems' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 100, impact: 'Low', detail: 'Zero backlogs' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 94, impact: 'Low', detail: 'Smart India Hackathon 1st Prize Winner' }
    ],
    recommendedInterventions: ['Fast-track research grant application'],
    mentor: 'Dr. Aris Thorne',
    avatarSeed: 'Ishaan',
  },
  {
    id: 'stu-115',
    rollNo: '23IT122',
    name: 'Meghna Kapoor',
    email: 'meghna.k@campuspulse.edu',
    department: 'IT',
    semester: 4,
    cgpa: 7.45,
    attendance: 74.5,
    credits: 78,
    backlogs: 1,
    placementStatus: 'In Process',
    internshipStatus: 'None',
    skills: ['Python', 'Django', 'MySQL', 'Git'],
    riskTier: 'Medium',
    riskScore: 51,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 64, impact: 'Moderate', detail: 'Borderline 74.5% (just below 75% bar)' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 65, impact: 'Moderate', detail: 'Moderate 7.45 CGPA' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 55, impact: 'Moderate', detail: '1 backlog in Discrete Mathematics' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 55, impact: 'Moderate', detail: 'Active in coding club' }
    ],
    recommendedInterventions: ['Math tutoring support', 'Attendance threshold monitoring'],
    mentor: 'Dr. Meera Nambiar',
    avatarSeed: 'Meghna',
  },
  {
    id: 'stu-116',
    rollNo: '23EC150',
    name: 'Rahul Sen',
    email: 'rahul.sen@campuspulse.edu',
    department: 'ECE',
    semester: 4,
    cgpa: 7.82,
    attendance: 83.4,
    credits: 80,
    backlogs: 0,
    placementStatus: 'Eligible',
    internshipStatus: 'Completed',
    internshipCompany: 'NXP Semiconductors',
    skills: ['Embedded C', 'RTOS', 'ARM Cortex', 'Python'],
    riskTier: 'Low',
    riskScore: 21,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 83, impact: 'Low', detail: 'Consistent attendance' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 80, impact: 'Low', detail: 'Solid microcontrollers performance' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 100, impact: 'Low', detail: 'No backlogs' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 70, impact: 'Low', detail: 'Hardware club member' }
    ],
    recommendedInterventions: ['VLSI advanced certification support'],
    mentor: 'Dr. Vikramaditya Sen',
    avatarSeed: 'RahulS',
  },
  {
    id: 'stu-117',
    rollNo: '24CS012',
    name: 'Zara Alvi',
    email: 'zara.alvi@campuspulse.edu',
    department: 'CSE',
    semester: 2,
    cgpa: 9.10,
    attendance: 96.0,
    credits: 42,
    backlogs: 0,
    placementStatus: 'Eligible',
    internshipStatus: 'None',
    skills: ['C', 'Python', 'Data Structures', 'Linux'],
    riskTier: 'Low',
    riskScore: 7,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 98, impact: 'Low', detail: 'Outstanding 96% first year attendance' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 95, impact: 'Low', detail: 'Ranked 1st in freshman batch' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 100, impact: 'Low', detail: 'Zero backlogs' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 88, impact: 'Low', detail: 'Freshman hackathon winner' }
    ],
    recommendedInterventions: ['Honors program invitation', 'Undergraduate research fellow nominee'],
    mentor: 'Dr. Aris Thorne',
    avatarSeed: 'Zara',
  },
  {
    id: 'stu-118',
    rollNo: '24ME045',
    name: 'Nikhil Rathi',
    email: 'nikhil.r@campuspulse.edu',
    department: 'Mechanical',
    semester: 2,
    cgpa: 6.50,
    attendance: 68.0,
    credits: 38,
    backlogs: 1,
    placementStatus: 'In Process',
    internshipStatus: 'None',
    skills: ['Engineering Graphics', 'Python'],
    riskTier: 'Medium',
    riskScore: 58,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 50, impact: 'Moderate', detail: '68% attendance in Engineering Mechanics' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 55, impact: 'Moderate', detail: 'Struggling with calculus transition' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 60, impact: 'Moderate', detail: '1 backlog in Engineering Mathematics I' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 40, impact: 'Moderate', detail: 'Low engagement' }
    ],
    recommendedInterventions: ['Freshman academic advisor check-in', 'Math remedial workshop'],
    mentor: 'Dr. Rajeshwar Kulkarni',
    avatarSeed: 'Nikhil',
  },
  {
    id: 'stu-119',
    rollNo: '21EE109',
    name: 'Divya Nair',
    email: 'divya.n@campuspulse.edu',
    department: 'EEE',
    semester: 8,
    cgpa: 8.15,
    attendance: 86.4,
    credits: 162,
    backlogs: 0,
    placementStatus: 'Placed',
    companyPlaced: 'Schneider Electric',
    packageLPA: 12.0,
    internshipStatus: 'Completed',
    internshipCompany: 'Siemens Energy',
    skills: ['Smart Grid', 'Power Systems', 'PLC', 'Python', 'SCADA'],
    riskTier: 'Low',
    riskScore: 19,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 86, impact: 'Low', detail: 'Consistent attendance' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 82, impact: 'Low', detail: 'Strong capstone project in Smart Microgrids' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 100, impact: 'Low', detail: 'Zero backlogs' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 76, impact: 'Low', detail: 'Green campus initiative student chair' }
    ],
    recommendedInterventions: ['Capstone excellence showcase'],
    mentor: 'Dr. Shalini Rao',
    avatarSeed: 'Divya',
  },
  {
    id: 'stu-120',
    rollNo: '22CE155',
    name: 'Harsh Vardhan',
    email: 'harsh.v@campuspulse.edu',
    department: 'Civil',
    semester: 6,
    cgpa: 5.80,
    attendance: 55.4,
    credits: 96,
    backlogs: 4,
    placementStatus: 'Not Eligible',
    internshipStatus: 'None',
    skills: ['AutoCAD', 'Surveying Basics'],
    riskTier: 'High',
    riskScore: 92,
    riskFactors: [
      { factor: 'Attendance', category: 'Attendance', weight: 0.30, score: 15, impact: 'High', detail: 'Severe chronic absenteeism: 55.4%' },
      { factor: 'Academic Trend', category: 'Academic Trend', weight: 0.35, score: 20, impact: 'High', detail: 'Sub-6.0 CGPA with recurring subject backlogs' },
      { factor: 'Backlogs', category: 'Backlogs', weight: 0.20, score: 5, impact: 'High', detail: '4 active backlogs: Fluid Mech, Structures, Surveying II, Math' },
      { factor: 'Campus Engagement', category: 'Engagement', weight: 0.15, score: 10, impact: 'High', detail: 'Disengaged' }
    ],
    recommendedInterventions: ['Immediate suspension hearing or mandatory medical review', 'Intensive academic recovery plan with Dean'],
    mentor: 'Dr. Anita Banerjee',
    avatarSeed: 'Harsh',
  }
];

// Helper to get semester progression history for a student
export function getStudentSemesterHistory(student: Student): SemesterCGPA[] {
  const currentSem = student.semester;
  const history: SemesterCGPA[] = [];
  const baseCgpa = student.cgpa;

  for (let s = 1; s <= currentSem; s++) {
    // Generate realistic historical curve leading up to current cgpa
    let semCgpa: number;
    if (student.riskTier === 'High') {
      // Declining trend
      semCgpa = Number((baseCgpa + (currentSem - s) * 0.32).toFixed(2));
    } else if (student.riskTier === 'Low') {
      // Improving trend
      semCgpa = Number((baseCgpa - (currentSem - s) * 0.14).toFixed(2));
    } else {
      // Fluctuation
      semCgpa = Number((baseCgpa + ((s % 2 === 0 ? 0.2 : -0.15))).toFixed(2));
    }
    // clamp between 4.0 and 10.0
    semCgpa = Math.max(4.0, Math.min(10.0, semCgpa));
    history.push({
      semester: `Sem ${s}`,
      cgpa: semCgpa,
      credits: s * 22,
    });
  }
  return history;
}

// Helper to get subject attendance breakdown
export function getStudentSubjectAttendance(student: Student): SubjectAttendance[] {
  const subjectsByDept: Record<string, string[]> = {
    CSE: ['Algorithms & Complexity', 'Operating Systems', 'Database Systems', 'Computer Networks', 'Machine Learning Lab'],
    IT: ['Cloud Computing', 'Web Security', 'Database Design', 'Software Engineering', 'Full Stack Lab'],
    ECE: ['VLSI Design', 'Digital Signal Processing', 'Embedded Microcontrollers', 'Analog Electronics', 'Communication Lab'],
    EEE: ['Power Systems Analysis', 'Control Systems', 'Power Electronics', 'Electrical Machines', 'Renewable Energy Lab'],
    Mechanical: ['Thermodynamics II', 'CAD/CAM Robotics', 'Fluid Mechanics', 'Machine Design', 'Thermal Engineering Lab'],
    Civil: ['Structural Analysis II', 'Geotechnical Engineering', 'BIM Architecture', 'Hydrology & Water Resources', 'Concrete Tech Lab'],
  };

  const subjects = subjectsByDept[student.department] || subjectsByDept['CSE'];
  const overallAtt = student.attendance;

  return subjects.map((sub, idx) => {
    // slight variation around overall attendance
    const variance = (idx % 2 === 0 ? 1 : -1) * (idx * 2.8);
    let pct = Number((overallAtt + variance).toFixed(1));
    pct = Math.max(40, Math.min(99, pct));
    const total = 45;
    const attended = Math.round((pct / 100) * total);
    return {
      subject: sub,
      code: `${student.department.slice(0, 2)}${300 + idx * 10}`,
      attended,
      total,
      percentage: Number(((attended / total) * 100).toFixed(1)),
    };
  });
}
