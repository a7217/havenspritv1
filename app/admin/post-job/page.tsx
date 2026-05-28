"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

const LOCATIONS   = ["Delhi", "Noida", "Mumbai", "Gurgaon", "Hyderabad", "Chennai", "Bangalore", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"];

export default function PostNewJob() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => { if (window.innerWidth < 768) setSidebarOpen(false); }, []);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tenders, setTenders] = useState<string[]>([
    "NHAI Highway Phase-4", "Metro Line-3", "PWD Project #402",
  ]);
  const [departments, setDepartments] = useState<string[]>([]);

  const [customDept, setCustomDept] = useState("");
  const [customLoc, setCustomLoc] = useState("");

  const [form, setForm] = useState({
    title: "",
    department: "Government",
    tender: "",
    location: "Delhi",
    salaryFull: "",
    experience: "",
    vacancies: "",
    lastDate: "",
    shiftTiming: "",
    qualification: "",
    description: "",
  });

  const [responsibilities, setResponsibilities] = useState<string[]>([""]);
  const [qualifications,   setQualifications]   = useState<string[]>([""]);
  const [documents,        setDocuments]         = useState<string[]>([""]);

  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) {
      router.push("/admin/login");
      return;
    }
    fetch("/api/tenders")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data) && d.data.length > 0) {
          const names: string[] = d.data.map((t: { projectName: string }) => t.projectName);
          setTenders(names);
          setForm((f) => ({ ...f, tender: names[0] }));
        } else {
          setForm((f) => ({ ...f, tender: tenders[0] }));
        }
      })
      .catch(() => {
        setForm((f) => ({ ...f, tender: tenders[0] }));
      });
    fetch("/api/departments?type=job")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data) && d.data.length > 0) {
          const names: string[] = d.data.map((dep: { name: string }) => dep.name);
          setDepartments(names);
          setForm((f) => ({ ...f, department: names[0] }));
        }
      })
      .catch(() => {});
  }, [router]);

  const updateField = (key: string, val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  const addListItem    = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    setter((prev) => [...prev, ""]);

  const updateListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number, val: string) =>
    setter((prev) => prev.map((v, i) => i === idx ? val : v));

  const removeListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, idx: number) =>
    setter((prev) => prev.filter((_, i) => i !== idx));

  const effectiveDept = form.department === "__custom__" ? customDept.trim() : form.department;
  const effectiveLoc  = form.location  === "__custom__" ? customLoc.trim()  : form.location;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim())         e.title        = "Job title is required";
    if (!form.salaryFull.trim())    e.salaryFull   = "Salary range is required";
    if (!form.experience.trim())    e.experience   = "Experience is required";
    if (!form.lastDate.trim())      e.lastDate     = "Last date is required";
    if (!form.qualification.trim()) e.qualification = "Qualification is required";
    if (!form.description.trim())   e.description  = "Description is required";
    if (form.department === "__custom__" && !customDept.trim())
      e.department = "Custom department naam daalo";
    if (form.location === "__custom__" && !customLoc.trim())
      e.location = "Custom location naam daalo";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:           form.title,
          tender:          form.tender,
          project:         `[Associated Project: ${form.tender}]`,
          location:        effectiveLoc,
          salaryFull:      form.salaryFull,
          experience:      form.experience,
          vacancies:       parseInt(form.vacancies) || 0,
          lastDate:        new Date(form.lastDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
          shiftTiming:     form.shiftTiming || "Full-Time, 9 AM - 6 PM",
          department:      effectiveDept,
          qualification:   form.qualification,
          description:     form.description,
          responsibilities: responsibilities.filter(Boolean),
          qualifications:   qualifications.filter(Boolean),
          documents:        documents.filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to post job");

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Failed to post job" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({ title: "", department: "Government", tender: tenders[0] || "", location: "Delhi", salaryFull: "", experience: "", vacancies: "", lastDate: "", shiftTiming: "", qualification: "", description: "" });
    setCustomDept("");
    setCustomLoc("");
    setResponsibilities([""]);
    setQualifications([""]);
    setDocuments([""]);
    setErrors({});
    setSuccess(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]">
      {sidebarOpen && <AdminSidebar activePage="vacancies" topButton={{ label: "POST NEW JOB", href: "/admin/post-job" }} onClose={() => setSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-5 overflow-auto">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl font-extrabold text-[#1a2744] tracking-wide uppercase">Post New Job Vacancy</h1>
            <button onClick={() => router.push("/admin/vacancies")}
              className="text-xs text-gray-500 hover:text-[#1a2744] flex items-center gap-1 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
              Back to Vacancies
            </button>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-5 py-4 mb-5 flex items-start gap-3">
              <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <div>
                <p className="text-green-700 font-bold text-sm">Job posted successfully!</p>
                <p className="text-green-600 text-xs mt-0.5">The vacancy is now live on the public job listings page.</p>
                <div className="flex gap-3 mt-2">
                  <button onClick={() => router.push("/jobs")}
                    className="text-xs text-green-700 font-semibold underline hover:no-underline">View on public page →</button>
                  <button onClick={handleReset}
                    className="text-xs text-green-700 font-semibold underline hover:no-underline">Post another job</button>
                </div>
              </div>
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-5 py-3 mb-5">
              <p className="text-red-600 text-sm font-medium">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <h2 className="font-bold text-[#1a2744] text-sm uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Job Title *" error={errors.title}>
                  <input type="text" placeholder="e.g. Senior Civil Engineer" value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className={inputCls(errors.title)} />
                </Field>
                <Field label="Department *" error={errors.department}>
                  <select
                    value={form.department}
                    onChange={(e) => {
                      updateField("department", e.target.value);
                      if (e.target.value !== "__custom__") setCustomDept("");
                    }}
                    className={inputCls(errors.department)}
                  >
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                    <option value="__custom__">✏️ Other (Custom)</option>
                  </select>
                  {form.department === "__custom__" && (
                    <input
                      type="text"
                      placeholder="Department ka naam type karo..."
                      value={customDept}
                      onChange={(e) => {
                        setCustomDept(e.target.value);
                        setErrors((err) => { const n = { ...err }; delete n.department; return n; });
                      }}
                      className={`${inputCls(errors.department)} mt-2`}
                      autoFocus
                    />
                  )}
                </Field>
                <Field label="Project / Tender *">
                  <select value={form.tender} onChange={(e) => updateField("tender", e.target.value)} className={inputCls()}>
                    {tenders.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Location *" error={errors.location}>
                  <select
                    value={form.location}
                    onChange={(e) => {
                      updateField("location", e.target.value);
                      if (e.target.value !== "__custom__") setCustomLoc("");
                    }}
                    className={inputCls(errors.location)}
                  >
                    {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                    <option value="__custom__">✏️ Other (Custom)</option>
                  </select>
                  {form.location === "__custom__" && (
                    <input
                      type="text"
                      placeholder="City / location naam type karo..."
                      value={customLoc}
                      onChange={(e) => {
                        setCustomLoc(e.target.value);
                        setErrors((err) => { const n = { ...err }; delete n.location; return n; });
                      }}
                      className={`${inputCls(errors.location)} mt-2`}
                      autoFocus
                    />
                  )}
                </Field>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <h2 className="font-bold text-[#1a2744] text-sm uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">Job Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Field label="Salary (Monthly) *" error={errors.salaryFull}>
                  <input type="text" placeholder="e.g. ₹25,000 - ₹40,000/month" value={form.salaryFull}
                    onChange={(e) => updateField("salaryFull", e.target.value)} className={inputCls(errors.salaryFull)} />
                </Field>
                <Field label="Experience Required *" error={errors.experience}>
                  <input type="text" placeholder="e.g. 5-10 years" value={form.experience}
                    onChange={(e) => updateField("experience", e.target.value)} className={inputCls(errors.experience)} />
                </Field>
                <Field label="Number of Vacancies (optional)" error={errors.vacancies}>
                  <input type="number" placeholder="e.g. 5 (leave blank if not applicable)" min={0} value={form.vacancies}
                    onChange={(e) => updateField("vacancies", e.target.value)} className={inputCls(errors.vacancies)} />
                </Field>
                <Field label="Last Date to Apply *" error={errors.lastDate}>
                  <input type="date" value={form.lastDate}
                    onChange={(e) => updateField("lastDate", e.target.value)} className={inputCls(errors.lastDate)} />
                </Field>
                <Field label="Shift Timing">
                  <input type="text" placeholder="e.g. Full-Time, 9 AM - 6 PM" value={form.shiftTiming}
                    onChange={(e) => updateField("shiftTiming", e.target.value)} className={inputCls()} />
                </Field>
                <Field label="Minimum Qualification *" error={errors.qualification}>
                  <input type="text" placeholder="e.g. B.Tech Civil, M.Tech preferred" value={form.qualification}
                    onChange={(e) => updateField("qualification", e.target.value)} className={inputCls(errors.qualification)} />
                </Field>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <h2 className="font-bold text-[#1a2744] text-sm uppercase tracking-wide mb-4 pb-2 border-b border-gray-100">Description</h2>
              <Field label="Job Description *" error={errors.description}>
                <textarea rows={4} placeholder="Describe the role, responsibilities and project context..."
                  value={form.description} onChange={(e) => updateField("description", e.target.value)}
                  className={`${inputCls(errors.description)} resize-none`} />
              </Field>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <ListSection
                title="Key Responsibilities"
                items={responsibilities}
                placeholder="e.g. Supervise construction activities"
                onAdd={() => addListItem(setResponsibilities)}
                onChange={(i, v) => updateListItem(setResponsibilities, i, v)}
                onRemove={(i) => removeListItem(setResponsibilities, i)}
              />
              <ListSection
                title="Required Qualifications"
                items={qualifications}
                placeholder="e.g. B.Tech Civil Engineering"
                onAdd={() => addListItem(setQualifications)}
                onChange={(i, v) => updateListItem(setQualifications, i, v)}
                onRemove={(i) => removeListItem(setQualifications, i)}
              />
              <ListSection
                title="Required Documents"
                items={documents}
                placeholder="e.g. Degree Certificate"
                onAdd={() => addListItem(setDocuments)}
                onChange={(i, v) => updateListItem(setDocuments, i, v)}
                onRemove={(i) => removeListItem(setDocuments, i)}
              />
            </div>

            <div className="flex items-center gap-4 pb-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#c8860a] hover:bg-[#a86e08] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded text-sm tracking-wider transition-colors flex items-center gap-2"
              >
                {submitting && (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {submitting ? "PUBLISHING..." : "PUBLISH JOB VACANCY"}
              </button>
              <button type="button" onClick={handleReset} disabled={submitting}
                className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold px-6 py-3 rounded text-sm transition-colors disabled:opacity-50">
                Reset Form
              </button>
              <button type="button" onClick={() => router.push("/jobs")}
                className="text-sm text-[#1a2744] font-semibold hover:underline">
                Preview Public Listings →
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

const inputCls = (err?: string) =>
  `w-full border rounded px-3 py-2 text-xs focus:outline-none transition-colors ${err ? "border-red-400 focus:border-red-500 bg-red-50" : "border-gray-300 focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]"}`;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-gray-500 mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-[10px] mt-0.5">{error}</p>}
    </div>
  );
}

function ListSection({ title, items, placeholder, onAdd, onChange, onRemove }: {
  title: string; items: string[]; placeholder: string;
  onAdd: () => void; onChange: (i: number, v: string) => void; onRemove: (i: number) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <h2 className="font-bold text-[#1a2744] text-sm uppercase tracking-wide mb-3 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" placeholder={placeholder} value={item}
              onChange={(e) => onChange(i, e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b]" />
            {items.length > 1 && (
              <button type="button" onClick={() => onRemove(i)}
                className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={onAdd}
          className="flex items-center gap-1.5 text-xs text-[#1a2744] font-semibold hover:text-[#c8860a] transition-colors mt-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
          Add item
        </button>
      </div>
    </div>
  );
}
