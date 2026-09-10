import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FilterProvider, useCampusFilters } from './context/FilterContext';
import { Header } from './components/layout/Header';
import { Sidebar, type PageId } from './components/layout/Sidebar';
import { CommandPalette } from './components/layout/CommandPalette';
import { StudentProfileModal } from './components/students/StudentProfileModal';
import { DepartmentModal } from './components/departments/DepartmentModal';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AcademicsPage } from './pages/Academics';
import { AttendancePage } from './pages/Attendance';
import { DepartmentsPage } from './pages/Departments';
import { StudentsPage } from './pages/Students';
import { PlacementsPage } from './pages/Placements';
import { InternshipsPage } from './pages/Internships';
import { SkillsPage } from './pages/Skills';
import { RiskAnalysisPage } from './pages/RiskAnalysis';
import { EventsPage } from './pages/Events';
import { FacultyPage } from './pages/Faculty';
import { ReportsPage } from './pages/Reports';
import { SettingsPage } from './pages/Settings';
import { HelpPage } from './pages/Help';

import { type Student } from './data/students';
import { type Department } from './data/departments';

const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { academicYear, setDepartment } = useCampusFilters();

  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global modals
  const [globalStudentModal, setGlobalStudentModal] = useState<Student | null>(null);
  const [globalDeptModal, setGlobalDeptModal] = useState<Department | null>(null);

  if (!isAuthenticated) {
    return <Login />;
  }

  const getPageInfo = (page: PageId) => {
    switch (page) {
      case 'dashboard':
        return { title: 'Executive Overview', breadcrumb: `Overview / Academic Year ${academicYear}` };
      case 'academics':
        return { title: 'Academic Performance', breadcrumb: 'Academics / Performance Trends' };
      case 'attendance':
        return { title: 'Attendance Analytics', breadcrumb: 'Academics / Statutory Attendance' };
      case 'departments':
        return { title: 'Departments Directory', breadcrumb: 'Academics / Engineering Faculties' };
      case 'students':
        return { title: 'Students Roster', breadcrumb: 'Academics / Student Intelligence' };
      case 'placements':
        return { title: 'Placement Analytics', breadcrumb: 'Career / Graduate Placements' };
      case 'internships':
        return { title: 'Internships & Stipends', breadcrumb: 'Career / Experiential Learning' };
      case 'skills':
        return { title: 'Skills & Gap Analysis', breadcrumb: 'Career / Market Competency' };
      case 'risk':
        return { title: 'Early Warning Risk System', breadcrumb: 'Intelligence / Risk Analysis' };
      case 'events':
        return { title: 'Events & Engagement', breadcrumb: 'Campus Life / Co-curriculars' };
      case 'faculty':
        return { title: 'Faculty & Research Metrics', breadcrumb: 'Campus Life / Academic Staff' };
      case 'reports':
        return { title: 'Accreditation Reports', breadcrumb: 'Intelligence / Reports & Export' };
      case 'settings':
        return { title: 'System Administration', breadcrumb: 'Settings / Configuration' };
      case 'help':
        return { title: 'Help & Documentation', breadcrumb: 'Support / User Manual' };
      default:
        return { title: 'Campus Analytics', breadcrumb: 'Overview' };
    }
  };

  const pageInfo = getPageInfo(currentPage);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Collapsible Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Header
          pageTitle={pageInfo.title}
          breadcrumb={pageInfo.breadcrumb}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
          {currentPage === 'dashboard' && (
            <Dashboard
              onNavigate={setCurrentPage}
              onSelectDepartment={(dept) => setGlobalDeptModal(dept)}
            />
          )}
          {currentPage === 'academics' && <AcademicsPage />}
          {currentPage === 'attendance' && <AttendancePage />}
          {currentPage === 'departments' && (
            <DepartmentsPage
              onSelectDepartmentModal={(dept) => setGlobalDeptModal(dept)}
            />
          )}
          {currentPage === 'students' && (
            <StudentsPage
              onSelectStudentModal={(st) => setGlobalStudentModal(st)}
            />
          )}
          {currentPage === 'placements' && <PlacementsPage />}
          {currentPage === 'internships' && <InternshipsPage />}
          {currentPage === 'skills' && <SkillsPage />}
          {currentPage === 'risk' && <RiskAnalysisPage />}
          {currentPage === 'events' && <EventsPage />}
          {currentPage === 'faculty' && <FacultyPage />}
          {currentPage === 'reports' && <ReportsPage />}
          {currentPage === 'settings' && <SettingsPage />}
          {currentPage === 'help' && <HelpPage />}
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={setCurrentPage}
        onSelectStudent={(student) => setGlobalStudentModal(student)}
      />

      {/* Global Modals */}
      <StudentProfileModal
        student={globalStudentModal}
        onClose={() => setGlobalStudentModal(null)}
      />

      <DepartmentModal
        department={globalDeptModal}
        onClose={() => setGlobalDeptModal(null)}
        onFilterDepartment={(deptCode) => {
          setDepartment(deptCode as any);
          setCurrentPage('dashboard');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FilterProvider>
          <MainApp />
        </FilterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
