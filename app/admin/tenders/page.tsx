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

  const emptyEditT = { projectName: "", clientDept: "NHAI", tenderRef: "", totalJobs: "", startDate: "", endDate: "", status: "ACTIVE" as Project["status"] };
  const [editProject,  setEditProject]  = useState<Project | null>(null);
  const [editFormT,    setEditFormT]    = useState(emptyEditT);
  const [tenderDepts,  setTenderDepts]  = useState<string[]>([]);
  const [editCustomDept, setEditCustomDept] = useState("");
  const [editErrorT,   setEditErrorT]   = useState("");
  const [savingT,      setSavingT]      = useState(false);

  const openEditTender = (p: Project) => {
    const isCustom = !["NHAI","PWD","Metro","CPWD","Railways","MES","DMRC"].includes(p.clientDept);
    setEditFormT({
      projectName: p.projectName || "",
      clientDept:  isCustom ? "__custom__" : p.clientDept,
      tenderRef:   p.tenderRef  || "",
      totalJobs:   String(p.totalJobs ?? ""),
      startDate:   p.startDate  || "",
      endDate:     p.endDate    || "",
      status:      p.status     || "ACTIVE",
    });
    setEditCustomDept(isCustom ? p.clientDept : "");
    setEditErrorT("");
    setEditProject(p);
  };

  const handleEditSaveTender = async () => {
    if (!editProject) return;
    if (!editFormT.projectName.trim()) { setEditErrorT("Project name is required."); return; }
    const effectiveDept = editFormT.clientDept === "__custom__" ? editCustomDept.trim() : editFormT.clientDept;
    if (!effectiveDept) { setEditErrorT("Client department is required."); return; }
    setSavingT(true);
    setEditErrorT("");
    try {
      const res = await fetch(`/api/tenders/${editProject._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: editFormT.projectName.trim(),
          clientDept:  effectiveDept,
          tenderRef:   editFormT.tenderRef.trim(),
          totalJobs:   Number(editFormT.totalJobs) || 0,
          startDate:   editFormT.startDate,
          endDate:     editFormT.endDate,
          status:      editFormT.status,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Update failed");
      setData((prev) => prev.map((t) => t._id === editProject._id
        ? { ...t, projectName: editFormT.projectName.trim(), clientDept: effectiveDept, tenderRef: editFormT.tenderRef.trim(), totalJobs: Number(editFormT.totalJobs) || 0, startDate: editFormT.startDate, endDate: editFormT.endDate, status: editFormT.status }
        : t
      ));
      setEditProject(null);
    } catch (e) {
      setEditErrorT(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSavingT(false);
    }
  };

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
    fetch("/api/departments?type=tender")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data)) {
          setTenderDepts(d.data.map((dep: { name: string }) => dep.name));
        }
      })
      .catch(() => {});
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

  const efCls = "w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]";

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]" onClick={() => { setBatchOpen(false); setRowsOpen(false); }}>

      {/* Edit Tender Modal */}
      {editProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditProject(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-[#1a2744] text-sm uppercase tracking-wide">Edit Project / Tender</h2>
              <button onClick={() => setEditProject(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Project Name *</label>
                <input value={editFormT.projectName} onChange={(e) => setEditFormT((f) => ({ ...f, projectName: e.target.value }))} className={efCls} placeholder="e.g. NHAI Highway Phase-5" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Client Department</label>
                <select value={editFormT.clientDept} onChange={(e) => { setEditFormT((f) => ({ ...f, clientDept: e.target.value })); if (e.target.value !== "__custom__") setEditCustomDept(""); }} className={efCls}>
                  {(tenderDepts.length > 0 ? tenderDepts : ["NHAI","PWD","Metro","CPWD","Railways","MES","DMRC"]).map((d) => <option key={d}>{d}</option>)}
                  <option value="__custom__">✏️ Other (Custom)</option>
                </select>
                {editFormT.clientDept === "__custom__" && (
                  <input type="text" placeholder="Department naam type karo..." value={editCustomDept} onChange={(e) => setEditCustomDept(e.target.value)} className={`${efCls} mt-2`} autoFocus />
                )}
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Tender Ref #</label>
                <input value={editFormT.tenderRef} onChange={(e) => setEditFormT((f) => ({ ...f, tenderRef: e.target.value }))} className={efCls} placeholder="e.g. 22708100" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Total Jobs</label>
                <input type="number" min={0} value={editFormT.totalJobs} onChange={(e) => setEditFormT((f) => ({ ...f, totalJobs: e.target.value }))} className={efCls} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Status</label>
                <select value={editFormT.status} onChange={(e) => setEditFormT((f) => ({ ...f, status: e.target.value as Project["status"] }))} className={efCls}>
                  <option value="ACTIVE">Active</option>
                  <option value="CLOSED">Closed</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Start Date</label>
                <input type="date" value={editFormT.startDate} onChange={(e) => setEditFormT((f) => ({ ...f, startDate: e.target.value }))} className={efCls} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">End Date</label>
                <input type="date" value={editFormT.endDate} onChange={(e) => setEditFormT((f) => ({ ...f, endDate: e.target.value }))} className={efCls} />
              </div>
            </div>
            {editErrorT && <p className="px-6 pb-2 text-red-500 text-xs">{editErrorT}</p>}
            <div className="flex gap-3 px-6 pb-5">
              <button onClick={handleEditSaveTender} disabled={savingT}
                className="bg-[#1a2744] hover:bg-[#243560] disabled:opacity-60 text-white font-bold px-6 py-2 rounded text-xs tracking-wider transition-colors">
                {savingT ? "Saving…" : "SAVE CHANGES"}
              </button>
              <button onClick={() => setEditProject(null)} className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-5 py-2 rounded text-xs">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
                    {(tenderDepts.length > 0 ? tenderDepts : ["NHAI","PWD","Metro","CPWD","Railways","MES","DMRC"]).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
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
                    {(tenderDepts.length > 0 ? tenderDepts : ["NHAI","PWD","Metro","CPWD","Railways","MES","DMRC"]).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
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
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditTender(p)}
                            title="Edit"
                            className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold px-2.5 py-1.5 rounded text-[10px] transition-colors border border-blue-200"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              const next = p.status === "ACTIVE" ? "CLOSED" : "ACTIVE";
                              await fetch(`/api/tenders/${p._id}`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ status: next }),
                              });
                              setData((prev) => prev.map((t) => t._id === p._id ? { ...t, status: next } : t));
                            }}
                            title={p.status === "ACTIVE" ? "Mark Closed" : "Mark Active"}
                            className={`flex items-center gap-1 font-semibold px-2.5 py-1.5 rounded text-[10px] transition-colors border ${p.status === "ACTIVE" ? "bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200" : "bg-green-50 hover:bg-green-100 text-green-600 border-green-200"}`}
                          >
                            {p.status === "ACTIVE" ? (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                            ) : (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                            )}
                            {p.status === "ACTIVE" ? "Close" : "Open"}
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            title="Delete"
                            className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-500 font-semibold px-2.5 py-1.5 rounded text-[10px] transition-colors border border-red-200"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                            Del
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
