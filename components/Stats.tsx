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

export default function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    fetch("/api/stats/public")
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); })
      .catch(() => {});
  }, []);

  const items = [
    { value: stats ? formatCount(stats.totalVacancies) : "—", label: "Total\nVacancies" },
    { value: stats ? formatCount(stats.totalApplications) : "—", label: "Total\nApplications" },
    { value: stats ? formatCount(stats.activeJobs) : "—", label: "Active\nJob Listings" },
    { value: stats ? formatCount(stats.activeProjects) : "—", label: "Active\nProjects" },
    { value: stats ? `${stats.partnerDepts}+` : "—", label: "Partner\nDepartments" },
  ];

  return (
    <section className="py-8 sm:py-10 px-4 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-[#1a2744] rounded-xl p-4 sm:p-6 md:p-8 shadow-xl">
        <h2 className="text-center text-white text-lg sm:text-xl font-bold uppercase tracking-wider sm:tracking-widest mb-6 sm:mb-8">
          Stats
        </h2>
        <div className="flex flex-wrap justify-center gap-5 sm:gap-8">
          {stats === null
            ? items.map((_, i) => <StatCircleSkeleton key={i} />)
            : items.map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-[72px] sm:w-auto">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white flex items-center justify-center bg-[#243560] shrink-0">
                    <span className="text-white font-extrabold text-sm sm:text-lg leading-tight text-center">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-gray-300 text-[10px] sm:text-xs text-center whitespace-pre-line leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
