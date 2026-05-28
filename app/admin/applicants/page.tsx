"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

type Applicant = {
  _id: string;
  fullName: string;
  jobTitle: string;
  tender: string;
  qualification: string;
  experience: number;
  submissionDate: string;
  resumeUrl: string;
  applicationStatus: "PENDING" | "SELECTED" | "SHORTLISTED" | "REJECTED";
  email: string;
  mobile: string;
  photoUrl: string;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:     "bg-[#f59e0b] text-white",
  SELECTED:    "bg-green-500 text-white",
  SHORTLISTED: "bg-blue-500 text-white",
  REJECTED:    "bg-red-500 text-white",
};

const ROWS_OPTIONS = [5, 10, 15, 20];

export default function ApplicantManagement() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => { if (window.innerWidth < 768) setSidebarOpen(false); }, []);
  const [data, setData] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [nameFilter, setNameFilter]     = useState("");
  const [jobFilter, setJobFilter]       = useState("");
  const [tenderFilter, setTenderFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [pendingName, setPendingName]     = useState("");
  const [pendingJob, setPendingJob]       = useState("");
  const [pendingTender, setPendingTender] = useState("All");
  const [pendingStatus, setPendingStatus] = useState("All");

  const [page, setPage]           = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected]   = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [batchOpen, setBatchOpen] = useState(false);
  const [rowsOpen, setRowsOpen]   = useState(false);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "All") params.set("status", statusFilter);
      if (tenderFilter !== "All") params.set("tender", tenderFilter);
      if (nameFilter) params.set("search", nameFilter);

      const res = await fetch(`/api/applications?${params.toString()}`, {
        });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setData(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, tenderFilter, nameFilter]);

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) {
      router.push("/admin/login");
      return;
    }
    fetchApplicants();
  }, [router, fetchApplicants]);

  const filtered = useMemo(() => {
    return data.filter((a) => {
      const matchJob = !jobFilter || a.jobTitle.toLowerCase().includes(jobFilter.toLowerCase());
      return matchJob;
    });
  }, [data, jobFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated  = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleFilter = () => {
    setNameFilter(pendingName);
    setJobFilter(pendingJob);
    setTenderFilter(pendingTender);
    setStatusFilter(pendingStatus);
    setPage(1);
    setSelected([]);
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationStatus: status }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setData((prev) => prev.map((a) => a._id === id ? { ...a, applicationStatus: status as Applicant["applicationStatus"] } : a));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Status update failed");
    }
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setData((prev) => prev.filter((a) => a._id !== id));
      setSelected((prev) => prev.filter((s) => s !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    const ids = paginated.map((a) => a._id);
    const allSel = ids.every((id) => selected.includes(id));
    setSelected(allSel ? selected.filter((s) => !ids.includes(s)) : [...new Set([...selected, ...ids])]);
  };

  const batchAction = async (action: string) => {
    if (selected.length === 0) { setBatchOpen(false); return; }
    try {
      if (action === "delete") {
        const res = await fetch("/api/applications/bulk", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selected }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setData((prev) => prev.filter((a) => !selected.includes(a._id)));
        setSelected([]);
      } else {
        const res = await fetch("/api/applications/bulk", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selected, applicationStatus: action }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setData((prev) => prev.map((a) => selected.includes(a._id) ? { ...a, applicationStatus: action as Applicant["applicationStatus"] } : a));
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Batch action failed");
    }
    setBatchOpen(false);
  };

  const pageNums = () => {
    const nums: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) nums.push(i);
    } else {
      nums.push(1);
      if (page > 3) nums.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) nums.push(i);
      if (page < totalPages - 2) nums.push("...");
      nums.push(totalPages);
    }
    return nums;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]">
      {sidebarOpen && <AdminSidebar activePage="applicants" onClose={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-5 overflow-auto">
          <div className="mb-5">
            <h1 className="text-xl font-extrabold text-[#1a2744] tracking-wide uppercase">
              Applicant Management - Tender-Based Search
            </h1>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[180px]">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Applicant Name</label>
                <input
                  type="text"
                  placeholder="Applicant Name"
                  value={pendingName}
                  onChange={(e) => setPendingName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]"
                />
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Job Title</label>
                <div className="relative">
                  <select
                    value={pendingJob}
                    onChange={(e) => setPendingJob(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#f59e0b] appearance-none bg-white pr-8"
                  >
                    <option value="">(e.g., Senior Civil Engineer)</option>
                    <option value="Senior">Senior Civil Engineer</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Safety Officer">Safety Officer</option>
                    <option value="Site Engineer">Site Engineer</option>
                  </select>
                  <svg className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                </div>
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Tender</label>
                <div className="relative">
                  <select
                    value={pendingTender}
                    onChange={(e) => setPendingTender(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#f59e0b] appearance-none bg-white pr-8"
                  >
                    <option value="All">PWD, NHAI, Metro</option>
                    <option value="PWD">PWD</option>
                    <option value="NHAI">NHAI</option>
                    <option value="Metro">Metro</option>
                  </select>
                  <svg className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                </div>
              </div>

              <div className="flex-1 min-w-[160px]">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Application Status</label>
                <div className="relative">
                  <select
                    value={pendingStatus}
                    onChange={(e) => setPendingStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#f59e0b] appearance-none bg-white pr-8"
                  >
                    <option value="All">All</option>
                    <option value="PENDING">All Pending</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="SELECTED">Selected</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                  <svg className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                </div>
              </div>

              <button
                onClick={handleFilter}
                className="bg-[#c8860a] hover:bg-[#a86e08] text-white font-bold px-5 py-2 rounded text-xs tracking-wider transition-colors whitespace-nowrap"
              >
                FILTER APPLICANTS
              </button>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="relative">
                <button
                  onClick={() => { setBatchOpen(!batchOpen); setRowsOpen(false); }}
                  className="flex items-center gap-1.5 border border-gray-300 rounded px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batch Actions
                  <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                </button>
                {batchOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20 min-w-[160px]">
                    <button onClick={() => batchAction("SELECTED")}    className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-green-600 font-semibold">Mark as Selected</button>
                    <button onClick={() => batchAction("SHORTLISTED")} className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-blue-600 font-semibold">Mark as Shortlisted</button>
                    <button onClick={() => batchAction("PENDING")}     className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-yellow-600 font-semibold">Mark as Pending</button>
                    <button onClick={() => batchAction("REJECTED")}    className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-red-600 font-semibold">Mark as Rejected</button>
                    <div className="border-t border-gray-100" />
                    <button onClick={() => batchAction("delete")}      className="block w-full text-left px-4 py-2 text-xs hover:bg-red-50 text-red-600 font-semibold">Delete Selected</button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                {selected.length > 0 && (
                  <span className="text-[#1a2744] font-semibold">{selected.length} selected</span>
                )}
                <div className="relative">
                  <button
                    onClick={() => { setRowsOpen(!rowsOpen); setBatchOpen(false); }}
                    className="flex items-center gap-1 border border-gray-300 rounded px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Rows per page
                    <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                  </button>
                  {rowsOpen && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-20">
                      {ROWS_OPTIONS.map((n) => (
                        <button
                          key={n}
                          onClick={() => { setRowsPerPage(n); setPage(1); setRowsOpen(false); }}
                          className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 ${rowsPerPage === n ? "font-bold text-[#1a2744]" : "text-gray-700"}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto" onClick={() => { setBatchOpen(false); setRowsOpen(false); }}>
              <table className="w-full text-xs">
                <thead className="bg-[#1a2744] text-white">
                  <tr>
                    <th className="px-3 py-3 text-center w-8">
                      <input
                        type="checkbox"
                        checked={paginated.length > 0 && paginated.every((a) => selected.includes(a._id))}
                        onChange={toggleAll}
                        className="rounded"
                      />
                    </th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Applicant Name</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Applied Job/Tender</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Qualification</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Experience (Yrs)</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Submission Date</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Resume</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Application Status</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Status-change</th>
                    <th className="px-3 py-3 text-left font-semibold tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-10 text-center text-gray-400">
                        <div className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4 text-[#f59e0b]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Loading applicants...
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-10 text-center text-red-400 font-medium">
                        {error}
                        <button onClick={fetchApplicants} className="ml-2 text-[#c8860a] underline">Retry</button>
                      </td>
                    </tr>
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-10 text-center text-gray-400 font-medium">
                        No applicants found.
                      </td>
                    </tr>
                  ) : paginated.map((a) => (
                    <tr key={a._id} className={`hover:bg-gray-50 transition-colors ${selected.includes(a._id) ? "bg-amber-50" : ""}`}>
                      <td className="px-3 py-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={selected.includes(a._id)}
                          onChange={() => toggleSelect(a._id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <Link href={`/admin/applicants/${a._id}`} className="font-medium text-[#1a2744] hover:text-[#c8860a] hover:underline transition-colors cursor-pointer">
                          {a.fullName}
                        </Link>
                      </td>
                      <td className="px-3 py-2.5 text-gray-600">
                        <div className="max-w-[140px] truncate">{a.jobTitle}</div>
                        <div className="text-[10px] text-gray-400">{a.tender}</div>
                      </td>
                      <td className="px-3 py-2.5 text-gray-600">{a.qualification || "—"}</td>
                      <td className="px-3 py-2.5 text-gray-700 text-center font-semibold">{a.experience}</td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">
                        {new Date(a.submissionDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-3 py-2.5">
                        {a.resumeUrl ? (
                          <a href={a.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-green-600 hover:underline">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 16h8v2H8v-2zm0-4h8v2H8v-2zm0-4h5v2H8V8z" />
                            </svg>
                            <span className="text-[10px] font-semibold">View</span>
                          </a>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            <span className="text-[10px]">Missing</span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_COLORS[a.applicationStatus]}`}>
                          {a.applicationStatus}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        {editingId === a._id ? (
                          <select
                            defaultValue={a.applicationStatus}
                            onChange={(e) => handleStatusChange(a._id, e.target.value)}
                            onBlur={() => setEditingId(null)}
                            className="text-xs border border-[#f59e0b] rounded px-1.5 py-1 focus:outline-none bg-white"
                            autoFocus
                          >
                            <option value="PENDING">Pending</option>
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="SELECTED">Selected</option>
                            <option value="REJECTED">Rejected</option>
                          </select>
                        ) : (
                          <button
                            onClick={() => setEditingId(a._id)}
                            className="flex items-center gap-1 border border-gray-300 rounded px-2 py-1 text-[10px] font-semibold text-gray-700 hover:border-[#f59e0b] hover:text-[#1a2744] transition-colors whitespace-nowrap"
                          >
                            Status chng
                            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
                          </button>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          {a.photoUrl && (
                            <a href={a.photoUrl} target="_blank" rel="noreferrer" title="View Photo" className="text-gray-400 hover:text-[#1a2744] transition-colors">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                              </svg>
                            </a>
                          )}
                          <a href={`mailto:${a.email}`} title="Send Email" className="text-gray-400 hover:text-blue-500 transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                          </a>
                          <button
                            title="Delete"
                            onClick={() => handleDelete(a._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
              <div className="text-xs text-gray-500">
                Showing {filtered.length === 0 ? 0 : (page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, filtered.length)} of {filtered.length}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  &lt; Previous
                </button>

                {pageNums().map((n, i) =>
                  n === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 py-1 text-xs text-gray-400">...</span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setPage(n as number)}
                      className={`w-7 h-7 text-xs rounded transition-colors ${page === n ? "bg-[#1a2744] text-white font-bold" : "border border-gray-300 hover:bg-gray-100 text-gray-700"}`}
                    >
                      {n}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
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
