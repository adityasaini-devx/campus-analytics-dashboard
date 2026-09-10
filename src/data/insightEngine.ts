import { DEPARTMENTS } from './departments';

export interface CampusInsight {
  id: string;
  category: 'Academics' | 'Attendance' | 'Placements' | 'Risk' | 'Engagement';
  type: 'positive' | 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  metric?: string;
  recommendation?: string;
  department?: string;
  timestamp: string;
}

export function generateCampusInsights(selectedDept: string = 'All'): CampusInsight[] {
  const insights: CampusInsight[] = [];
  const depts = selectedDept === 'All' ? DEPARTMENTS : DEPARTMENTS.filter(d => d.code === selectedDept);

  // 1. Placement insight
  const avgPlacement = depts.reduce((s, d) => s + d.placementRate * d.totalStudents, 0) /
    depts.reduce((s, d) => s + d.totalStudents, 0);

  if (avgPlacement >= 75) {
    insights.push({
      id: 'ins-placement-pos',
      category: 'Placements',
      type: 'positive',
      title: 'Strong Placement Momentum',
      description: `Campus placement rate stands at ${avgPlacement.toFixed(1)}%, surpassing the institutional benchmark of 75.0% by +${(avgPlacement - 75).toFixed(1)}%. Marquee hiring by Google, Microsoft, and Texas Instruments increased tier-1 offers.`,
      metric: `${avgPlacement.toFixed(1)}% Placed`,
      recommendation: 'Expand corporate tie-ups in semiconductor design and enterprise cloud.',
      department: selectedDept === 'All' ? 'Campus-Wide' : selectedDept,
      timestamp: '2 hours ago',
    });
  } else {
    insights.push({
      id: 'ins-placement-warn',
      category: 'Placements',
      type: 'warning',
      title: 'Placement Conversion Lagging Target',
      description: `Current placement rate for ${selectedDept} is ${avgPlacement.toFixed(1)}%, trailing the 75.0% campus benchmark.`,
      metric: `${avgPlacement.toFixed(1)}% Placed`,
      recommendation: 'Initiate targeted coding bootcamps and mock technical interviews with alumni.',
      department: selectedDept,
      timestamp: 'Today',
    });
  }

  // 2. Attendance insight
  const avgAtt = depts.reduce((s, d) => s + d.avgAttendance * d.totalStudents, 0) /
    depts.reduce((s, d) => s + d.totalStudents, 0);

  if (avgAtt < 80) {
    insights.push({
      id: 'ins-att-warn',
      category: 'Attendance',
      type: 'warning',
      title: 'Sub-80% Attendance Flagged',
      description: `Average attendance is currently ${avgAtt.toFixed(1)}%. Friday lab sessions and mid-term exam preparatory weeks observed a 9.2% downward dip.`,
      metric: `${avgAtt.toFixed(1)}% Avg Attendance`,
      recommendation: 'Enforce bi-weekly automated SMS alerts to guardians and review Friday laboratory scheduling.',
      department: selectedDept === 'All' ? 'Civil / Mech' : selectedDept,
      timestamp: '5 hours ago',
    });
  } else {
    insights.push({
      id: 'ins-att-pos',
      category: 'Attendance',
      type: 'positive',
      title: 'Healthy Attendance Compliance',
      description: `Aggregate attendance remains high at ${avgAtt.toFixed(1)}%, with 84% of enrolled students securely above the mandatory 75% examination eligibility bar.`,
      metric: `${avgAtt.toFixed(1)}% Compliant`,
      recommendation: 'Continue reward credits for 95%+ attendance holders.',
      department: selectedDept === 'All' ? 'Campus-Wide' : selectedDept,
      timestamp: 'Yesterday',
    });
  }

  // 3. Risk analysis insight
  const totalAtRisk = depts.reduce((s, d) => s + d.atRiskCount, 0);
  const totalStuds = depts.reduce((s, d) => s + d.totalStudents, 0);
  const atRiskPct = (totalAtRisk / totalStuds) * 100;

  if (atRiskPct > 5) {
    insights.push({
      id: 'ins-risk-crit',
      category: 'Risk',
      type: 'critical',
      title: 'Elevated Student Risk Cohort',
      description: `${totalAtRisk} students (${atRiskPct.toFixed(1)}% of cohort) exhibit composite risk scores > 50, primarily driven by concurrent attendance deficits (<65%) and active backlogs.`,
      metric: `${totalAtRisk} Students Flagged`,
      recommendation: 'Activate immediate faculty mentor 1-on-1 intervention meetings and remedial doubt sessions.',
      department: selectedDept === 'All' ? 'Campus-Wide' : selectedDept,
      timestamp: '1 hour ago',
    });
  } else {
    insights.push({
      id: 'ins-risk-pos',
      category: 'Risk',
      type: 'positive',
      title: 'Risk Cohort Under Control',
      description: `Only ${totalAtRisk} students (${atRiskPct.toFixed(1)}%) are currently in the medium/high-risk spectrum, a 12% reduction over last semester.`,
      metric: `${totalAtRisk} at risk`,
      recommendation: 'Maintain proactive peer tutoring circles.',
      department: selectedDept === 'All' ? 'Campus-Wide' : selectedDept,
      timestamp: '1 day ago',
    });
  }

  // 4. Academic performance insight
  const bestDept = [...depts].sort((a, b) => b.avgCgpa - a.avgCgpa)[0];
  const lowestDept = [...depts].sort((a, b) => a.avgCgpa - b.avgCgpa)[0];

  insights.push({
    id: 'ins-acad-perf',
    category: 'Academics',
    type: 'info',
    title: 'Departmental CGPA Variance',
    description: `${bestDept.name} leads academic scores with an average CGPA of ${bestDept.avgCgpa}, while ${lowestDept.name} averages ${lowestDept.avgCgpa}. Semester 4 continues to see the highest backlog concentration in math/structures.`,
    metric: `${bestDept.code} (${bestDept.avgCgpa}) vs ${lowestDept.code} (${lowestDept.avgCgpa})`,
    recommendation: 'Align core tutorial problem sets across foundational engineering physics and mathematics.',
    department: 'Campus-Wide',
    timestamp: '3 hours ago',
  });

  // 5. Internship Conversion
  const avgIntern = depts.reduce((s, d) => s + d.internshipRate * d.totalStudents, 0) / totalStuds;
  insights.push({
    id: 'ins-intern-insight',
    category: 'Placements',
    type: 'positive',
    title: 'Strong PPO Conversion from Internships',
    description: `64.2% of pre-final year students have secured summer internships, yielding a 42.8% Pre-Placement Offer (PPO) conversion rate before the main placement season opened.`,
    metric: `${avgIntern.toFixed(1)}% Internships`,
    recommendation: 'Recognize industry internship mentor faculty coordinators.',
    department: selectedDept === 'All' ? 'Campus-Wide' : selectedDept,
    timestamp: 'Just now',
  });

  return insights;
}
