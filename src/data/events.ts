export interface CampusEvent {
  id: string;
  title: string;
  category: 'Hackathon' | 'Workshop' | 'Cultural' | 'Technical' | 'Sports' | 'Conference';
  date: string;
  organizer: string;
  attendees: number;
  status: 'Completed' | 'Upcoming';
  impactRating: number; // out of 5.0
  budgetINR: number;
}

export interface ClubLeaderboard {
  name: string;
  category: string;
  activeMembers: number;
  eventsOrganized: number;
  president: string;
  rating: number;
}

export const CAMPUS_EVENTS: CampusEvent[] = [
  {
    id: 'evt-1',
    title: 'HackCampus 2026: 36-Hr Pan-India Hackathon',
    category: 'Hackathon',
    date: 'Feb 14–16, 2026',
    organizer: 'CSE & IT Student Developer Club',
    attendees: 1240,
    status: 'Completed',
    impactRating: 4.9,
    budgetINR: 850000,
  },
  {
    id: 'evt-2',
    title: 'National AI & Autonomous Robotics Summit',
    category: 'Conference',
    date: 'Jan 22–24, 2026',
    organizer: 'ECE & Robotics Research Cell',
    attendees: 860,
    status: 'Completed',
    impactRating: 4.8,
    budgetINR: 620000,
  },
  {
    id: 'evt-3',
    title: 'Smart Cities & Green Infrastructure Expo',
    category: 'Technical',
    date: 'Dec 05, 2025',
    organizer: 'Civil & Environmental Society',
    attendees: 580,
    status: 'Completed',
    impactRating: 4.6,
    budgetINR: 310000,
  },
  {
    id: 'evt-4',
    title: 'EV Powertrain & Battery Systems Workshop',
    category: 'Workshop',
    date: 'Nov 18, 2025',
    organizer: 'SAE Collegiate Club & Mech Dept',
    attendees: 420,
    status: 'Completed',
    impactRating: 4.7,
    budgetINR: 190000,
  },
  {
    id: 'evt-5',
    title: 'Milan 2026: Annual Inter-Collegiate Cultural Fest',
    category: 'Cultural',
    date: 'Mar 28–30, 2026',
    organizer: 'Student Affairs Council',
    attendees: 4500,
    status: 'Upcoming',
    impactRating: 4.9,
    budgetINR: 2400000,
  },
  {
    id: 'evt-6',
    title: 'AWS Cloud Practitioner Bootcamp',
    category: 'Workshop',
    date: 'Oct 12–14, 2025',
    organizer: 'Campus Tech Cell',
    attendees: 650,
    status: 'Completed',
    impactRating: 4.8,
    budgetINR: 220000,
  },
];

export const CLUBS_LEADERBOARD: ClubLeaderboard[] = [
  { name: 'Google Developer Student Club (GDSC)', category: 'Technology', activeMembers: 640, eventsOrganized: 14, president: 'Aarav Sharma', rating: 4.9 },
  { name: 'SAE Collegiate Chapter (Automotive)', category: 'Engineering', activeMembers: 320, eventsOrganized: 8, president: 'Arjun Mehta', rating: 4.8 },
  { name: 'IEEE Student Chapter', category: 'Technical/Research', activeMembers: 480, eventsOrganized: 11, president: 'Siddharth Nair', rating: 4.7 },
  { name: 'Robotics & Automation Society (RAS)', category: 'Robotics', activeMembers: 290, eventsOrganized: 7, president: 'Vikram Joshi', rating: 4.8 },
  { name: 'Rotaract Youth Club', category: 'Community Service', activeMembers: 410, eventsOrganized: 9, president: 'Kavya Sunder', rating: 4.6 },
  { name: 'Campus Literary & Debating Society', category: 'Culture & Arts', activeMembers: 210, eventsOrganized: 6, president: 'Zara Alvi', rating: 4.5 },
];

export const EVENT_CATEGORY_DISTRIBUTION = [
  { name: 'Technical & Coding', count: 28, percentage: 35.0, color: '#6366f1' },
  { name: 'Workshops & Certifications', count: 22, percentage: 27.5, color: '#0ea5e9' },
  { name: 'Hackathons & Competitions', count: 12, percentage: 15.0, color: '#10b981' },
  { name: 'Cultural & Arts', count: 10, percentage: 12.5, color: '#f59e0b' },
  { name: 'Sports & Wellness', count: 8, percentage: 10.0, color: '#ec4899' },
];

export const DEPARTMENT_ENGAGEMENT_RATES = [
  { dept: 'CSE', participationRate: 88.5, totalEventsWon: 42 },
  { dept: 'IT', participationRate: 84.0, totalEventsWon: 31 },
  { dept: 'ECE', participationRate: 79.2, totalEventsWon: 28 },
  { dept: 'EEE', participationRate: 72.4, totalEventsWon: 19 },
  { dept: 'Mechanical', participationRate: 76.8, totalEventsWon: 24 },
  { dept: 'Civil', participationRate: 68.5, totalEventsWon: 14 },
];
