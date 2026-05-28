"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContactFooter from "@/components/ContactFooter";
import { JobCardSkeleton } from "@/components/Skeleton";

type Job = {
  _id?: string;
  id?: number;
  title: string;
  project: string;
  location: string;
  salary: string;
  salaryFull: string;
  experience: string;
  vacancies: number;
  lastDate: string;
  shiftTiming: string;
  department: string;
  qualification: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  documents: string[];
  isNew?: boolean;
};

const departments = ["Environmental", "Government", "Communication"];
const JOBS_PER_PAGE = 8;

const EXPERIENCE_OPTIONS = [
  { label: "Fresher (0–1 yr)", min: 0, max: 1 },
  { label: "Junior (1–3 yrs)", min: 1, max: 3 },
  { label: "Mid-level (3–5 yrs)", min: 3, max: 5 },
  { label: "Senior (5+ yrs)", min: 5, max: 99 },
];

const SALARY_OPTIONS = [
  { label: "Any Salary", value: "" },
  { label: "Up to ₹67,000/month", value: "low" },
  { label: "₹67K – ₹1.25L/month", value: "mid" },
  { label: "₹1.25L+/month", value: "high" },
];

function parseExperienceMin(exp: string): number {
  const match = exp.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function parseSalaryLPA(salaryFull: string): number {
  const match = salaryFull.match(/(\d+),?(\d{2}),?(\d{3})/);
  if (match) return parseInt(match[1]);
  const lakh = salaryFull.match(/(\d+)\s*(?:lakh|lac|L)/i);
  if (lakh) return parseInt(lakh[1]);
  return 0;
}

function formatMonthly(salaryFull: string): string {
  if (!salaryFull) return "—";
  const amounts = [...salaryFull.matchAll(/(\d+),(\d{2}),(\d{3})/g)];
  if (amounts.length > 0) {
    const monthly = amounts.map((m) => Math.round((parseInt(m[1]) * 100000 + parseInt(m[2]) * 1000 + parseInt(m[3])) / 12));
    const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");
    return monthly.length >= 2
      ? `${fmt(monthly[0])} – ${fmt(monthly[1])}/month`
      : `${fmt(monthly[0])}/month`;
  }
  const lakh = salaryFull.match(/(\d+)\s*(?:lakh|lac|L)/i);
  if (lakh) return "₹" + Math.round(parseInt(lakh[1]) * 100000 / 12).toLocaleString("en-IN") + "/month";
  return salaryFull;
}

function jobMatchesSalary(job: Job, salaryFilter: string): boolean {
  if (!salaryFilter) return true;
  const lpa = parseSalaryLPA(job.salaryFull);
  if (salaryFilter === "low") return lpa > 0 && lpa <= 8;
  if (salaryFilter === "mid") return lpa > 8 && lpa <= 15;
  if (salaryFilter === "high") return lpa > 15;
  return true;
}

function getJobId(job: Job): string {
  return job._id ?? String(job.id ?? "");
}

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [project, setProject] = useState("");
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [selectedExpOptions, setSelectedExpOptions] = useState<number[]>([]);
  const [salaryFilter, setSalaryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jobs/public")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setJobs(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleDept = (dept: string) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
    setPage(1);
  };

  const toggleExp = (idx: number) => {
    setSelectedExpOptions((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
    setPage(1);
  };

  const filtered = jobs.filter((job) => {
    const matchSearch = search === "" || job.title.toLowerCase().includes(search.toLowerCase());
    const matchLocation = location === "" || job.location.toLowerCase().includes(location.toLowerCase());
    const matchProject = project === "" || job.project.toLowerCase().includes(project.toLowerCase());
    const matchDept = selectedDepts.length === 0 || selectedDepts.includes(job.department);

    const matchExp = selectedExpOptions.length === 0 || (() => {
      const expMin = parseExperienceMin(job.experience);
      return selectedExpOptions.some((idx) => {
        const opt = EXPERIENCE_OPTIONS[idx];
        return expMin >= opt.min && expMin < opt.max;
      });
    })();

    const matchSalary = jobMatchesSalary(job, salaryFilter);

    const matchDate = (() => {
      if (!fromDate && !toDate) return true;
      const jobDate = new Date(job.lastDate);
      if (isNaN(jobDate.getTime())) return true;
      if (fromDate && jobDate < new Date(fromDate)) return false;
      if (toDate && jobDate > new Date(toDate)) return false;
      return true;
    })();

    return matchSearch && matchLocation && matchProject && matchDept && matchExp && matchSalary && matchDate;
  });

  const totalPages = Math.ceil(filtered.length / JOBS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

  const activeFilterCount = selectedDepts.length + selectedExpOptions.length + (salaryFilter ? 1 : 0) + (fromDate || toDate ? 1 : 0);

  const FiltersPanel = () => (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-700 uppercase text-sm tracking-wide">Refine Your Search</h3>

      <div className="bg-white rounded shadow overflow-hidden">
        <div className="bg-[#1a2744] text-white text-sm font-semibold px-3 py-2.5">By Department</div>
        <div className="p-4 space-y-1">
          {departments.map((dept) => (
            <label key={dept} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={selectedDepts.includes(dept)}
                onChange={() => toggleDept(dept)}
                className="accent-[#1a2744] w-4 h-4"
              />
              {dept}
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <div className="bg-[#1a2744] text-white text-sm font-semibold px-3 py-2.5">By Experience</div>
        <div className="p-4 space-y-1">
          {EXPERIENCE_OPTIONS.map((opt, idx) => (
            <label key={idx} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={selectedExpOptions.includes(idx)}
                onChange={() => toggleExp(idx)}
                className="accent-[#1a2744] w-4 h-4"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <div className="bg-[#1a2744] text-white text-sm font-semibold px-3 py-2.5">By Salary</div>
        <div className="p-4 space-y-1">
          {SALARY_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer py-1">
              <input
                type="radio"
                name="salary"
                checked={salaryFilter === opt.value}
                onChange={() => { setSalaryFilter(opt.value); setPage(1); }}
                className="accent-[#1a2744] w-4 h-4"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <div className="bg-[#1a2744] text-white text-sm font-semibold px-3 py-2.5">By Last Date</div>
        <div className="p-4 space-y-2">
          <div>
            <label className="text-[10px] text-gray-400 font-semibold uppercase block mb-1">From</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded px-2 py-2 text-gray-600 outline-none text-sm"
              value={fromDate}
              onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-semibold uppercase block mb-1">To</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded px-2 py-2 text-gray-600 outline-none text-sm"
              value={toDate}
              onChange={(e) => { setToDate(e.target.value); setPage(1); }}
            />
          </div>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={() => {
            setSelectedDepts([]);
            setSelectedExpOptions([]);
            setSalaryFilter("");
            setFromDate("");
            setToDate("");
            setPage(1);
          }}
          className="w-full text-xs text-red-500 font-semibold border border-red-200 rounded py-2 hover:bg-red-50 transition-colors"
        >
          Clear All Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activePage="jobs" />

      {/* Search bar */}
      <div className="bg-[#1a2744] px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col gap-3">
          <div className="flex items-center bg-white rounded-lg px-4 py-3 gap-2">
            <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search job titles or keywords..."
              className="flex-1 outline-none text-gray-700 min-w-0 bg-transparent"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              className="bg-white text-gray-600 px-3 py-3 rounded-lg outline-none w-full"
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
            >
              <option value="">Location</option>
              <option value="Delhi">Delhi</option>
              <option value="Noida">Noida</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Phase-4">Highway Phase-4</option>
            </select>
            <select
              className="bg-white text-gray-600 px-3 py-3 rounded-lg outline-none w-full"
              value={project}
              onChange={(e) => { setProject(e.target.value); setPage(1); }}
            >
              <option value="">Project/Tender</option>
              <option value="NHAI">NHAI</option>
              <option value="Metro">Metro</option>
              <option value="PWD">PWD</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4 gap-3">
          <h2 className="text-sm sm:text-base font-bold text-gray-700 uppercase tracking-wide">
            Open Vacancies <span className="text-[#f59e0b]">({loading ? "..." : filtered.length})</span>
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 bg-[#1a2744] text-white text-sm font-semibold px-4 py-3 rounded-lg min-h-[44px]"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
            </svg>
            {showFilters ? "Hide" : "Filters"}
            {activeFilterCount > 0 && (
              <span className="bg-[#f59e0b] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile filter panel */}
        {showFilters && (
          <div className="md:hidden mb-5 pb-5 border-b border-gray-300">
            <FiltersPanel />
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden md:block w-60 shrink-0">
            <FiltersPanel />
          </aside>

          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => <JobCardSkeleton key={i} />)}
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center text-gray-400 py-20 text-sm">No jobs found matching your criteria.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {paginated.map((job) => (
                  <div key={getJobId(job)} className="bg-white rounded-lg shadow p-4 flex flex-col relative">
                    {job.isNew && (
                      <span className="absolute top-3 right-3 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">NEW</span>
                    )}
                    <h3 className="font-bold text-gray-800 text-sm leading-snug pr-10">{job.title}</h3>
                    <p className="text-gray-400 text-xs mt-0.5 leading-snug">{job.project}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="mt-3 text-xs text-gray-700 space-y-1">
                      <p><span className="font-semibold">Salary:</span> {formatMonthly(job.salaryFull || job.salary || "")}</p>
                      <p><span className="font-semibold">Experience:</span> {job.experience || "—"}</p>
                      <p><span className="font-semibold">Vacancies:</span> {job.vacancies}</p>
                      <p><span className="font-semibold">Last Date:</span> {job.lastDate || "—"}</p>
                    </div>
                    <div className="flex gap-2 mt-3 mb-3">
                      {[
                        <><path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4z" /><path d="M16 24c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8" strokeLinecap="round" /><path d="M12 32l4-4" strokeLinecap="round" /></>,
                        <><circle cx="24" cy="16" r="8" /><path d="M8 40c0-8.8 7.2-16 16-16s16 7.2 16 16" strokeLinecap="round" /></>,
                        <><rect x="10" y="8" width="28" height="34" rx="3" /><path d="M18 20h12M18 26h8" strokeLinecap="round" /><path d="M30 32l4 4 6-8" strokeLinecap="round" strokeLinejoin="round" /></>
                      ].map((paths, i) => (
                        <svg key={i} viewBox="0 0 48 48" fill="none" stroke="#1a2744" strokeWidth="2.5" className="w-7 h-7 shrink-0">{paths}</svg>
                      ))}
                    </div>
                    <Link
                      href={`/jobs/${getJobId(job)}`}
                      className="mt-auto bg-[#f59e0b] hover:bg-[#d97706] text-white text-sm font-semibold py-3 rounded transition-colors w-full text-center min-h-[44px] flex items-center justify-center"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="bg-[#1a2744] text-white text-sm px-5 py-3 rounded hover:bg-[#243560] transition-colors min-h-[44px] disabled:opacity-40"
                >
                  Next
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="bg-white border border-gray-300 text-gray-600 text-sm px-5 py-3 rounded hover:bg-gray-50 transition-colors disabled:opacity-40 min-h-[44px]"
                >
                  Previous
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <ContactFooter />
    </div>
  );
}
