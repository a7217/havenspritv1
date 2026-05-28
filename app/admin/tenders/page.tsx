"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

type Project = {
  _id: string;
  projectId: string;
  projectName: string;
  clientDept: string;
  tenderRef: string;
  totalJobs: number;
  jobsFilled: number;
  activeVacancies: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "CLOSED" | "ARCHIVED";
  tendersManaged: number;
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:   "bg-green-500 text-white",
  CLOSED:   "bg-gray-500 text-white",
  ARCHIVED: "bg-blue-500 text-white",
};

const ROWS_OPTIONS = [5, 10, 15, 20];

export default function ProjectsTendersManagement() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => { if (window.innerWidth < 768) setSidebarOpen(false); }, []);
  const [data, setData]         = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating]   = useState(false);
  const [newProject, setNewProject] = useState({
    projectName: "", clientDept: "NHAI", tenderRef: "", totalJobs: "",
    startDate: "", endDate: "", status: "ACTIVE",
  });
  const [customClientDept, setCustomClientDept] = useState("");

  const [pendingName,   setPendingName]   = useState("");
  const [pendingDept,   setPendingDept]   = useState("All");
  const [pendingStatus, setPendingStatus] = useState("All");

  const [nameFilter,   setNameFilter]   = useState("");
  const [deptFilter,   setDeptFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [page, setPage]               = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected]       = useState<string[]>([]);
  const [batchOpen, setBatchOpen]     = useState(false);
  const [rowsOpen, setRowsOpen]       = useState(false);
  const [tooltipId, setTooltipId]     = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tenders", { });
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
    fetchData();
  }, [router, fetchData]);

  const filtered = useMemo(() => {
    return data.filter((p) => {
      const matchName   = !nameFilter   || p.projectName.toLowerCase().includes(nameFilter.toLowerCase()) || p.projectId?.includes(nameFilter);
      const matchDept   = deptFilter === "All"   || p.clientDept === deptFilter;
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      return matchName && matchDept && matchStatus;
    });
  }, [data, nameFilter, deptFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated  = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleFilter = () => {
    setNameFilter(pendingName);
    setDeptFilter(pendingDept);
    setStatusFilter(pendingStatus);
    setPage(1);
    setSelected([]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project/tender?")) return;
    try {
      await fetch(`/api/tenders/${id}`, { method: "DELETE" });
      setData((prev) => prev.filter((p) => p._id !== id));
      setSelected((prev) => prev.filter((s) => s !== id));
    } catch { /* silent */ }
  };

  const toggleSelect = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const toggleAll = () => {
    const ids = paginated.map((p) => p._id);
    const allSel = ids.every((id) => selected.includes(id));
    setSelected(allSel ? selected.filter((s) => !ids.includes(s)) : [...new Set([...selected, ...ids])]);
  };

  const batchAction = async (action: string) => {
    if (selected.length === 0) { setBatchOpen(false); return; }
    try {
      if (action === "delete") {
        await fetch("/api/tenders/bulk", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selected }),
        });
        setData((prev) => prev.filter((p) => !selected.includes(p._id)));
        setSelected([]);
      } else {
        await fetch("/api/tenders/bulk", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selected, status: action }),
        });
        setData((prev) => prev.map((p) => selected.includes(p._id) ? { ...p, status: action as Project["status"] } : p));
      }
    } catch { /* silent */ }
    setBatchOpen(false);
  };

  const effectiveClientDept = newProject.clientDept === "__custom__"
    ? customClientDept.trim()
    : newProject.clientDept;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.projectName.trim()) return;
    if (newProject.clientDept === "__custom__" && !customClientDept.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/tenders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProject,
          clientDept: effectiveClientDept,
          totalJobs: Number(newProject.totalJobs) || 0,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setData((prev) => [json.data, ...prev]);
        setShowCreate(false);
        setCustomClientDept("");
        setNewProject({ projectName: "", clientDept: "NHAI", tenderRef: "", totalJobs: "", startDate: "", endDate: "", status: "ACTIVE" });
      }
    } catch { /* silent */ }
    setCreating(false);
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

  const inputCls = "w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]";

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]" onClick={() => { setBatchOpen(false); setRowsOpen(false); setTooltipId(null); }}>
      {sidebarOpen && <AdminSidebar activePage="tenders" topButton={{ label: "CREATE NEW PROJECT", href: "#" }} onClose={() => setSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-5 overflow-auto">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl font-extrabold text-[#1a2744] tracking-wide uppercase">
              Projects / Tenders Management
            </h1>
            <button onClick={() => setShowCreate(!showCreate)}
              className="bg-[#c8860a] hover:bg-[#a86e08] text-white font-bold px-4 py-2 rounded text-xs tracking-wider transition-colors">
              + CREATE NEW PROJECT
            </button>
          </div>

          {/* Create form */}
          {showCreate && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-5">
              <h2 className="font-bold text-[#1a2744] text-sm uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">New Project / Tender</h2>
              <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Project Name *</label>
                  <input type="text" placeholder="e.g. NHAI Highway Phase-5" value={newProject.projectName}
                    onChange={(e) => setNewProject((p) => ({ ...p, projectName: e.target.value }))} className={inputCls} required />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Client Dept</label>
                  <select
                    value={newProject.clientDept}
                    onChange={(e) => {
                      setNewProject((p) => ({ ...p, clientDept: e.target.value }));
                      if (e.target.value !== "__custom__") setCustomClientDept("");
                    }}
                    className={inputCls}
                  >
                    <option value="NHAI">NHAI</option>
                    <option value="PWD">PWD</option>
                    <option value="Metro">Metro</option>
                    <option value="CPWD">CPWD</option>
                    <option value="Railways">Railways</option>
                    <option value="MES">MES</option>
                    <option value="DMRC">DMRC</option>
                    <option value="__custom__">✏️ Other (Custom)</option>
                  </select>
                  {newProject.clientDept === "__custom__" && (
                    <input
                      type="text"
                      placeholder="Department naam type karo..."
                      value={customClientDept}
                      onChange={(e) => setCustomClientDept(e.target.value)}
                      className={`${inputCls} mt-2`}
                      autoFocus
                      required
                    />
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Tender Ref #</label>
                  <input type="text" placeholder="e.g. 22708100" value={newProject.tenderRef}
                    onChange={(e) => setNewProject((p) => ({ ...p, tenderRef: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Total Jobs</label>
                  <input type="number" min={0} placeholder="0" value={newProject.totalJobs}
                    onChange={(e) => setNewProject((p) => ({ ...p, totalJobs: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Start Date</label>
                  <input type="date" value={newProject.startDate}
                    onChange={(e) => setNewProject((p) => ({ ...p, startDate: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">End Date</label>
                  <input type="date" value={newProject.endDate}
                    onChange={(e) => setNewProject((p) => ({ ...p, endDate: e.target.value }))} className={inputCls} />
                </div>
                <div className="md:col-span-2 lg:col-span-3 flex gap-3 pt-1">
                  <button type="submit" disabled={creating}
                    className="bg-[#1a2744] hover:bg-[#243560] text-white font-bold px-6 py-2 rounded text-xs tracking-wider transition-colors disabled:opacity-60">
                    {creating ? "Creating…" : "CREATE PROJECT"}
                  </button>
                  <button type="button" onClick={() => setShowCreate(false)}
                    className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-5 py-2 rounded text-xs transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[180px]">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Project Name / ID</label>
                <input type="text" placeholder="Project Name / ID" value={pendingName}
                  onChange={(e) => setPendingName(e.target.value)} className={inputCls} />
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Client Department</label>
                <div className="relative">
                  <select value={pendingDept} onChange={(e) => setPendingDept(e.target.value)}
                    className={`${inputCls} appearance-none pr-8`}>
                    <option value="All">All Departments</option>
                    <option value="PWD">PWD</option>
                    <option value="NHAI">NHAI</option>
                    <option value="Metro">Metro</option>
                  </select>
                  <svg className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                </div>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Status</label>
                <div className="relative">
                  <select value={pendingStatus} onChange={(e) => setPendingStatus(e.target.value)}
                    className={`${inputCls} appearance-none pr-8`}>
                    <option value="All">All</option>
                    <option value="ACTIVE">Active</option>
                    <option value="CLOSED">Closed</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                  <svg className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                </div>
              </div>
              <button onClick={handleFilter}
                className="bg-[#c8860a] hover:bg-[#a86e08] text-white font-bold px-5 py-2 rounded text-xs tracking-wider transition-colors whitespace-nowrap">
                FILTER PROJECTS
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <button onClick={() => { setBatchOpen(!batchOpen); setRowsOpen(false); }}
                  className="flex items-center gap-1.5 border border-gray-300 rounded px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Batch Actions
                  <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                </button>
                {batchOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 min-w-[160px]">
                    <button onClick={() => batchAction("ACTIVE")}   className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-green-600 font-semibold">Mark as Active</button>
                    <button onClick={() => batchAction("CLOSED")}   className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-gray-600 font-semibold">Mark as Closed</button>
                    <button onClick={() => batchAction("ARCHIVED")} className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-blue-600 font-semibold">Mark as Archived</button>
                    <div className="border-t border-gray-100" />
                    <button onClick={() => batchAction("delete")}   className="block w-full text-left px-4 py-2 text-xs hover:bg-red-50 text-red-600 font-semibold">Delete Selected</button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selected.length > 0 && <span className="text-xs text-[#1a2744] font-semibold">{selected.length} selected</span>}
                <div className="relative">
                  <button onClick={() => { setRowsOpen(!rowsOpen); setBatchOpen(false); }}
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
            </div>

            {error && <div className="px-4 py-3 text-red-600 text-xs bg-red-50">{error}</div>}

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-[#1a2744] text-white">
                  <tr>
                    <th className="px-3 py-3 text-center w-8">
                      <input type="checkbox"
                        checked={paginated.length > 0 && paginated.every((p) => selected.includes(p._id))}
                        onChange={toggleAll} className="rounded" />
                    </th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Project ID</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Project Name</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Client Dept.</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Tender Ref #</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Total Jobs</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Jobs Filled</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Active Vacancies</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Start Date</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">End Date</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Status</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={12} className="px-4 py-10 text-center text-gray-400">Loading projects…</td></tr>
                  ) : paginated.length === 0 ? (
                    <tr><td colSpan={12} className="px-4 py-10 text-center text-gray-400">No projects found. Create one above.</td></tr>
                  ) : paginated.map((p) => (
                    <tr key={p._id} className={`hover:bg-gray-50 transition-colors ${selected.includes(p._id) ? "bg-amber-50" : ""}`}>
                      <td className="px-3 py-2.5 text-center">
                        <input type="checkbox" checked={selected.includes(p._id)} onChange={() => toggleSelect(p._id)} className="rounded" />
                      </td>
                      <td className="px-3 py-2.5 font-mono text-gray-700 font-semibold text-[10px]">{p.projectId || p._id.slice(-8).toUpperCase()}</td>
                      <td className="px-3 py-2.5 font-medium text-gray-800">{p.projectName}</td>
                      <td className="px-3 py-2.5">
                        <span className="bg-[#1a2744] text-white px-2 py-0.5 rounded text-[10px] font-bold">{p.clientDept}</span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-gray-600">{p.tenderRef || "—"}</td>
                      <td className="px-3 py-2.5 text-center text-gray-700 font-semibold">{p.totalJobs}</td>
                      <td className="px-3 py-2.5 text-center text-gray-700">{p.jobsFilled}</td>
                      <td className="px-3 py-2.5 text-center text-gray-700">{p.activeVacancies}</td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{p.startDate || "—"}</td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{p.endDate || "—"}</td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                      </td>
                      <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2 relative">
                          <div className="relative">
                            <button onClick={() => setTooltipId(tooltipId === p._id ? null : p._id)}
                              title="Actions" className="text-gray-400 hover:text-[#1a2744] transition-colors">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                            </button>
                            {tooltipId === p._id && (
                              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-30 min-w-[140px]">
                                <button onClick={async () => {
                                  await fetch(`/api/tenders/${p._id}`, {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ status: p.status === "ACTIVE" ? "CLOSED" : "ACTIVE" }),
                                  });
                                  setData((prev) => prev.map((t) => t._id === p._id ? { ...t, status: t.status === "ACTIVE" ? "CLOSED" : "ACTIVE" } : t));
                                  setTooltipId(null);
                                }} className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-gray-700 font-semibold">
                                  {p.status === "ACTIVE" ? "Mark Closed" : "Mark Active"}
                                </button>
                                <button onClick={async () => {
                                  await fetch(`/api/tenders/${p._id}`, {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ status: "ARCHIVED" }),
                                  });
                                  setData((prev) => prev.map((t) => t._id === p._id ? { ...t, status: "ARCHIVED" } : t));
                                  setTooltipId(null);
                                }} className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-gray-700 font-semibold">Archive</button>
                              </div>
                            )}
                          </div>
                          <button onClick={() => handleDelete(p._id)} title="Delete" className="text-gray-400 hover:text-red-500 transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
              <span className="text-xs text-gray-500">{data.length} total projects</span>
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
