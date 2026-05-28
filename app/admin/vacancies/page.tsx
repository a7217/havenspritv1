"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

function formatMonthly(salaryFull: string): string {
  if (!salaryFull) return "—";
  const amounts = [...salaryFull.matchAll(/(\d+),(\d{2}),(\d{3})/g)];
  if (amounts.length > 0) {
    const monthly = amounts.map((m) => Math.round((parseInt(m[1]) * 100000 + parseInt(m[2]) * 1000 + parseInt(m[3])) / 12));
    const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");
    return monthly.length >= 2 ? `${fmt(monthly[0])} – ${fmt(monthly[1])}/month` : `${fmt(monthly[0])}/month`;
  }
  const lakh = salaryFull.match(/(\d+)\s*(?:lakh|lac|L)/i);
  if (lakh) return "₹" + Math.round(parseInt(lakh[1]) * 100000 / 12).toLocaleString("en-IN") + "/month";
  return salaryFull;
}

type VacancyJob = {
  _id: string;
  title: string;
  project: string;
  location: string;
  department: string;
  vacancies: number;
  salaryFull: string;
  lastDate: string;
  isActive: boolean;
};

const STATUS_COLORS: Record<string, string> = {
  OPEN:   "bg-green-500 text-white",
  CLOSED: "bg-gray-500 text-white",
};

const ROWS_OPTIONS = [5, 10, 15, 20];

export default function VacanciesManagement() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => { if (window.innerWidth < 768) setSidebarOpen(false); }, []);
  const [data, setData] = useState<VacancyJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const [pendingTitle,  setPendingTitle]  = useState("");
  const [pendingDept,   setPendingDept]   = useState("All");
  const [pendingLoc,    setPendingLoc]    = useState("All");

  const [titleFilter,  setTitleFilter]   = useState("");
  const [deptFilter,   setDeptFilter]    = useState("All");
  const [locFilter,    setLocFilter]     = useState("All");

  const [page, setPage]               = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsOpen, setRowsOpen]       = useState(false);
  const [tooltipId, setTooltipId]     = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/jobs", { });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setData(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) { router.push("/admin/login"); return; }
    fetchJobs();
  }, [router, fetchJobs]);

  const filtered = useMemo(() => {
    return data.filter((v) => {
      const matchTitle  = !titleFilter || v.title.toLowerCase().includes(titleFilter.toLowerCase());
      const matchDept   = deptFilter === "All" || v.department === deptFilter;
      const matchLoc    = locFilter  === "All" || v.location.toLowerCase().includes(locFilter.toLowerCase());
      return matchTitle && matchDept && matchLoc;
    });
  }, [data, titleFilter, deptFilter, locFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated  = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const activeCount  = data.filter((v) => v.isActive).length;
  const closedCount  = data.filter((v) => !v.isActive).length;

  const handleFilter = () => {
    setTitleFilter(pendingTitle);
    setDeptFilter(pendingDept);
    setLocFilter(pendingLoc);
    setPage(1);
  };

  const handleStatusToggle = async (id: string, current: boolean) => {
    setTooltipId(null);
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      const json = await res.json();
      if (json.success) {
        setData((prev) => prev.map((v) => v._id === id ? { ...v, isActive: !current } : v));
      }
    } catch { /* silent */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this job vacancy?")) return;
    try {
      await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      setData((prev) => prev.filter((v) => v._id !== id));
    } catch { /* silent */ }
  };

  const pageNums = () => {
    const nums: (number | "...")[] = [];
    if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) nums.push(i); }
    else {
      nums.push(1);
      if (page > 3) nums.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) nums.push(i);
      if (page < totalPages - 2) nums.push("...");
      nums.push(totalPages);
    }
    return nums;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]" onClick={() => { setRowsOpen(false); setTooltipId(null); }}>
      {sidebarOpen && <AdminSidebar activePage="vacancies" topButton={{ label: "POST NEW JOB", href: "/admin/post-job" }} onClose={() => setSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-5 overflow-auto">
          <div className="mb-5">
            <h1 className="text-xl font-extrabold text-[#1a2744] tracking-wide uppercase">
              Vacancies Management - Job Postings
            </h1>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[180px]">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Job Title</label>
                <input type="text" placeholder="Search job title" value={pendingTitle}
                  onChange={(e) => setPendingTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]" />
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Department</label>
                <div className="relative">
                  <select value={pendingDept} onChange={(e) => setPendingDept(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#f59e0b] appearance-none bg-white pr-8">
                    <option value="All">All Departments</option>
                    <option value="Government">Government</option>
                    <option value="Environmental">Environmental</option>
                    <option value="Communication">Communication</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Finance">Finance</option>
                  </select>
                  <svg className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                </div>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Location</label>
                <div className="relative">
                  <select value={pendingLoc} onChange={(e) => setPendingLoc(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#f59e0b] appearance-none bg-white pr-8">
                    <option value="All">All Locations</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Noida">Noida</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Gurgaon">Gurgaon</option>
                  </select>
                  <svg className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                </div>
              </div>
              <button onClick={handleFilter}
                className="bg-[#c8860a] hover:bg-[#a86e08] text-white font-bold px-5 py-2 rounded text-xs tracking-wider transition-colors whitespace-nowrap">
                FILTER VACANCIES
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-xs text-gray-500">{data.length} total vacancies</span>
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setRowsOpen(!rowsOpen)}
                  className="flex items-center gap-1 border border-gray-300 rounded px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Rows per page
                  <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                </button>
                {rowsOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20">
                    {ROWS_OPTIONS.map((n) => (
                      <button key={n} onClick={() => { setRowsPerPage(n); setPage(1); setRowsOpen(false); }}
                        className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 ${rowsPerPage === n ? "font-bold text-[#1a2744]" : "text-gray-700"}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {error && <div className="px-4 py-3 text-red-600 text-xs bg-red-50">{error}</div>}

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-[#1a2744] text-white">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Job Title</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Associated Project</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Department</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Location</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Total Vacancies</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Salary Range</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Last Date</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Status</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-400">Loading vacancies…</td></tr>
                  ) : paginated.length === 0 ? (
                    <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-400">No vacancies found. <a href="/admin/post-job" className="text-[#1a2744] underline">Post a new job</a></td></tr>
                  ) : paginated.map((v) => (
                    <tr key={v._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2.5 font-medium text-gray-800">{v.title}</td>
                      <td className="px-3 py-2.5 text-gray-600 max-w-[150px] truncate">{v.project}</td>
                      <td className="px-3 py-2.5 text-gray-600">{v.department}</td>
                      <td className="px-3 py-2.5 text-gray-600">{v.location}</td>
                      <td className="px-3 py-2.5 text-gray-700 text-center font-semibold">{v.vacancies}</td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{formatMonthly(v.salaryFull || "")}</td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{v.lastDate || "—"}</td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_COLORS[v.isActive ? "OPEN" : "CLOSED"]}`}>
                          {v.isActive ? "OPEN" : "CLOSED"}
                        </span>
                      </td>
                      <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2 relative">
                          <div className="relative">
                            <button onClick={() => setTooltipId(tooltipId === v._id ? null : v._id)}
                              title="More actions" className="text-gray-400 hover:text-[#1a2744] transition-colors">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                            </button>
                            {tooltipId === v._id && (
                              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-30 min-w-[170px]">
                                <button onClick={() => handleStatusToggle(v._id, v.isActive)}
                                  className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-gray-700 font-semibold whitespace-nowrap">
                                  {v.isActive ? "Close Posting" : "Open Posting"}
                                </button>
                              </div>
                            )}
                          </div>
                          <button onClick={() => handleDelete(v._id)} title="Delete" className="text-gray-400 hover:text-red-500 transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50 gap-2">
              <div className="flex items-center gap-4 text-xs text-gray-600 font-medium">
                <span>Active Jobs ({activeCount})</span>
                <span>Closed Jobs ({closedCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
                  &lt; Previous
                </button>
                {pageNums().map((n, i) =>
                  n === "..." ? <span key={`e${i}`} className="px-2 py-1 text-xs text-gray-400">...</span> : (
                    <button key={n} onClick={() => setPage(n as number)}
                      className={`w-7 h-7 text-xs rounded transition-colors ${page === n ? "bg-[#1a2744] text-white font-bold" : "border border-gray-300 hover:bg-gray-100 text-gray-700"}`}>
                      {n}
                    </button>
                  )
                )}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
