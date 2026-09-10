export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  department: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  coursesHandled: number;
  studentFeedbackRating: number; // out of 5.0
  publicationsCount: number;
  patentsGranted: number;
  status: 'Full-time' | 'Visiting Professor' | 'Emeritus';
  email: string;
}

export const FACULTY_STATS = {
  totalFaculty: 563,
  studentFacultyRatio: '15.0 : 1',
  phdPercentage: 74.2, // 74.2% hold doctoral degrees
  totalResearchPapersThisYear: 545,
  patentsGranted: 48,
  avgStudentFeedbackRating: 4.54,
  sponsoredResearchFundingCr: 18.4, // INR Crores
};

export const FACULTY_MEMBERS: FacultyMember[] = [
  {
    id: 'fac-1',
    name: 'Dr. Aris Thorne',
    title: 'Professor & Head of Department',
    department: 'CSE',
    specialization: 'Distributed Systems & Cloud Architecture',
    qualification: 'Ph.D. Computer Science, Stanford Univ',
    experienceYears: 18,
    coursesHandled: 3,
    studentFeedbackRating: 4.88,
    publicationsCount: 38,
    patentsGranted: 6,
    status: 'Full-time',
    email: 'hod.cse@campuspulse.edu',
  },
  {
    id: 'fac-2',
    name: 'Dr. Meera Nambiar',
    title: 'Professor & Head of Department',
    department: 'IT',
    specialization: 'Enterprise Software & Cloud Security',
    qualification: 'Ph.D. Information Tech, IISc Bangalore',
    experienceYears: 16,
    coursesHandled: 3,
    studentFeedbackRating: 4.79,
    publicationsCount: 26,
    patentsGranted: 3,
    status: 'Full-time',
    email: 'hod.it@campuspulse.edu',
  },
  {
    id: 'fac-3',
    name: 'Dr. Vikramaditya Sen',
    title: 'Professor & Head of Department',
    department: 'ECE',
    specialization: 'VLSI Nanoelectronics & RF Systems',
    qualification: 'Ph.D. Microelectronics, IIT Madras',
    experienceYears: 21,
    coursesHandled: 2,
    studentFeedbackRating: 4.72,
    publicationsCount: 44,
    patentsGranted: 8,
    status: 'Full-time',
    email: 'hod.ece@campuspulse.edu',
  },
  {
    id: 'fac-4',
    name: 'Dr. Shalini Rao',
    title: 'Professor & Head of Department',
    department: 'EEE',
    specialization: 'Smart Grid Power Systems & Renewables',
    qualification: 'Ph.D. Electrical Engg, IIT Bombay',
    experienceYears: 17,
    coursesHandled: 3,
    studentFeedbackRating: 4.65,
    publicationsCount: 31,
    patentsGranted: 4,
    status: 'Full-time',
    email: 'hod.eee@campuspulse.edu',
  },
  {
    id: 'fac-5',
    name: 'Dr. Rajeshwar Kulkarni',
    title: 'Professor & Head of Department',
    department: 'Mechanical',
    specialization: 'Autonomous Robotics & Mechatronics',
    qualification: 'Ph.D. Robotics, Purdue Univ',
    experienceYears: 19,
    coursesHandled: 2,
    studentFeedbackRating: 4.68,
    publicationsCount: 29,
    patentsGranted: 5,
    status: 'Full-time',
    email: 'hod.mech@campuspulse.edu',
  },
  {
    id: 'fac-6',
    name: 'Dr. Anita Banerjee',
    title: 'Professor & Head of Department',
    department: 'Civil',
    specialization: 'Smart Cities, BIM & Earthquake Resilience',
    qualification: 'Ph.D. Structural Engg, IIT Kharagpur',
    experienceYears: 22,
    coursesHandled: 3,
    studentFeedbackRating: 4.70,
    publicationsCount: 34,
    patentsGranted: 4,
    status: 'Full-time',
    email: 'hod.civil@campuspulse.edu',
  },
  {
    id: 'fac-7',
    name: 'Prof. Anirban Das',
    title: 'Associate Professor',
    department: 'CSE',
    specialization: 'Deep Learning & Natural Language Processing',
    qualification: 'Ph.D. Artificial Intelligence, IIT Delhi',
    experienceYears: 11,
    coursesHandled: 4,
    studentFeedbackRating: 4.82,
    publicationsCount: 22,
    patentsGranted: 2,
    status: 'Full-time',
    email: 'anirban.das@campuspulse.edu',
  },
  {
    id: 'fac-8',
    name: 'Prof. Preeti Vasudev',
    title: 'Assistant Professor',
    department: 'ECE',
    specialization: 'Embedded IoT & Automotive Protocols',
    qualification: 'M.Tech, Ph.D. (Pursuing) BITS Pilani',
    experienceYears: 7,
    coursesHandled: 3,
    studentFeedbackRating: 4.61,
    publicationsCount: 9,
    patentsGranted: 1,
    status: 'Full-time',
    email: 'preeti.v@campuspulse.edu',
  },
];
