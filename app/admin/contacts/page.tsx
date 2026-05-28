"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

type ContactMsg = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function ContactsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => { if (window.innerWidth < 768) setSidebarOpen(false); }, []);
  const [data, setData] = useState<ContactMsg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setData(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) {
      router.push("/admin/login");
      return;
    }
    fetchContacts();
  }, [router, fetchContacts]);

  const markRead = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !current }),
      });
      setData((prev) => prev.map((c) => c._id === id ? { ...c, read: !current } : c));
    } catch { /* ignore */ }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Is message ko delete karna chahte hain?")) return;
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setData((prev) => prev.filter((c) => c._id !== id));
      if (expanded === id) setExpanded(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const filtered = data.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = data.filter((c) => !c.read).length;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]">
      {sidebarOpen && <AdminSidebar activePage="contacts" onClose={() => setSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-5 overflow-auto">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-[#1a2744] tracking-wide uppercase">
                Contact Messages
              </h1>
              {unreadCount > 0 && (
                <p className="text-xs text-[#f59e0b] font-semibold mt-0.5">
                  {unreadCount} unread message{unreadCount > 1 ? "s" : ""}
                </p>
              )}
            </div>
            <button
              onClick={fetchContacts}
              className="flex items-center gap-1.5 border border-gray-300 rounded px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
              </svg>
              Refresh
            </button>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <input
              type="text"
              placeholder="Search by name, email or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]"
            />
          </div>

          {/* Messages List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-gray-400 text-xs">
                <svg className="animate-spin w-4 h-4 text-[#f59e0b]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading messages...
              </div>
            ) : error ? (
              <div className="py-16 text-center text-red-400 text-xs font-medium">
                {error}
                <button onClick={fetchContacts} className="ml-2 text-[#c8860a] underline">Retry</button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-xs font-medium">
                {search ? "No messages match your search." : "No messages yet."}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filtered.map((c) => (
                  <div key={c._id} className={`transition-colors ${!c.read ? "bg-amber-50" : "bg-white"}`}>
                    {/* Row */}
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        setExpanded(expanded === c._id ? null : c._id);
                        if (!c.read) markRead(c._id, false);
                      }}
                    >
                      <div className="shrink-0">
                        <div className="w-8 h-8 rounded-full bg-[#1a2744] text-white flex items-center justify-center text-xs font-bold uppercase">
                          {c.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold text-gray-800 truncate ${!c.read ? "font-bold" : ""}`}>
                            {c.name}
                          </span>
                          {!c.read && (
                            <span className="shrink-0 px-1.5 py-0.5 bg-[#f59e0b] text-white text-[9px] font-bold rounded">NEW</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{c.subject}</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-[10px] text-gray-400">
                          {new Date(c.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {new Date(c.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <svg
                        className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${expanded === c._id ? "rotate-180" : ""}`}
                        fill="currentColor" viewBox="0 0 24 24"
                      >
                        <path d="M7 10l5 5 5-5z" />
                      </svg>
                    </div>

                    {/* Expanded */}
                    {expanded === c._id && (
                      <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-gray-50">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">From</p>
                            <p className="text-xs font-semibold text-gray-700">{c.name}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Email</p>
                            <a href={`mailto:${c.email}`} className="text-xs text-blue-600 hover:underline font-medium">{c.email}</a>
                          </div>
                          <div className="col-span-2">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Subject</p>
                            <p className="text-xs font-semibold text-gray-700">{c.subject}</p>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Message</p>
                          <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap bg-white border border-gray-200 rounded p-3">
                            {c.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}`}
                            className="flex items-center gap-1.5 bg-[#1a2744] hover:bg-[#243560] text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                            </svg>
                            Reply via Email
                          </a>
                          <button
                            onClick={() => markRead(c._id, c.read)}
                            className="flex items-center gap-1.5 border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                          >
                            {c.read ? "Mark as Unread" : "Mark as Read"}
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            className="flex items-center gap-1.5 border border-red-200 hover:bg-red-50 text-red-500 text-xs font-semibold px-3 py-1.5 rounded transition-colors ml-auto"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
