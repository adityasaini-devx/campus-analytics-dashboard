import React from 'react';
import {
  Zap, AlertTriangle, Award
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, Legend
} from 'recharts';
import { PageHeader } from '../components/layout/PageHeader';
import { KPICard } from '../components/dashboard/KPICard';
import { ChartCard } from '../components/dashboard/ChartCard';
import { TOP_CAMPUS_SKILLS, SKILL_GAP_ANALYSIS, CERTIFICATIONS_DATA } from '../data/skills';

export const SkillsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Skills Inventory & Industry Demand Gap Analysis"
        description="Comparing verified student proficiencies against contemporary tech sector hiring demands to guide upskilling bootcamps."
      />

      {/* Top Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="Most Prevalent Skill"
          value="Python & Data"
          subtitle="78.0% of campus students verified proficient"
          icon={Zap}
          color="indigo"
        />

        <KPICard
          title="Widest Skill Deficit"
          value="Cloud & K8s"
          subtitle="-42% gap between industry demand & student skill"
          icon={AlertTriangle}
          color="amber"
          valueColor="text-amber-600 dark:text-amber-400"
        />

        <KPICard
          title="Verified Certifications"
          value="1,847"
          subtitle="Across AWS, GCP, NVIDIA & Cisco"
          icon={Award}
          color="emerald"
          valueColor="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Common Skills Horizontal Bar */}
        <ChartCard
          title="Most Common Student Skills"
          subtitle="Percentage of enrolled students with verified project or coursework proficiency"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={TOP_CAMPUS_SKILLS}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 10, fontWeight: 500 }}
                width={120}
              />
              <Tooltip formatter={(val: any) => [`${val}% of students`, 'Proficiency']} />
              <Bar dataKey="percentage" fill="#4f46e5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Skill Gap Analysis Comparative Chart */}
        <ChartCard
          title="Skill Gap Analysis: Student Supply vs Industry Demand"
          subtitle="Direct comparison showing areas where institutional curriculum must adapt"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={SKILL_GAP_ANALYSIS} margin={{ top: 10, right: 20, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="skill" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(val: any, name: any) => [`${val}%`, name]} />
              <Legend wrapperStyle={{ fontSize: 11, top: -10 }} />
              <Bar dataKey="studentProficiency" name="Student Proficiency (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="industryDemand" name="Industry Demand Benchmark (%)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Detailed Skill Gap Table & Certifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Curriculum Intervention & Skill Deficit Index
            </h3>
            <p className="text-xs text-slate-500">Ranked by severity of industry hiring gap</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/80 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Skill Domain</th>
                  <th className="py-3 px-4 text-right">Student Supply</th>
                  <th className="py-3 px-4 text-right">Industry Need</th>
                  <th className="py-3 px-4 text-right">Net Gap</th>
                  <th className="py-3 px-4">Intervention Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {SKILL_GAP_ANALYSIS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {item.skill}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {item.studentProficiency}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold">
                      {item.industryDemand}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                      {item.gap}%
                    </td>
                    <td className="py-3 px-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        item.urgency === 'High' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' :
                        item.urgency === 'Moderate' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}>
                        {item.urgency} Urgency
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recognized Professional Certifications Card */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
            Top Industry Certifications Held
          </h3>
          <p className="text-xs text-slate-500 mb-4">Credentials validated by examination vouchers</p>
          <div className="space-y-3">
            {CERTIFICATIONS_DATA.map((cert, idx) => (
              <div key={idx} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60 text-xs">
                <div className="font-semibold text-slate-900 dark:text-white">
                  {cert.cert}
                </div>
                <div className="mt-1 flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span><strong>{cert.holders}</strong> Certified Holders</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{cert.growth} YoY</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
