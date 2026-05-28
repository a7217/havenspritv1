"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

const statusColors: Record<string, string> = {
  PENDING:     "bg-[#f59e0b] text-white",
  SELECTED:    "bg-green-500 text-white",
  SHORTLISTED: "bg-blue-500 text-white",
  REJECTED:    "bg-red-500 text-white",
};

type LiveApplicant = {
  _id: string;
  fullName: string;
  jobTitle: string;
  tender: string;
  qualification: string;
  resumeUrl: string;
  applicationStatus: "PENDING" | "SELECTED" | "SHORTLISTED" | "REJECTED";
};

type VacancyRow = {
  _id: string;
  title: string;
  vacancies: number;
  lastDate: string;
  isActive: boolean;
};

type Stats = {
  totalApplications: number;
  selectedCandidates: number;
  pendingReviews: number;
  shortlisted: number;
  tenderDistribution: { name: string; count: number }[];
};

type ServerStats = {
  cpu:      { usage: number; cores: number; model: string };
  memory:   { used: number; total: number; percent: number };
  uptime:   string;
  platform: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  useEffect(() => { if (window.innerWidth < 768) setSidebarOpen(false); }, []);
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [applicants, setApplicants]     = useState<LiveApplicant[]>([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [vacancies, setVacancies]       = useState<VacancyRow[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalApplications: 0,
    selectedCandidates: 0,
    pendingReviews: 0,
    shortlisted: 0,
    tenderDistribution: [],
  });
  const [statsLoading, setStatsLoading]   = useState(true);
  const [serverStats, setServerStats]     = useState<ServerStats | null>(null);

  const fetchServerStats = useCallback(() => {
    fetch("/api/admin/server-stats")
      .then((r) => r.json())
      .then((d) => { if (d.success) setServerStats(d.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) {
      router.push("/admin/login");
      return;
    }
    Promise.all([
      fetch("/api/stats").then((r) => r.json()),
      fetch("/api/applications?limit=7").then((r) => r.json()),
      fetch("/api/jobs").then((r) => r.json()),
    ])
      .then(([statsData, appData, jobsData]) => {
        if (statsData.success) setStats(statsData.data);
        if (appData.success)   setApplicants(appData.data.slice(0, 7));
        if (jobsData.success)  setVacancies(jobsData.data.slice(0, 8));
      })
      .catch(() => {})
      .finally(() => setStatsLoading(false));

    fetchServerStats();
    const interval = setInterval(fetchServerStats, 5000);
    return () => clearInterval(interval);
  }, [router, fetchServerStats]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res  = await fetch(`/api/applications/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ applicationStatus: newStatus }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Status update failed.");
      setApplicants((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, applicationStatus: newStatus as LiveApplicant["applicationStatus"] } : a
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Status update failed. Please try again.");
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this application? This action cannot be undone.")) return;
    try {
      const res  = await fetch(`/api/applications/${id}`, {
        method:  "DELETE",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Delete failed.");
      setApplicants((prev) => prev.filter((a) => a._id !== id));
      setStats((prev) => ({
        ...prev,
        totalApplications: Math.max(0, prev.totalApplications - 1),
      }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed. Please try again.");
    }
  };

  const filteredApplicants =
    filterStatus === "ALL"
      ? applicants
      : applicants.filter((a) => a.applicationStatus === filterStatus);

  const maxCount = stats.tenderDistribution.length
    ? Math.max(...stats.tenderDistribution.map((d) => d.count))
    : 1;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]">
      {sidebarOpen && <AdminSidebar activePage="dashboard" onClose={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-5 overflow-auto">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl font-extrabold text-[#1a2744] tracking-wide uppercase">
              Admin Dashboard - Overview
            </h1>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="TOTAL APPLICATIONS"
              value={statsLoading ? "..." : stats.totalApplications.toLocaleString("en-IN")}
              icon={
                <svg className="w-8 h-8 text-[#f59e0b]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                </svg>
              }
            />
            <StatCard
              label="ACTIVE TENDERS"
              value={statsLoading ? "..." : stats.tenderDistribution.length.toString()}
              icon={
                <svg className="w-8 h-8 text-[#f59e0b]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                </svg>
              }
            />
            <StatCard
              label="SELECTED CANDIDATES"
              value={statsLoading ? "..." : stats.selectedCandidates.toString()}
              icon={
                <svg className="w-8 h-8 text-[#f59e0b]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              }
            />
            <StatCard
              label="PENDING REVIEWS"
              value={statsLoading ? "..." : stats.pendingReviews.toString()}
              icon={
                <svg className="w-8 h-8 text-[#f59e0b]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              }
            />
          </div>

          {/* Server Monitor */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-[#1a2744] text-sm uppercase tracking-wide flex items-center gap-2">
                <svg className="w-4 h-4 text-[#f59e0b]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 3v1h12v-1l-1-3h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z"/>
                </svg>
                Server Monitor
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-gray-500">Live • 5s refresh</span>
              </div>
            </div>

            {!serverStats ? (
              <div className="flex items-center gap-2 text-gray-400 text-xs py-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-[#f59e0b] rounded-full animate-spin" />
                Loading server stats…
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* CPU */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">CPU</span>
                    <span className={`text-xs font-bold ${serverStats.cpu.usage > 80 ? "text-red-500" : serverStats.cpu.usage > 50 ? "text-amber-500" : "text-green-500"}`}>
                      {serverStats.cpu.usage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${serverStats.cpu.usage > 80 ? "bg-red-500" : serverStats.cpu.usage > 50 ? "bg-amber-500" : "bg-green-500"}`}
                      style={{ width: `${serverStats.cpu.usage}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-gray-400 mt-1">{serverStats.cpu.cores} cores</p>
                </div>

                {/* RAM */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">RAM</span>
                    <span className={`text-xs font-bold ${serverStats.memory.percent > 85 ? "text-red-500" : serverStats.memory.percent > 60 ? "text-amber-500" : "text-green-500"}`}>
                      {serverStats.memory.percent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${serverStats.memory.percent > 85 ? "bg-red-500" : serverStats.memory.percent > 60 ? "bg-amber-500" : "bg-blue-500"}`}
                      style={{ width: `${serverStats.memory.percent}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-gray-400 mt-1">{serverStats.memory.used} / {serverStats.memory.total} MB</p>
                </div>

                {/* Uptime */}
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Uptime</span>
                  <span className="text-base font-extrabold text-[#1a2744]">{serverStats.uptime}</span>
                  <div className="mt-1 h-0.5 w-8 bg-[#f59e0b] rounded" />
                </div>

                {/* Platform */}
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Platform</span>
                  <span className="text-base font-extrabold text-[#1a2744] capitalize">{serverStats.platform}</span>
                  <p className="text-[9px] text-gray-400 mt-1 truncate">{serverStats.cpu.model}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <h2 className="font-bold text-[#1a2744] text-sm uppercase tracking-wide mb-4">
                Tender-wise Application Distribution
              </h2>
              {statsLoading ? (
                <div className="flex items-center justify-center h-48 text-gray-400 text-xs">Loading chart…</div>
              ) : stats.tenderDistribution.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-400 text-xs">No data yet</div>
              ) : (
                <div className="flex items-end gap-6 h-48 px-4">
                  {stats.tenderDistribution.map((item) => {
                    const barHeight = Math.round((item.count / maxCount) * 160);
                    return (
                      <div key={item.name} className="flex flex-col items-center flex-1 gap-1">
                        <span className="text-xs font-bold text-gray-600">{item.count}</span>
                        <div
                          className="w-full bg-[#1a2744] rounded-t transition-all duration-500"
                          style={{ height: `${barHeight}px` }}
                        />
                        <span className="text-xs font-semibold text-gray-600 mt-1 text-center leading-tight break-all">
                          {item.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-[#1a2744] text-sm uppercase tracking-wide">Latest Applicants</h2>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 focus:outline-none focus:border-[#f59e0b]"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="SELECTED">Selected</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wide">Name</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wide">Job / Tender</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wide">Qual.</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wide">Resume</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredApplicants.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                          {statsLoading ? "Loading…" : "No applications yet"}
                        </td>
                      </tr>
                    ) : (
                      filteredApplicants.map((a) => (
                        <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-2.5 font-medium text-gray-800">{a.fullName}</td>
                          <td className="px-3 py-2.5 text-gray-600">
                            <div className="max-w-[120px] truncate">{a.jobTitle}</div>
                            <div className="text-[10px] text-gray-400">{a.tender}</div>
                          </td>
                          <td className="px-3 py-2.5 text-gray-600">{a.qualification || "—"}</td>
                          <td className="px-3 py-2.5">
                            {a.resumeUrl ? (
                              <a href={a.resumeUrl} target="_blank" rel="noreferrer">
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                              </a>
                            ) : (
                              <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                              </svg>
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            {editingId === a._id ? (
                              <select
                                defaultValue={a.applicationStatus}
                                onChange={(e) => handleStatusChange(a._id, e.target.value)}
                                onBlur={() => setEditingId(null)}
                                className="text-xs border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-[#f59e0b]"
                                autoFocus
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="SELECTED">SELECTED</option>
                                <option value="SHORTLISTED">SHORTLISTED</option>
                                <option value="REJECTED">REJECTED</option>
                              </select>
                            ) : (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusColors[a.applicationStatus]}`}>
                                {a.applicationStatus}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingId(editingId === a._id ? null : a._id)}
                                className="text-gray-400 hover:text-[#1a2744] transition-colors"
                                title="Edit status"
                              >
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDelete(a._id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="Delete applicant"
                              >
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#1a2744] text-sm uppercase tracking-wide">Vacancy Performance</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">Job</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">Total Vacancies</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">Last Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {statsLoading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-400">Loading…</td>
                    </tr>
                  ) : vacancies.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                        No jobs posted yet.{" "}
                        <a href="/admin/post-job" className="text-[#1a2744] underline">Post a job</a>
                      </td>
                    </tr>
                  ) : (
                    vacancies.map((v) => (
                      <tr key={v._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-800 font-medium">{v.title}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 font-semibold">{v.vacancies}</span>
                            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-[#1a2744] rounded-full" style={{ width: "100%" }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{v.lastDate || "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${v.isActive ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>
                            {v.isActive ? "OPEN" : "CLOSED"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between">
      <div>
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-extrabold text-[#1a2744]">{value}</p>
        <div className="mt-2 h-0.5 w-12 bg-[#f59e0b] rounded" />
      </div>
      <div className="shrink-0">{icon}</div>
    </div>
  );
}
