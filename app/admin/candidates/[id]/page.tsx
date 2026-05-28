"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

type AppStatus = "PENDING" | "SHORTLISTED" | "SELECTED" | "REJECTED";

type ApplicationData = {
  _id: string;
  fullName: string;
  fatherName: string;
  mobile: string;
  email: string;
  dob: string;
  aadhaar: string;
  address: string;
  state: string;
  city: string;
  pinCode: string;
  jobTitle: string;
  tender: string;
  qualification: string;
  experience: number;
  employer: string;
  resumeUrl: string;
  idProofUrl: string;
  photoUrl: string;
  applicationStatus: AppStatus;
  submissionDate: string;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:     "bg-[#f59e0b] text-white",
  SHORTLISTED: "bg-green-500 text-white",
  SELECTED:    "bg-green-600 text-white",
  REJECTED:    "bg-red-500 text-white",
};

const ALL_STATUSES: AppStatus[] = ["PENDING", "SHORTLISTED", "SELECTED", "REJECTED"];

const DOC_TYPE_ICON: Record<string, React.ReactNode> = {
  resume: <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/>,
  id:     <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>,
  photo:  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>,
};

export default function CandidateProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => { if (window.innerWidth < 768) setSidebarOpen(false); }, []);
  const [app, setApp] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newStatus, setNewStatus] = useState<AppStatus>("PENDING");
  const [note, setNote] = useState("");
  const [actionSent, setActionSent] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) { router.push("/admin/login"); return; }
    fetch(`/api/applications/${id}`, { })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setApp(d.data);
          setNewStatus(d.data.applicationStatus);
        } else {
          setError(d.error || "Application not found");
        }
      })
      .catch(() => setError("Failed to load application"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleUpdateStatus = async () => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationStatus: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setApp((a) => a ? { ...a, applicationStatus: newStatus } : a);
        setNote("");
        setActionSent(true);
        setTimeout(() => setActionSent(false), 3000);
      }
    } catch { /* silent */ }
  };

  const quickAction = (status: AppStatus) => {
    setNewStatus(status);
    setTimeout(handleUpdateStatus, 50);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f3f4f6] items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1a2744] border-t-[#f59e0b] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="flex min-h-screen bg-[#f3f4f6] items-center justify-center flex-col gap-4">
        <p className="text-red-500 font-semibold">{error || "Application not found"}</p>
        <Link href="/admin/status" className="text-[#1a2744] underline text-sm">← Back to Status Management</Link>
      </div>
    );
  }

  const documents = [
    { name: "Resume / CV",          type: "resume", url: app.resumeUrl },
    { name: "National ID / Aadhaar", type: "id",     url: app.idProofUrl },
    { name: "Passport Photo",        type: "photo",  url: app.photoUrl },
  ].filter((d) => d.url);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]">
      {sidebarOpen && <AdminSidebar activePage="status" onClose={() => setSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-5 overflow-auto">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Link href="/admin/status"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#1a2744] transition-colors font-semibold">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                Back to Status Management
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-lg font-extrabold text-[#1a2744] uppercase tracking-wide">Candidate Profile</h1>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[app.applicationStatus]}`}>{app.applicationStatus}</span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 space-y-4">
              {/* Profile Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="w-16 h-16 rounded-full bg-[#1a2744] flex items-center justify-center text-2xl font-extrabold text-[#f59e0b] shrink-0">
                    {app.photoUrl ? (
                      <img src={app.photoUrl} alt={app.fullName} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      app.fullName.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-extrabold text-[#1a2744]">{app.fullName}</h2>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">{app.jobTitle} — {app.tender}</p>
                    <div className="flex flex-wrap gap-4 mt-3">
                      <InfoPair icon="email"  label="Email"    value={app.email} />
                      <InfoPair icon="phone"  label="Phone"    value={app.mobile} />
                      <InfoPair icon="loc"    label="Location" value={`${app.city}, ${app.state}`} />
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Application ID",  value: app._id.slice(-8).toUpperCase() },
                    { label: "Tender Ref",       value: app.tender },
                    { label: "Submitted",        value: app.submissionDate ? new Date(app.submissionDate).toLocaleDateString("en-IN") : "—" },
                    { label: "Experience",       value: `${app.experience} years` },
                    { label: "Qualification",    value: app.qualification },
                    { label: "Date of Birth",    value: app.dob || "—" },
                    { label: "Father's Name",    value: app.fatherName || "—" },
                    { label: "Last Employer",    value: app.employer || "—" },
                    { label: "Address",          value: `${app.address}, ${app.city} - ${app.pinCode}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="min-w-0">
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
                      <p className="text-xs text-gray-700 font-medium break-words leading-snug mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              {documents.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-[#1a2744] px-5 py-3">
                    <h3 className="font-bold text-white text-xs uppercase tracking-wide">Submitted Documents</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {documents.map((doc, i) => (
                        <a key={i} href={doc.url} target="_blank" rel="noreferrer"
                          className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 hover:border-[#f59e0b] transition-colors group">
                          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">{DOC_TYPE_ICON[doc.type]}</svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">{doc.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Click to view</p>
                          </div>
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-[#1a2744] transition-colors shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Application Timeline */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#1a2744] px-5 py-3">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wide">Application History</h3>
                </div>
                <div className="p-5">
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                    <div className="space-y-5">
                      <div className="flex items-start gap-4 relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-white shadow-sm bg-[#f59e0b] text-white`}>
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f59e0b] text-white">SUBMITTED</span>
                            <span className="text-[10px] text-gray-400">
                              {app.submissionDate ? new Date(app.submissionDate).toLocaleString("en-IN") : "—"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">Application submitted successfully.</p>
                        </div>
                      </div>
                      {app.applicationStatus !== "PENDING" && (
                        <div className="flex items-start gap-4 relative">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-white shadow-sm ${STATUS_COLORS[app.applicationStatus]}`}>
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_COLORS[app.applicationStatus]}`}>{app.applicationStatus}</span>
                              <span className="text-[10px] text-gray-400">· by Admin</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Status updated by admin.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Quick Actions */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-4">
                <div className="bg-[#c8860a] px-5 py-3">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wide">Quick Action Panel</h3>
                </div>
                <div className="p-4 space-y-4">
                  {actionSent && (
                    <div className="bg-green-50 border border-green-200 rounded px-3 py-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      <span className="text-xs text-green-700 font-semibold">Status updated successfully!</span>
                    </div>
                  )}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Update Status</label>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as AppStatus)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]">
                      {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 mb-1.5">Admin Note</label>
                    <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)}
                      placeholder="Add a note about this status change..."
                      className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] resize-none" />
                  </div>
                  <button onClick={handleUpdateStatus}
                    className="w-full bg-[#1a2744] hover:bg-[#243560] text-white font-bold py-2.5 rounded text-xs tracking-wider transition-colors">
                    UPDATE STATUS
                  </button>
                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Quick Decisions</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => quickAction("SELECTED")}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded text-[10px] transition-colors">Select</button>
                      <button onClick={() => quickAction("SHORTLISTED")}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded text-[10px] transition-colors">Shortlist</button>
                      <button onClick={() => quickAction("PENDING")}
                        className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold py-2 rounded text-[10px] transition-colors">Hold</button>
                      <button onClick={() => quickAction("REJECTED")}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded text-[10px] transition-colors">Reject</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="font-bold text-[#1a2744] text-xs uppercase tracking-wide mb-3">Application Summary</h3>
                <div className="space-y-2.5">
                  {[
                    { label: "Docs Submitted",  value: `${documents.length}/3` },
                    { label: "Experience",       value: `${app.experience} years` },
                    { label: "Qualification",    value: app.qualification },
                    { label: "Current Status",   value: app.applicationStatus },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{label}</span>
                      <span className="text-xs font-bold text-[#1a2744]">{value}</span>
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

function InfoPair({ icon, label, value }: { icon: string; label: string; value: string }) {
  const icons: Record<string, React.ReactNode> = {
    email: <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>,
    phone: <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>,
    loc:   <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>,
  };
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <svg className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" fill="currentColor" viewBox="0 0 24 24">{icons[icon]}</svg>
      <span className="text-[10px] text-gray-400 font-semibold shrink-0">{label}:</span>
      <span className="text-xs text-gray-700 truncate">{value}</span>
    </div>
  );
}
