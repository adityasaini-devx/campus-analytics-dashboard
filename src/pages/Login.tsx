import React, { useState } from 'react';
import { GraduationCap, ShieldCheck, ArrowRight, Sparkles, Building2, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('dean.academics@campuspulse.edu');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Left Column: Value Prop & Brand (hidden on small devices) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-12 text-white relative overflow-hidden">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500 shadow-lg text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">CampusPulse BI</span>
              <span className="block text-[11px] font-medium tracking-wider text-indigo-300 uppercase">
                Higher Education Analytics
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            Next-Gen Academic Intelligence
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
            Transform campus data into <span className="text-indigo-400">actionable insights</span>.
          </h1>

          <p className="text-base text-slate-300 leading-relaxed">
            Monitor real-time student progression, early-warning risk indicators, departmental benchmarks, and placement outcomes across 8,400+ enrolled students.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-indigo-800/40">
            <div>
              <div className="text-2xl font-bold text-white">8,426</div>
              <div className="text-xs text-indigo-300">Active Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">78.6%</div>
              <div className="text-xs text-indigo-300">Placement Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">99.8%</div>
              <div className="text-xs text-indigo-300">Data Reliability</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400">
          Enterprise Security • FERPA / NEP 2020 Compliant • Accreditation Ready
        </div>
      </div>

      {/* Right Column: Sign In Form & Instant Demo Buttons */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2">
        <div className="mx-auto w-full max-w-md space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 lg:hidden mb-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">CampusPulse BI</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Sign in to Dashboard
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Enter your institutional credentials or explore with 1-click Demo accounts below.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Institutional Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); }} className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
            >
              <span>Sign In with SSO</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick Demo Access Buttons */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Instant Interactive Demo
              </span>
              <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/50 dark:text-emerald-300">
                Live Synthetic Cohort
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => demoLogin('Administrator')}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3 text-left text-xs font-medium text-slate-700 shadow-2xs hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/30 transition-all"
              >
                <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Admin Provost</div>
                  <div className="text-[10px] text-slate-400">Executive View</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => demoLogin('Dean of Academics')}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3 text-left text-xs font-medium text-slate-700 shadow-2xs hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/30 transition-all"
              >
                <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Dean Academics</div>
                  <div className="text-[10px] text-slate-400">Curriculum & Risk</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => demoLogin('Head of Department')}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3 text-left text-xs font-medium text-slate-700 shadow-2xs hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/30 transition-all"
              >
                <Building2 className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">HOD (CSE Dept)</div>
                  <div className="text-[10px] text-slate-400">Department Scope</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => demoLogin('Placement Director')}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3 text-left text-xs font-medium text-slate-700 shadow-2xs hover:border-indigo-300 hover:bg-indigo-50/40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/30 transition-all"
              >
                <Briefcase className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Placement Lead</div>
                  <div className="text-[10px] text-slate-400">Hiring & Internships</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
