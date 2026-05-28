"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

type Dept = {
  _id: string;
  name: string;
  type: "job" | "tender" | "both";
  isActive: boolean;
};

const TYPE_LABELS: Record<string, string> = {
  job:    "Job / Vacancy",
  tender: "Tender / Project",
  both:   "Both",
};

const TYPE_COLORS: Record<string, string> = {
  job:    "bg-blue-100 text-blue-700",
  tender: "bg-purple-100 text-purple-700",
  both:   "bg-green-100 text-green-700",
};

export default function DepartmentsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => { if (window.innerWidth < 768) setSidebarOpen(false); }, []);

  const [data, setData]       = useState<Dept[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const [newName, setNewName]   = useState("");
  const [newType, setNewType]   = useState<Dept["type"]>("both");
  const [adding, setAdding]     = useState(false);
  const [addError, setAddError] = useState("");

  const [editId,    setEditId]    = useState<string | null>(null);
  const [editName,  setEditName]  = useState("");
  const [editType,  setEditType]  = useState<Dept["type"]>("both");
  const [saving,    setSaving]    = useState(false);
  const [editError, setEditError] = useState("");

  const [filterType, setFilterType] = useState("all");

  const fetchDepts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("/api/departments?type=all");
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
    fetchDepts();
  }, [router, fetchDepts]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) { setAddError("Name required"); return; }
    setAdding(true);
    setAddError("");
    try {
      const res  = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), type: newType }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setData((prev) => [...prev, json.data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName("");
      setNewType("both");
    } catch (e) {
      setAddError(e instanceof Error ? e.message : "Failed to add");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (d: Dept) => {
    setEditId(d._id);
    setEditName(d.name);
    setEditType(d.type);
    setEditError("");
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) { setEditError("Name required"); return; }
    setSaving(true);
    setEditError("");
    try {
      const res  = await fetch(`/api/departments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim(), type: editType }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setData((prev) => prev.map((d) => d._id === id ? json.data : d).sort((a, b) => a.name.localeCompare(b.name)));
      setEditId(null);
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (d: Dept) => {
    try {
      const res  = await fetch(`/api/departments/${d._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !d.isActive }),
      });
      const json = await res.json();
      if (json.success) {
        setData((prev) => prev.map((x) => x._id === d._id ? json.data : x));
      }
    } catch { /* silent */ }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" department delete karna chahte ho?`)) return;
    try {
      await fetch(`/api/departments/${id}`, { method: "DELETE" });
      setData((prev) => prev.filter((d) => d._id !== id));
    } catch { /* silent */ }
  };

  const displayed = filterType === "all"
    ? data
    : data.filter((d) => d.type === filterType || d.type === "both");

  const cls = "w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]";

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]">
      {sidebarOpen && (
        <AdminSidebar activePage="departments" topButton={{ label: "POST NEW JOB", href: "/admin/post-job" }} onClose={() => setSidebarOpen(false)} />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-5 overflow-auto">
          <div className="mb-5">
            <h1 className="text-xl font-extrabold text-[#1a2744] tracking-wide uppercase">
              Departments Management
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Yahan se departments add, edit ya delete karo — yahi dropdown mein dikhenge.
            </p>
          </div>

          {/* Add New Department */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-5">
            <h2 className="font-bold text-[#1a2744] text-sm uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">
              New Department Add Karo
            </h2>
            <form onSubmit={handleAdd} className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Department Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Defence, Health, IT"
                  className={cls}
                />
              </div>
              <div className="min-w-[180px]">
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Kahan dikhega?</label>
                <select value={newType} onChange={(e) => setNewType(e.target.value as Dept["type"])} className={cls}>
                  <option value="both">Both (Jobs & Tenders)</option>
                  <option value="job">Sirf Jobs / Vacancies mein</option>
                  <option value="tender">Sirf Tenders / Projects mein</option>
                </select>
              </div>
              <button type="submit" disabled={adding}
                className="bg-[#1a2744] hover:bg-[#243560] disabled:opacity-60 text-white font-bold px-6 py-2 rounded text-xs tracking-wider transition-colors whitespace-nowrap">
                {adding ? "Adding…" : "+ ADD DEPARTMENT"}
              </button>
            </form>
            {addError && <p className="text-red-500 text-xs mt-2">{addError}</p>}
          </div>

          {/* List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-xs text-gray-500">{data.length} total departments</span>
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-semibold text-gray-500">Filter:</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#f59e0b]">
                  <option value="all">All</option>
                  <option value="job">Jobs only</option>
                  <option value="tender">Tenders only</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>

            {error && <div className="px-4 py-3 text-red-600 text-xs bg-red-50">{error}</div>}

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-[#1a2744] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold tracking-wide">Department Name</th>
                    <th className="px-4 py-3 text-left font-semibold tracking-wide">Used In</th>
                    <th className="px-4 py-3 text-left font-semibold tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left font-semibold tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan={4} className="px-4 py-10 text-center text-gray-400">Loading…</td></tr>
                  ) : displayed.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-10 text-center text-gray-400">Koi department nahi mili.</td></tr>
                  ) : displayed.map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {editId === d._id ? (
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="border border-[#f59e0b] rounded px-2 py-1 text-xs w-full max-w-[200px] focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          d.name
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editId === d._id ? (
                          <select value={editType} onChange={(e) => setEditType(e.target.value as Dept["type"])}
                            className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#f59e0b]">
                            <option value="both">Both</option>
                            <option value="job">Jobs only</option>
                            <option value="tender">Tenders only</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${TYPE_COLORS[d.type]}`}>
                            {TYPE_LABELS[d.type]}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleToggleActive(d)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${d.isActive ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-400 text-white hover:bg-gray-500"}`}>
                          {d.isActive ? "ACTIVE" : "HIDDEN"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {editId === d._id ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleSaveEdit(d._id)} disabled={saving}
                              className="bg-[#1a2744] hover:bg-[#243560] disabled:opacity-60 text-white font-bold px-3 py-1 rounded text-[10px] tracking-wider transition-colors">
                              {saving ? "Saving…" : "SAVE"}
                            </button>
                            <button onClick={() => { setEditId(null); setEditError(""); }}
                              className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-3 py-1 rounded text-[10px]">
                              Cancel
                            </button>
                            {editError && <span className="text-red-500 text-[10px]">{editError}</span>}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button onClick={() => startEdit(d)}
                              className="text-blue-500 hover:text-blue-700 font-semibold text-[10px] flex items-center gap-1 transition-colors">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                              Edit
                            </button>
                            <button onClick={() => handleDelete(d._id, d.name)}
                              className="text-red-400 hover:text-red-600 font-semibold text-[10px] flex items-center gap-1 transition-colors">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-[10px] text-gray-400">
                <span className="font-semibold text-gray-500">Note:</span> "HIDDEN" departments dropdown mein nahi dikhenge. Delete karne se permanently hat jayenge.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
