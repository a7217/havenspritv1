"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell,
} from "recharts";

const IndiaMapDynamic = dynamic(() => import("@/components/admin/IndiaMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-gray-300 text-xs">Loading map…</div>
  ),
});

const STATUS_COLORS: Record<string, string> = {
  PENDING:     "#f59e0b",
  SHORTLISTED: "#3b82f6",
  SELECTED:    "#10b981",
  REJECTED:    "#ef4444",
};

type RealStats = {
  totalApplications: number;
  selectedCandidates: number;
  pendingReviews: number;
  shortlisted: number;
  tenderDistribution: { name: string; count: number }[];
};

type AnalyticsData = {
  dailyTrends: { day: string; date: string; apps: number }[];
  qualDist:    { name: string; value: number; color: string }[];
  cityDist:    { name: string; count: string; color: string }[];
  statusDist:  { label: string; PENDING: number; SHORTLISTED: number; SELECTED: number; REJECTED: number }[];
};

export default function AnalyticsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => { if (window.innerWidth < 768) setSidebarOpen(false); }, []);
  const [dateStr, setDateStr] = useState("");
  const [realStats, setRealStats] = useState<RealStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) {
      router.push("/admin/login");
      return;
    }

    const now = new Date();
    setDateStr(
      now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) +
      ", " +
      now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
    );

    Promise.all([
      fetch("/api/stats").then((r) => r.json()),
      fetch("/api/stats/analytics").then((r) => r.json()),
    ])
      .then(([statsData, analyticsData]) => {
        if (statsData.success) setRealStats(statsData.data);
        if (analyticsData.success) setAnalytics(analyticsData.data);
      })
      .catch(() => {})
      .finally(() => setAnalyticsLoading(false));
  }, [router]);

  const totalApps   = realStats?.totalApplications ?? null;
  const selected    = realStats?.selectedCandidates ?? null;
  const tenderCount = realStats?.tenderDistribution?.length ?? null;
  const hiresRatio  = totalApps && selected && totalApps > 0 ? `${selected}/${totalApps}` : null;

  const topVacancies = realStats?.tenderDistribution?.slice(0, 4).map((t) => ({
    title: t.name || "—",
    vac:   t.count,
  })) ?? [];

  const dailyTrends = analytics?.dailyTrends ?? [];
  const qualDist    = analytics?.qualDist    ?? [];
  const cityDist    = analytics?.cityDist    ?? [];
  const statusDist  = analytics?.statusDist  ?? [];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]">
      {sidebarOpen && <AdminSidebar activePage="analytics" onClose={() => setSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-5 overflow-auto">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <h1 className="text-xl font-extrabold text-[#1a2744] tracking-wide uppercase">
              Recruitment &amp; Performance Analytics
            </h1>
            {dateStr && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {dateStr}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {[
              {
                label: "Total Applications",
                value: totalApps !== null ? totalApps.toLocaleString("en-IN") : "—",
                icon: <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>,
              },
              {
                label: "Active Tenders",
                value: tenderCount !== null ? String(tenderCount) : "—",
                icon: <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>,
              },
              {
                label: "Selected Candidates",
                value: selected !== null ? selected.toLocaleString("en-IN") : "—",
                icon: <path d="M20 6H4V4h16v2zm-2 2H6v12h12V8zm-5 9l-4-4 1.41-1.41L13 14.17l5.59-5.58L20 10l-7 7z"/>,
              },
              {
                label: "Hires / Applications",
                value: hiresRatio ?? "—",
                icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>,
              },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#f59e0b] rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">{icon}</svg>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wide">{label}</p>
                    <p className="text-xl font-extrabold text-[#1a2744]">{value}</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: "65%" }} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:col-span-1">
              <h2 className="font-extrabold text-[#1a2744] text-xs uppercase tracking-wide mb-1">Daily Application Trends (Last 30 Days)</h2>
              {analyticsLoading ? (
                <div className="flex items-center justify-center h-48 text-gray-300 text-xs">Loading…</div>
              ) : dailyTrends.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-300 text-xs">No data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={dailyTrends} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#1a2744" stopOpacity={0.7}/>
                        <stop offset="95%" stopColor="#1a2744" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fontSize: 9 }} interval={4} />
                    <YAxis tick={{ fontSize: 9 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ fontSize: 10 }} />
                    <Area type="monotone" dataKey="apps" stroke="#f59e0b" strokeWidth={2} fill="url(#appGrad)"
                      dot={{ fill: "#f59e0b", r: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="font-extrabold text-[#1a2744] text-xs uppercase tracking-wide mb-1">Regional Applicant Distribution</h2>
              <div style={{ height: 210 }}>
                <IndiaMapDynamic />
              </div>
              {cityDist.length > 0 && (
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                  {cityDist.map(({ name, count, color }) => (
                    <div key={name} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                      <span className="text-[11px] text-gray-600 font-medium">{name} — {count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="font-extrabold text-[#1a2744] text-xs uppercase tracking-wide mb-2">Qualification Distribution</h2>
              {analyticsLoading ? (
                <div className="flex items-center justify-center h-48 text-gray-300 text-xs">Loading…</div>
              ) : qualDist.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-300 text-xs">No data yet</div>
              ) : (
                <>
                  <div className="flex items-center justify-center" style={{ height: 170 }}>
                    <ResponsiveContainer width="100%" height={170}>
                      <PieChart>
                        <Pie data={qualDist} cx="50%" cy="50%" innerRadius={45} outerRadius={75}
                          dataKey="value" stroke="none">
                          {qualDist.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: 10 }} formatter={(v) => [v, "Applications"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-1">
                    {qualDist.map(({ name, color }) => (
                      <div key={name} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: color }} />
                        <span className="text-[11px] text-gray-600 truncate">{name}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="font-extrabold text-[#1a2744] text-xs uppercase tracking-wide mb-3">
                Application Volume by Status
              </h2>
              {analyticsLoading ? (
                <div className="flex items-center justify-center h-48 text-gray-300 text-xs">Loading…</div>
              ) : statusDist.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-300 text-xs">No data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={statusDist} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 9 }} hide />
                    <YAxis tick={{ fontSize: 9 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ fontSize: 10 }} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                    {(["PENDING", "SHORTLISTED", "SELECTED", "REJECTED"] as const).map((key) => (
                      <Bar key={key} dataKey={key} stackId="a" fill={STATUS_COLORS[key]} name={key} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#1a2744] px-4 py-3">
                <h2 className="font-extrabold text-white text-xs uppercase tracking-wide">
                  Applications by Tender
                </h2>
              </div>
              {topVacancies.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-gray-400 text-xs">
                  No application data yet
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Tender</th>
                      <th className="px-3 py-2.5 text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Applications</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topVacancies.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">{row.title}</td>
                        <td className="px-3 py-3 text-center font-bold text-[#1a2744]">{row.vac}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Total Applications", value: totalApps !== null ? totalApps.toLocaleString("en-IN") : "—", color: "text-[#1a2744]" },
                    { label: "Selected",            value: selected  !== null ? selected.toLocaleString("en-IN")  : "—", color: "text-green-600" },
                    { label: "Pending Review",      value: realStats?.pendingReviews !== undefined ? realStats.pendingReviews.toLocaleString("en-IN") : "—", color: "text-[#f59e0b]" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-center">
                      <p className="text-[11px] text-gray-400 font-semibold">{label}</p>
                      <p className={`font-extrabold text-sm ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
