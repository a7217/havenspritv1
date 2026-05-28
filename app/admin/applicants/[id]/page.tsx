"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

type Applicant = {
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
  qualification: string;
  experience: number;
  employer: string;
  jobTitle: string;
  tender: string;
  resumeUrl: string;
  idProofUrl: string;
  photoUrl: string;
  applicationStatus: "PENDING" | "SHORTLISTED" | "SELECTED" | "REJECTED";
  submissionDate: string;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:     "bg-[#f59e0b] text-white",
  SELECTED:    "bg-green-500 text-white",
  SHORTLISTED: "bg-blue-500 text-white",
  REJECTED:    "bg-red-500 text-white",
};

export default function ApplicantProfile() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => { if (window.innerWidth < 768) setSidebarOpen(false); }, []);
  const [savingStatus, setSavingStatus] = useState(false);
  const [status, setStatus] = useState<Applicant["applicationStatus"]>("PENDING");

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) {
      router.push("/admin/login");
      return;
    }
    fetch(`/api/applications/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) throw new Error(json.error);
        setData(json.data);
        setStatus(json.data.applicationStatus);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleStatusChange = async (newStatus: string) => {
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationStatus: newStatus }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setStatus(newStatus as Applicant["applicationStatus"]);
      if (data) setData({ ...data, applicationStatus: newStatus as Applicant["applicationStatus"] });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Status update failed");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Is application ko permanently delete karna chahte hain?")) return;
    await fetch(`/api/applications/${id}`, { method: "DELETE" });
    router.push("/admin/applicants");
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#f3f4f6]">
      <svg className="animate-spin w-8 h-8 text-[#f59e0b]" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>
  );

  if (error || !data) return (
    <div className="flex h-screen items-center justify-center bg-[#f3f4f6] flex-col gap-3">
      <p className="text-red-500 font-medium">{error || "Applicant not found"}</p>
      <Link href="/admin/applicants" className="text-sm text-[#c8860a] underline">← Back to Applicants</Link>
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <div className="py-2.5 border-b border-gray-100 last:border-0 flex gap-4">
      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide w-24 sm:w-36 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-800 font-medium break-words min-w-0">{value || "—"}</span>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]">
      {sidebarOpen && <AdminSidebar activePage="applicants" onClose={() => setSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto p-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Link href="/admin/applicants" className="hover:text-[#c8860a] transition-colors">Applicants</Link>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
            <span className="text-[#1a2744] font-semibold">{data.fullName}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Left — Profile Card */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                {data.photoUrl ? (
                  <Image
                    src={data.photoUrl}
                    alt={data.fullName}
                    width={96} height={96}
                    className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-[#f59e0b] mb-3"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#1a2744] text-white text-3xl font-bold flex items-center justify-center mx-auto border-4 border-[#f59e0b] mb-3">
                    {data.fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <h2 className="text-base font-extrabold text-[#1a2744] tracking-wide">{data.fullName}</h2>
                {data.fatherName && <p className="text-xs text-gray-500 mt-0.5">S/o {data.fatherName}</p>}
                <p className="text-xs text-gray-500 mt-1">{data.jobTitle}</p>
                <p className="text-[10px] text-[#f59e0b] font-semibold mt-0.5">{data.tender}</p>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-2">Application Status</p>
                  <span className={`px-3 py-1 rounded text-xs font-bold ${STATUS_COLORS[status]}`}>
                    {status}
                  </span>
                </div>

                {/* Status Change */}
                <div className="mt-4">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-2">Change Status</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(["PENDING", "SHORTLISTED", "SELECTED", "REJECTED"] as const).map((s) => (
                      <button
                        key={s}
                        disabled={savingStatus || status === s}
                        onClick={() => handleStatusChange(s)}
                        className={`text-[10px] font-bold py-1.5 rounded border transition-colors ${
                          status === s
                            ? "border-transparent opacity-40 cursor-not-allowed " + STATUS_COLORS[s]
                            : "border-gray-200 text-gray-600 hover:border-[#f59e0b] hover:text-[#1a2744]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-3">Quick Actions</p>
                <a
                  href={`mailto:${data.email}`}
                  className="flex items-center gap-2 w-full text-xs font-semibold text-[#1a2744] hover:text-[#c8860a] transition-colors py-1.5"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                  Email Applicant
                </a>
                {data.resumeUrl && (
                  <a
                    href={data.resumeUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 w-full text-xs font-semibold text-[#1a2744] hover:text-[#c8860a] transition-colors py-1.5"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 16h8v2H8v-2zm0-4h8v2H8v-2zm0-4h5v2H8V8z" /></svg>
                    View Resume
                  </a>
                )}
                {data.idProofUrl && (
                  <a
                    href={data.idProofUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 w-full text-xs font-semibold text-[#1a2744] hover:text-[#c8860a] transition-colors py-1.5"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 3h2v2h-2V7zm0 4h2v6h-2v-6zm-4-4h2v2H7V7zm0 4h2v6H7v-6z" /></svg>
                    View ID Proof
                  </a>
                )}
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 w-full text-xs font-semibold text-red-400 hover:text-red-600 transition-colors py-1.5"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                    Delete Application
                  </button>
                </div>
              </div>
            </div>

            {/* Right — Details */}
            <div className="lg:col-span-2 space-y-4">

              {/* Personal Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h3 className="text-xs font-extrabold text-[#1a2744] uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">
                  Personal Information
                </h3>
                <InfoRow label="Full Name" value={data.fullName} />
                <InfoRow label="Father's Name" value={data.fatherName} />
                <InfoRow label="Date of Birth" value={data.dob} />
                <InfoRow label="Aadhaar No." value={data.aadhaar ? `XXXX-XXXX-${data.aadhaar.slice(-4)}` : ""} />
                <InfoRow label="Mobile" value={data.mobile} />
                <InfoRow label="Email" value={data.email} />
              </div>

              {/* Address */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h3 className="text-xs font-extrabold text-[#1a2744] uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">
                  Address Details
                </h3>
                <InfoRow label="Address" value={data.address} />
                <InfoRow label="City" value={data.city} />
                <InfoRow label="State" value={data.state} />
                <InfoRow label="Pin Code" value={data.pinCode} />
              </div>

              {/* Professional Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h3 className="text-xs font-extrabold text-[#1a2744] uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">
                  Professional Details
                </h3>
                <InfoRow label="Applied For" value={data.jobTitle} />
                <InfoRow label="Tender / Project" value={data.tender} />
                <InfoRow label="Qualification" value={data.qualification} />
                <InfoRow label="Experience" value={data.experience !== undefined ? `${data.experience} year(s)` : ""} />
                <InfoRow label="Last Employer" value={data.employer} />
                <InfoRow label="Submission Date" value={data.submissionDate ? new Date(data.submissionDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : ""} />
              </div>

              {/* Documents */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h3 className="text-xs font-extrabold text-[#1a2744] uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">
                  Uploaded Documents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Photo", url: data.photoUrl, icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" },
                    { label: "Resume", url: data.resumeUrl, icon: "M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 16h8v2H8v-2zm0-4h8v2H8v-2zm0-4h5v2H8V8z" },
                    { label: "ID Proof", url: data.idProofUrl, icon: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 3h2v2h-2V7zm0 4h2v6h-2v-6zm-4-4h2v2H7V7zm0 4h2v6H7v-6z" },
                  ].map((doc) => (
                    <div key={doc.label} className="border border-gray-200 rounded-lg p-3 flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${doc.url ? "bg-green-100" : "bg-gray-100"}`}>
                        <svg className={`w-5 h-5 ${doc.url ? "text-green-500" : "text-gray-400"}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d={doc.icon} />
                        </svg>
                      </div>
                      <span className="text-[11px] font-bold text-gray-600">{doc.label}</span>
                      {doc.url ? (
                        <a
                          href={doc.url} target="_blank" rel="noreferrer"
                          className="text-[10px] bg-[#1a2744] text-white px-3 py-1 rounded font-semibold hover:bg-[#243560] transition-colors"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-medium">Not Uploaded</span>
                      )}
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
