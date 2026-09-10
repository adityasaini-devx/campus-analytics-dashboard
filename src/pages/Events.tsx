import React from 'react';
import {
  Calendar, Users, Trophy, Star
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Tooltip,
  CartesianGrid, XAxis, YAxis
} from 'recharts';
import { PageHeader } from '../components/layout/PageHeader';
import { KPICard } from '../components/dashboard/KPICard';
import { ChartCard } from '../components/dashboard/ChartCard';
import {
  CAMPUS_EVENTS, CLUBS_LEADERBOARD, EVENT_CATEGORY_DISTRIBUTION,
  DEPARTMENT_ENGAGEMENT_RATES
} from '../data/events';

export const EventsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Campus Events, Student Life & Club Engagement"
        description="Tracking co-curricular vibrancy, technical hackathons, cultural festivals, and student leadership participation."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Events Conducted"
          value="80 Events"
          change={18}
          changeLabel="increase vs last year"
          trend="up"
          icon={Calendar}
          color="indigo"
        />

        <KPICard
          title="Student Participation"
          value="78.2%"
          subtitle="Campus-wide co-curricular reach"
          icon={Users}
          color="emerald"
          valueColor="text-emerald-600 dark:text-emerald-400"
        />

        <KPICard
          title="Active Student Clubs"
          value="24 Registered"
          subtitle="Tech, Robotics, Literary, Sports, Arts"
          icon={Trophy}
          color="indigo"
        />

        <KPICard
          title="Hackathon Laurels"
          value="42 Wins"
          subtitle="State & National competitions"
          icon={Star}
          color="amber"
          valueColor="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Category Distribution Donut */}
        <ChartCard
          title="Campus Event Category Distribution"
          subtitle="Breakdown of the 80 university sanctioned events by domain"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 h-full items-center gap-4">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={EVENT_CATEGORY_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {EVENT_CATEGORY_DISTRIBUTION.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [`${val} events`, 'Conducted']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-xs">
              {EVENT_CATEGORY_DISTRIBUTION.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{cat.name}</span>
                  </div>
                  <span className="font-mono text-slate-500">{cat.count} ({cat.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Department Engagement Rates Bar */}
        <ChartCard
          title="Department Co-curricular Participation Rate"
          subtitle="Student engagement in hackathons, symposiums, and sports"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={DEPARTMENT_ENGAGEMENT_RATES} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(val: any) => [`${val}%`, 'Participation']} />
              <Bar dataKey="participationRate" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                {DEPARTMENT_ENGAGEMENT_RATES.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.participationRate >= 80 ? '#4f46e5' : '#818cf8'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Clubs Leaderboard & Major Campus Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Clubs Leaderboard */}
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Student Clubs & Professional Chapters Leaderboard
            </h3>
            <p className="text-xs text-slate-500">Ranked by active membership and event ratings</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 uppercase">
                <tr>
                  <th className="p-3">Club / Chapter</th>
                  <th className="p-3 text-right">Active Members</th>
                  <th className="p-3 text-right">Events Done</th>
                  <th className="p-3 text-right">Student Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {CLUBS_LEADERBOARD.map((club, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {club.name}
                      <div className="text-[10px] text-slate-400 font-normal">President: {club.president}</div>
                    </td>
                    <td className="p-3 text-right font-mono text-slate-600 dark:text-slate-300">
                      {club.activeMembers} members
                    </td>
                    <td className="p-3 text-right font-mono font-semibold">
                      {club.eventsOrganized}
                    </td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-600 dark:text-amber-400">
                        <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
                        {club.rating.toFixed(1)} / 5.0
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Flagship Campus Events */}
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Flagship Campus Summits & Hackathons
            </h3>
            <p className="text-xs text-slate-500">Major academic and inter-collegiate gatherings</p>
          </div>

          <div className="p-4 space-y-3">
            {CAMPUS_EVENTS.map(evt => (
              <div
                key={evt.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{evt.title}</span>
                    <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {evt.category}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400">
                    {evt.date} • {evt.organizer}
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {evt.attendees.toLocaleString()} Attendees
                  </div>
                  <span className={`text-[10px] font-bold ${evt.status === 'Completed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                    {evt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
