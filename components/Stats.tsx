"use client";
import { useEffect, useState } from "react";
import { StatCircleSkeleton } from "@/components/Skeleton";

type StatsData = {
  totalVacancies: number;
  totalApplications: number;
  activeProjects: number;
  partnerDepts: number;
  activeJobs: number;
};

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k+`;
  if (n > 0) return `${n}+`;
  return "0";
}

const STAT_ICONS = [
  "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
];

export default function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    fetch("/api/stats/public")
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); })
      .catch(() => {});
  }, []);

  const items = [
    { value: stats ? formatCount(stats.totalVacancies)    : "—", label: "Total Vacancies",      icon: STAT_ICONS[0] },
    { value: stats ? formatCount(stats.totalApplications) : "—", label: "Applications Received", icon: STAT_ICONS[1] },
    { value: stats ? formatCount(stats.activeJobs)        : "—", label: "Active Job Listings",  icon: STAT_ICONS[2] },
    { value: stats ? formatCount(stats.activeProjects)    : "—", label: "Active Projects",      icon: STAT_ICONS[3] },
    { value: stats ? `${stats.partnerDepts}+`             : "—", label: "Partner Departments",  icon: STAT_ICONS[4] },
  ];

  return (
    <section className="py-10 sm:py-14 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">By the Numbers</p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1a2744] uppercase tracking-wide">Our Impact</h2>
          <p className="text-gray-500 text-sm mt-2">Driving government recruitment across Bihar</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats === null
            ? items.map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <StatCircleSkeleton />
                </div>
              ))
            : items.map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center p-5 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#1a2744] rounded-full flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                    </svg>
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-[#1a2744] leading-none">{stat.value}</span>
                  <p className="text-gray-500 text-[11px] mt-1.5 leading-tight">{stat.label}</p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
