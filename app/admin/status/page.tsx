"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

type AppStatus = "PENDING" | "SHORTLISTED" | "SELECTED" | "REJECTED";

type ApplicationRecord = {
  _id: string;
  fullName: string;
  jobTitle: string;
  tender: string;
  applicationStatus: AppStatus;
  submissionDate: string;
  email: string;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:     "bg-[#f59e0b] text-white",
  SHORTLISTED: "bg-green-500 text-white",
  SELECTED:    "bg-green-600 text-white",
  REJECTED:    "bg-red-500 text-white",
};

const ALL_STATUSES: AppStatus[] = ["PENDING", "SHORTLISTED", "SELECTED", "REJECTED"];

const BULK_ACTIONS = [
  { label: "Shortlist Selected",        value: "SHORTLISTED" },
  { label: "Reject Selected",           value: "REJECTED" },
  { label: "Change Status to Selected", value: "SELECTED" },
  { label: "Mark as Pending",           value: "PENDING" },
];

const ROWS_OPTIONS = [10, 25, 50];

export default function StatusManagement() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => { if (window.innerWidth < 768) setSidebarOpen(false); }, []);
  const [data, setData] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pendingTender, setPendingTender] = useState("All");
  const [pendingRole,   setPendingRole]   = useState("");
  const [pendingName,   setPendingName]   = useState("");
  const [pendingStatus, setPendingStatus] = useState<AppStatus | "All">("All");

  const [tenderFilter, setTenderFilter] = useState("All");
  const [roleFilter,   setRoleFilter]   = useState("");
  const [nameFilter,   setNameFilter]   = useState("");
  const [statusFilter, setStatusFilter] = useState<AppStatus | "All">("All");

  const [selected, setSelected]   = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState(BULK_ACTIONS[0]);
  const [bulkOpen, setBulkOpen]   = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [rowsOpen, setRowsOpen]   = useState(false);
  const [page, setPage]           = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "All") params.set("status", statusFilter);
      if (nameFilter) params.set("search", nameFilter);
      if (tenderFilter !== "All") params.set("tender", tenderFilter);

      const res = await fetch(`/api/applications?${params.toString()}`, {
        });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setData(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, nameFilter, tenderFilter]);

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) { router.push("/admin/login"); return; }
    fetchData();
  }, [router, fetchData]);

  const filtered = useMemo(() => data.filter((r) => {
    const matchRole   = !roleFilter || r.jobTitle.toLowerCase().includes(roleFilter.toLowerCase());
    const matchStatus = statusFilter === "All" || r.applicationStatus === statusFilter;
    return matchRole && matchStatus;
  }), [data, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated  = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const counts = {
    total:       data.length,
    selected:    data.filter((r) => r.applicationStatus === "SELECTED").length,
    shortlisted: data.filter((r) => r.applicationStatus === "SHORTLISTED").length,
    pending:     data.filter((r) => r.applicationStatus === "PENDING").length,
  };

  const handleApplyFilter = () => {
    setTenderFilter(pendingTender);
    setRoleFilter(pendingRole);
    setNameFilter(pendingName);
    setStatusFilter(pendingStatus);
    setPage(1);
    setSelected([]);
  };

  const handleStatusChange = async (id: string, status: AppStatus) => {
    try {
      await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationStatus: status }),
      });
      setData((prev) => prev.map((r) => r._id === id ? { ...r, applicationStatus: status } : r));
    } catch { /* silent */ }
  };

  const executeBulk = async () => {
    if (selected.length === 0) return;
    const newStatus = bulkAction.value;
    try {
      const res = await fetch("/api/applications/bulk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected, applicationStatus: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setData((prev) => prev.map((r) => selected.includes(r._id) ? { ...r, applicationStatus: newStatus as AppStatus } : r));
        setSelected([]);
      }
    } catch { /* silent */ }
    setBulkOpen(false);
  };

  const toggleSelect = (id: string) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const toggleAll = () => {
    const ids = paginated.map((r) => r._id);
    const allSel = ids.every((id) => selected.includes(id));
    setSelected(allSel ? selected.filter((s) => !ids.includes(s)) : [...new Set([...selected, ...ids])]);
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
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]" onClick={() => { setBulkOpen(false); setRowsOpen(false); }}>
      {sidebarOpen && <AdminSidebar activePage="status" onClose={() => setSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-5 overflow-auto">
          <div className="mb-5">
            <h1 className="text-xl font-extrabold text-[#1a2744] tracking-wide uppercase">
              Status &amp; Applications Management - Workflow Control
            </h1>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Filter by Tender</label>
                <input type="text" placeholder="PWD, NHAI, Metro" value={pendingTender === "All" ? "" : pendingTender}
                  onChange={(e) => setPendingTender(e.target.value || "All")}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]" />
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Job Role</label>
                <input type="text" placeholder="e.g. Engineer, Manager" value={pendingRole}
                  onChange={(e) => setPendingRole(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]" />
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Candidate Name</label>
                <input type="text" placeholder="Candidate Name" value={pendingName}
                  onChange={(e) => setPendingName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]" />
              </div>
              <div className="flex-1 min-w-[160px]">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Application Status</label>
                <div className="relative">
                  <select value={pendingStatus} onChange={(e) => setPendingStatus(e.target.value as AppStatus | "All")}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#f59e0b] appearance-none bg-white pr-8">
                    <option value="All">All Statuses</option>
                    {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <svg className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                </div>
              </div>
              <button onClick={handleApplyFilter}
                className="bg-[#c8860a] hover:bg-[#a86e08] text-white font-bold px-4 py-2 rounded text-xs tracking-wider transition-colors whitespace-nowrap">
                APPLY FILTERS
              </button>
            </div>
          </div>

          {/* Bulk Action Center + Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="bg-[#c8860a] rounded-lg p-4">
              <h2 className="font-extrabold text-white text-sm uppercase tracking-wide mb-3">Bulk Action Center</h2>
              <div className="flex items-center gap-3">
                <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setBulkOpen(!bulkOpen)}
                    className="flex items-center justify-between w-full bg-white border border-gray-300 rounded px-3 py-2 text-xs font-semibold text-gray-700">
                    {bulkAction.label}
                    <svg className="w-3 h-3 text-gray-500 ml-2 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                  </button>
                  {bulkOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 min-w-full">
                      {BULK_ACTIONS.map((a) => (
                        <button key={a.value} onClick={() => { setBulkAction(a); setBulkOpen(false); }}
                          className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 ${bulkAction.value === a.value ? "font-bold text-[#c8860a]" : "text-gray-700"}`}>
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={executeBulk}
                  className="bg-[#1a2744] hover:bg-[#243560] text-white font-bold px-4 py-2 rounded text-xs tracking-wider transition-colors whitespace-nowrap">
                  EXECUTE
                </button>
              </div>
              {selected.length > 0 && (
                <p className="text-white text-xs mt-2 font-semibold">{selected.length} candidate(s) selected</p>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3">
              <StatBox label="Total Candidates" value={loading ? "…" : counts.total.toLocaleString("en-IN")} color="text-[#1a2744]" />
              <StatBox label="Selected"         value={loading ? "…" : counts.selected.toString()}    color="text-green-600" />
              <StatBox label="Shortlisted"      value={loading ? "…" : counts.shortlisted.toString()} color="text-blue-600" />
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Pending Reviews</p>
                <p className="text-xl font-extrabold text-[#c8860a] mt-0.5">{loading ? "…" : counts.pending.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {error && <div className="px-4 py-3 text-red-600 text-xs bg-red-50 border-b border-red-100">{error}</div>}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-[#1a2744] text-white">
                  <tr>
                    <th className="px-3 py-3 text-center w-8">
                      <input type="checkbox"
                        checked={paginated.length > 0 && paginated.every((r) => selected.includes(r._id))}
                        onChange={toggleAll} className="rounded" />
                    </th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Candidate Name</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Applied Role</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Associated Tender</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Application ID</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Submission Date</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Current Status</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">Loading applications…</td></tr>
                  ) : paginated.length === 0 ? (
                    <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">No records match the filters.</td></tr>
                  ) : paginated.map((r) => (
                    <tr key={r._id} className={`hover:bg-gray-50 transition-colors ${selected.includes(r._id) ? "bg-amber-50" : ""}`}>
                      <td className="px-3 py-2.5 text-center">
                        <input type="checkbox" checked={selected.includes(r._id)} onChange={() => toggleSelect(r._id)} className="rounded" />
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <Link href={`/admin/candidates/${r._id}`}
                          className="font-medium text-[#1a2744] hover:text-[#f59e0b] hover:underline transition-colors cursor-pointer">
                          {r.fullName}
                        </Link>
                      </td>
                      <td className="px-3 py-2.5 text-gray-600">{r.jobTitle}</td>
                      <td className="px-3 py-2.5 font-mono text-gray-600">{r.tender}</td>
                      <td className="px-3 py-2.5 font-mono text-gray-500 text-[10px]">{r._id.slice(-8).toUpperCase()}</td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">
                        {r.submissionDate ? new Date(r.submissionDate).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_COLORS[r.applicationStatus] || "bg-gray-100 text-gray-700"}`}>
                          {r.applicationStatus}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <select
                            value={r.applicationStatus}
                            onChange={(e) => handleStatusChange(r._id, e.target.value as AppStatus)}
                            className="text-[10px] border border-gray-300 rounded px-1.5 py-1 focus:outline-none focus:border-[#f59e0b] bg-white text-gray-700"
                          >
                            {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2 text-xs text-gray-600" onClick={(e) => e.stopPropagation()}>
                <span>Rows per page:</span>
                <div className="relative">
                  <button onClick={() => setRowsOpen(!rowsOpen)}
                    className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 font-semibold bg-white text-gray-700">
                    {rowsPerPage}
                    <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                  </button>
                  {rowsOpen && (
                    <div className="absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded shadow-lg z-20">
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
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
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
                  className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
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

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
      <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">{label}</p>
      <p className={`text-xl font-extrabold mt-0.5 ${color}`}>{value}</p>
    </div>
  );
}
