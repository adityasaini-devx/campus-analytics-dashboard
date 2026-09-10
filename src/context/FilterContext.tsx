import React, { createContext, useContext, useMemo, useState } from 'react';
import { DEPARTMENTS, type Department } from '../data/departments';
import { STUDENTS, type Student } from '../data/students';
import { generateCampusInsights, type CampusInsight } from '../data/insightEngine';

export type AcademicYear = '2025–26' | '2024–25' | '2023–24';
export type SemesterFilter = 'All' | 'Sem 1' | 'Sem 2' | 'Sem 3' | 'Sem 4' | 'Sem 5' | 'Sem 6' | 'Sem 7' | 'Sem 8' | 'Odd Sems' | 'Even Sems';
export type DepartmentFilter = 'All' | 'CSE' | 'IT' | 'ECE' | 'EEE' | 'Mechanical' | 'Civil';

export interface CalculatedKPIs {
  totalStudents: number;
  avgAttendance: number;
  avgCgpa: number;
  placementRate: number;
  internshipRate: number;
  atRiskCount: number;
  totalFaculty: number;
  avgPackageLPA: number;
  highestPackageLPA: number;
  // Percentage trends vs previous period
  trends: {
    studentsDelta: number;
    attendanceDelta: number;
    cgpaDelta: number;
    placementDelta: number;
    internshipDelta: number;
    riskDelta: number;
  };
}

interface FilterContextType {
  academicYear: AcademicYear;
  semester: SemesterFilter;
  department: DepartmentFilter;
  searchQuery: string;
  setAcademicYear: (year: AcademicYear) => void;
  setSemester: (sem: SemesterFilter) => void;
  setDepartment: (dept: DepartmentFilter) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  filteredDepartments: Department[];
  filteredStudents: Student[];
  kpis: CalculatedKPIs;
  insights: CampusInsight[];
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [academicYear, setAcademicYear] = useState<AcademicYear>('2025–26');
  const [semester, setSemester] = useState<SemesterFilter>('All');
  const [department, setDepartment] = useState<DepartmentFilter>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const resetFilters = () => {
    setAcademicYear('2025–26');
    setSemester('All');
    setDepartment('All');
    setSearchQuery('');
  };

  // Filter departments
  const filteredDepartments = useMemo(() => {
    if (department === 'All') return DEPARTMENTS;
    return DEPARTMENTS.filter(d => d.code === department);
  }, [department]);

  // Filter students based on dept, semester, and search query
  const filteredStudents = useMemo(() => {
    return STUDENTS.filter(student => {
      // Dept match
      if (department !== 'All' && student.department !== department) return false;

      // Semester match
      if (semester !== 'All') {
        if (semester === 'Odd Sems' && student.semester % 2 === 0) return false;
        if (semester === 'Even Sems' && student.semester % 2 !== 0) return false;
        if (semester.startsWith('Sem ') && student.semester !== parseInt(semester.replace('Sem ', ''))) return false;
      }

      // Search query match
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = student.name.toLowerCase().includes(q);
        const matchRoll = student.rollNo.toLowerCase().includes(q);
        const matchDept = student.department.toLowerCase().includes(q);
        const matchSkills = student.skills.some(s => s.toLowerCase().includes(q));
        if (!matchName && !matchRoll && !matchDept && !matchSkills) return false;
      }

      return true;
    });
  }, [department, semester, searchQuery]);

  // Calculate dynamic KPIs mathematically from the active department scope
  const kpis: CalculatedKPIs = useMemo(() => {
    const depts = filteredDepartments;
    const totalStudents = depts.reduce((sum, d) => sum + d.totalStudents, 0);
    const totalFaculty = depts.reduce((sum, d) => sum + d.facultyCount, 0);
    const atRiskCount = depts.reduce((sum, d) => sum + d.atRiskCount, 0);

    if (totalStudents === 0) {
      return {
        totalStudents: 0,
        avgAttendance: 0,
        avgCgpa: 0,
        placementRate: 0,
        internshipRate: 0,
        atRiskCount: 0,
        totalFaculty: 0,
        avgPackageLPA: 0,
        highestPackageLPA: 0,
        trends: { studentsDelta: 0, attendanceDelta: 0, cgpaDelta: 0, placementDelta: 0, internshipDelta: 0, riskDelta: 0 },
      };
    }

    const avgAttendance = Number(
      (depts.reduce((sum, d) => sum + d.avgAttendance * d.totalStudents, 0) / totalStudents).toFixed(1)
    );
    const avgCgpa = Number(
      (depts.reduce((sum, d) => sum + d.avgCgpa * d.totalStudents, 0) / totalStudents).toFixed(2)
    );
    const placementRate = Number(
      (depts.reduce((sum, d) => sum + d.placementRate * d.totalStudents, 0) / totalStudents).toFixed(1)
    );
    const internshipRate = Number(
      (depts.reduce((sum, d) => sum + d.internshipRate * d.totalStudents, 0) / totalStudents).toFixed(1)
    );
    const avgPackageLPA = Number(
      (depts.reduce((sum, d) => sum + d.avgPackageLPA * d.totalStudents, 0) / totalStudents).toFixed(1)
    );
    const highestPackageLPA = Math.max(...depts.map(d => d.highestPackageLPA));

    // Realistic year adjustments if historical year is selected
    let yearFactor = 1.0;
    if (academicYear === '2024–25') yearFactor = 0.96;
    if (academicYear === '2023–24') yearFactor = 0.92;

    return {
      totalStudents: Math.round(totalStudents * yearFactor),
      avgAttendance,
      avgCgpa,
      placementRate: Number((placementRate * (academicYear === '2025–26' ? 1 : 0.97)).toFixed(1)),
      internshipRate: Number((internshipRate * (academicYear === '2025–26' ? 1 : 0.95)).toFixed(1)),
      atRiskCount: Math.round(atRiskCount / yearFactor), // was slightly higher earlier
      totalFaculty,
      avgPackageLPA,
      highestPackageLPA,
      trends: {
        studentsDelta: 4.8,
        attendanceDelta: 1.2,
        cgpaDelta: 0.15,
        placementDelta: 6.2,
        internshipDelta: 5.1,
        riskDelta: -12.0, // negative is good for at-risk!
      },
    };
  }, [filteredDepartments, academicYear]);

  const insights = useMemo(() => {
    return generateCampusInsights(department);
  }, [department]);

  return (
    <FilterContext.Provider
      value={{
        academicYear,
        semester,
        department,
        searchQuery,
        setAcademicYear,
        setSemester,
        setDepartment,
        setSearchQuery,
        resetFilters,
        filteredDepartments,
        filteredStudents,
        kpis,
        insights,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useCampusFilters() {
  const context = useContext(FilterContext);
  if (!context) throw new Error('useCampusFilters must be used within a FilterProvider');
  return context;
}
