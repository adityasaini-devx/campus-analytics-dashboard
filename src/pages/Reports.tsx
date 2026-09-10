import React, { useState } from 'react';
import {
  FileText, Download, Printer, CheckCircle2,
  Eye, X, Sparkles
} from 'lucide-react';
import { useCampusFilters } from '../context/FilterContext';
import { PageHeader } from '../components/layout/PageHeader';
import { TOP_HIRING_COMPANIES } from '../data/placements';

type ReportType = 'accreditation' | 'departments' | 'students' | 'attendance' | 'placements' | 'risk';

export const ReportsPage: React.FC = () => {
  const { kpis, academicYear, department, semester, filteredStudents, filteredDepartments } = useCampusFilters();
  const [selectedReport, setSelectedReport] = useState<ReportType>('accreditation');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [exportNotification, setExportNotification] = useState<string | null>(null);

  const reportsConfig: {
    id: ReportType;
    title: string;
    description: string;
    format: string;
    pages: string;
    compliance: string;
  }[] = [
    {
      id: 'accreditation',
      title: 'Institutional Comprehensive Accreditation Dossier (NAAC/NIRF)',
      description: 'Unified campus-wide report aggregating enrollment, student-faculty ratios, research papers, and placement records.',
      format: 'PDF & CSV Bundle',
      pages: '28 Pages',
      compliance: 'NAAC Criteria 1–5 & NIRF Metric Compliant',
    },
    {
      id: 'departments',
      title: 'Department Benchmarking & Academic Audit',
      description: 'Departmental comparison covering CGPA curves, pass rates, laboratory infrastructures, and budget execution.',
      format: 'Executive Summary (PDF)',
      pages: '14 Pages',
      compliance: 'Internal Quality Assurance Cell (IQAC)',
    },
    {
      id: 'students',
      title: 'Graduation Readiness & Student Roster Report',
      description: 'Detailed student cohort list with cumulative credits, backlog status, verified competencies, and placement status.',
      format: 'Raw Data (CSV & Excel)',
      pages: 'Spreadsheet',
      compliance: 'Office of the Controller of Examinations',
    },
    {
      id: 'attendance',
      title: 'Statutory Attendance & Examination Eligibility Dossier',
      description: 'Official roster identifying students below 75.0% condonation cutoff and semester-long class attendance audit.',
      format: 'Official Notice (PDF / CSV)',
      pages: '8 Pages',
      compliance: 'Statutory University Examination Regulations',
    },
    {
      id: 'placements',
      title: 'Corporate Placement & Career Outcomes Dossier',
      description: 'Salary tier distributions, marquee hiring rosters, industry internship conversions, and top recruiting partners.',
      format: 'Placement Office Report',
      pages: '12 Pages',
      compliance: 'T&P Directorate Annual Bulletin',
    },
    {
      id: 'risk',
      title: 'Student Retention & Pastoral Early-Warning Audit',
      description: 'Explainable risk score breakdown of students requiring academic mentoring, counseling, or remediation.',
      format: 'Confidential Dean Dossier',
      pages: '6 Pages',
      compliance: 'Student Welfare & Mentoring Committee',
    },
  ];

  // Function to export dynamic CSV data based on active report and current filters
  const handleExportCSV = () => {
    let csvContent = '';
    let filename = '';
    const semSuffix = semester === 'All' ? '' : `_${semester.replace(/\s+/g, '')}`;

    if (selectedReport === 'students') {
      filename = `CampusPulse_Students_${academicYear.replace('–', '-')}_${department}${semSuffix}.csv`;
      const headers = ['Roll No', 'Name', 'Department', 'Semester', 'CGPA', 'Attendance %', 'Placement Status', 'Backlogs', 'Risk Tier', 'Risk Score'];
      const rows = filteredStudents.map(s => [
        s.rollNo,
        `"${s.name}"`,
        s.department,
        s.semester,
        s.cgpa,
        s.attendance,
        `"${s.placementStatus}"`,
        s.backlogs,
        s.riskTier,
        s.riskScore,
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else if (selectedReport === 'risk') {
      filename = `CampusPulse_EarlyWarning_Risk_${academicYear.replace('–', '-')}_${department}${semSuffix}.csv`;
      const headers = ['Roll No', 'Name', 'Department', 'Semester', 'CGPA', 'Attendance %', 'Backlogs', 'Risk Tier', 'Baseline Score (100)', 'AI ML Risk Prob %', 'Primary Risk Factor', 'Recommended Intervention'];
      const rows = filteredStudents.map(s => {
        const mlProb = s.riskScore >= 70 ? Math.min(99, Math.round(s.riskScore * 1.05)) : s.riskScore >= 40 ? Math.round(s.riskScore * 0.95) : Math.max(2, Math.round(s.riskScore * 0.8));
        const primaryFactor = s.riskFactors.find(f => f.impact === 'High')?.detail || s.riskFactors[0]?.detail || 'N/A';
        const rec = s.recommendedInterventions[0] || 'Academic Advising';
        return [
          s.rollNo,
          `"${s.name}"`,
          s.department,
          s.semester,
          s.cgpa,
          s.attendance,
          s.backlogs,
          s.riskTier,
          s.riskScore,
          mlProb,
          `"${primaryFactor}"`,
          `"${rec}"`
        ];
      });
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else if (selectedReport === 'attendance') {
      filename = `CampusPulse_Attendance_Audit_${academicYear.replace('–', '-')}_${department}${semSuffix}.csv`;
      const headers = ['Roll No', 'Name', 'Department', 'Semester', 'Attendance %', 'Status (<75% Deficit)', 'Mentor'];
      const rows = filteredStudents.map(s => [
        s.rollNo,
        `"${s.name}"`,
        s.department,
        s.semester,
        s.attendance,
        s.attendance < 75 ? 'Deficit - Condonation Required' : 'Eligible',
        `"${s.mentor}"`
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else if (selectedReport === 'placements') {
      filename = `CampusPulse_Placements_${academicYear.replace('–', '-')}.csv`;
      const headers = ['Company', 'Sector', 'Tier', 'Students Hired', 'Avg Package LPA', 'Highest Package LPA'];
      const rows = TOP_HIRING_COMPANIES.map(c => [
        `"${c.name}"`,
        `"${c.sector}"`,
        `"${c.tier}"`,
        c.studentsHired,
        c.avgPackageLPA,
        c.highestPackageLPA,
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    } else {
      filename = `CampusPulse_Departments_${academicYear.replace('–', '-')}_${department}.csv`;
      const headers = ['Department Code', 'Department Name', 'HOD', 'Total Students', 'Faculty', 'Avg CGPA', 'Avg Attendance', 'Placement Rate', 'At-Risk Count'];
      const rows = filteredDepartments.map(d => [
        d.code,
        `"${d.name}"`,
        `"${d.hod}"`,
        d.totalStudents,
        d.facultyCount,
        d.avgCgpa,
        d.avgAttendance,
        d.placementRate,
        d.atRiskCount,
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    // Trigger browser file download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotification(`Downloaded ${filename} successfully!`);
    setTimeout(() => setExportNotification(null), 4000);
  };

  const handleGeneratePdf = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowPdfPreview(true);
    }, 600);
  };

  const currentConfig = reportsConfig.find(r => r.id === selectedReport) || reportsConfig[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Accreditation & Institutional Reports Center"
        description="Generate, preview, and export audit-ready institutional reports for university administration, NAAC, NIRF, and ABET committees."
      />

      {exportNotification && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{exportNotification}</span>
          </div>
          <button onClick={() => setExportNotification(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Layout: Report Selector vs Report Preview & Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Report Options */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Select Report Template
          </span>
          {reportsConfig.map(rep => (
            <div
              key={rep.id}
              onClick={() => setSelectedReport(rep.id)}
              className={`cursor-pointer rounded-xl border p-4 transition-all ${
                selectedReport === rep.id
                  ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40 shadow-xs'
                  : 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className={`h-5 w-5 shrink-0 ${selectedReport === rep.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {rep.title}
                  </h4>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {rep.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-[10px] font-medium text-slate-400 border-t border-slate-100 pt-2 dark:border-slate-800">
                <span>{rep.format}</span>
                <span className="text-indigo-600 dark:text-indigo-400">{rep.compliance}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Configuration & Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <Sparkles className="h-4 w-4" />
                Active Report Configuration
              </div>
              <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                {currentConfig.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {currentConfig.description}
              </p>
            </div>

            {/* Scope Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400">Academic Year</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{academicYear}</div>
              </div>
              <div>
                <span className="text-slate-400">Scope Filter</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{department === 'All' ? 'All 6 Departments' : department}</div>
              </div>
              <div>
                <span className="text-slate-400">Target Cohort</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{kpis.totalStudents.toLocaleString()} Students</div>
              </div>
              <div>
                <span className="text-slate-400">Format Standard</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{currentConfig.format}</div>
              </div>
            </div>

            {/* Parameters & Checkboxes */}
            <div className="py-4 space-y-2.5 text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Included Data Modules:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                  <span>Student Enrollment & Demographics</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                  <span>Curriculum Pass & Grade Distributions</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                  <span>Attendance Audits (&lt;75% flags)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                  <span>Placement Statistics & Salary Bands</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                  <span>Faculty Publications & PhD Metrics</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                  <span>AI Predictive Retention & Risk Index</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleGeneratePdf}
                disabled={isGenerating}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>{isGenerating ? 'Compiling PDF...' : 'Preview Official PDF'}</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Download className="h-4 w-4 text-slate-400" />
                <span>Export Dataset (.CSV)</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Printer className="h-4 w-4 text-slate-400" />
                <span>Print Dossier</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive PDF Preview Modal */}
      {showPdfPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Document Preview: {currentConfig.title}
                </span>
              </div>
              <button
                onClick={() => setShowPdfPreview(false)}
                className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Document Body Simulation */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-100 dark:bg-slate-950 font-serif text-slate-800 dark:text-slate-200 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-8 shadow-sm rounded-lg border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto space-y-6">
                <div className="text-center border-b pb-6 dark:border-slate-800">
                  <div className="text-xl font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                    CampusPulse Institute of Technology
                  </div>
                  <div className="text-xs font-sans text-slate-500 mt-1">
                    Autonomous Institution • Affiliated to State Technological University
                  </div>
                  <div className="text-sm font-sans font-bold text-indigo-600 dark:text-indigo-400 mt-3 uppercase tracking-wider">
                    {currentConfig.title}
                  </div>
                  <div className="text-xs font-sans text-slate-400 mt-0.5">
                    Academic Year: {academicYear} • Generation Date: September 2026
                  </div>
                </div>

                {/* Section 1: Executive KPI Summary */}
                <div className="font-sans text-xs space-y-3">
                  <h4 className="font-bold uppercase tracking-wider text-slate-500">
                    1. Executive Institutional Metrics
                  </h4>
                  <div className="grid grid-cols-3 gap-3 border p-3 rounded dark:border-slate-800">
                    <div>
                      <span className="text-slate-400">Total Enrolled:</span>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{kpis.totalStudents.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Campus Attendance:</span>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{kpis.avgAttendance}%</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Cumulative CGPA:</span>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{kpis.avgCgpa.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Placement Rate:</span>
                      <div className="font-bold text-sm text-emerald-600">{kpis.placementRate}%</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Internship Rate:</span>
                      <div className="font-bold text-sm text-indigo-600">{kpis.internshipRate}%</div>
                    </div>
                    <div>
                      <span className="text-slate-400">At-Risk Students:</span>
                      <div className="font-bold text-sm text-rose-600">{kpis.atRiskCount}</div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Department Summary */}
                <div className="font-sans text-xs space-y-3">
                  <h4 className="font-bold uppercase tracking-wider text-slate-500">
                    2. Departmental Performance Audit
                  </h4>
                  <table className="w-full border-collapse text-left text-[11px]">
                    <thead>
                      <tr className="border-b dark:border-slate-800 text-slate-400">
                        <th className="py-1">Dept</th>
                        <th className="py-1 text-right">Students</th>
                        <th className="py-1 text-right">Avg CGPA</th>
                        <th className="py-1 text-right">Attendance</th>
                        <th className="py-1 text-right">Placed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-800">
                      {filteredDepartments.map(d => (
                        <tr key={d.id}>
                          <td className="py-1.5 font-bold">{d.code}</td>
                          <td className="py-1.5 text-right">{d.totalStudents.toLocaleString()}</td>
                          <td className="py-1.5 text-right font-mono">{d.avgCgpa.toFixed(2)}</td>
                          <td className="py-1.5 text-right font-mono">{d.avgAttendance}%</td>
                          <td className="py-1.5 text-right font-semibold font-mono text-emerald-600">{d.placementRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Section 3: Early-Warning Risk & Retention Summary */}
                <div className="font-sans text-xs space-y-3">
                  <h4 className="font-bold uppercase tracking-wider text-slate-500">
                    3. Early-Warning Risk & Retention Summary
                  </h4>
                  <div className="grid grid-cols-3 gap-2 border p-3 rounded dark:border-slate-800 text-[11px]">
                    <div className="p-2 rounded bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300">Low Risk Tier:</span>
                      <div className="font-bold text-sm text-emerald-700">6,850 (81.3%)</div>
                      <span className="text-[10px] text-slate-400">Stable retention</span>
                    </div>
                    <div className="p-2 rounded bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                      <span className="font-bold text-amber-800 dark:text-amber-300">Monitor Tier:</span>
                      <div className="font-bold text-sm text-amber-700">1,234 (14.6%)</div>
                      <span className="text-[10px] text-slate-400">Proactive advising</span>
                    </div>
                    <div className="p-2 rounded bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900">
                      <span className="font-bold text-rose-800 dark:text-rose-300">High Risk Tier:</span>
                      <div className="font-bold text-sm text-rose-700">342 (4.1%)</div>
                      <span className="text-[10px] text-slate-400">Urgent tutoring</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-850/40 text-[10px] text-slate-500 space-y-1">
                    <div><strong>Evaluated Model:</strong> Logistic Regression Balanced (Recall: 92.5%, ROC-AUC: 0.984, PR-AUC: 0.783).</div>
                    <div><strong>Primary Drivers Flagged:</strong> Course Backlog Accumulation (40%), Semester CGPA Trajectory Decline (29%), Class Attendance Deficit (28%).</div>
                    <div className="italic text-slate-400">Model performance is evaluated on synthetic demonstration data and requires real-world institutional validation. Human pastoral review required prior to administrative intervention.</div>
                  </div>
                </div>

                <div className="font-sans text-[10px] text-slate-400 border-t pt-4 dark:border-slate-800 flex items-center justify-between">
                  <span>Signatory: Dr. Evelyn Vance, Dean of Academics</span>
                  <span>Document Hash: SHA256-8A4F92B</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3 dark:border-slate-800 dark:bg-slate-900 text-xs">
              <span className="text-slate-500">Report compilation ready</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500"
                >
                  Print / Save PDF
                </button>
                <button
                  onClick={() => setShowPdfPreview(false)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
