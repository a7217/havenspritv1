"use client";
import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ContactFooter from "@/components/ContactFooter";
import { JobDetailSkeleton } from "@/components/Skeleton";

function formatMonthly(salaryFull: string): string {
  if (!salaryFull) return "—";
  const amounts = [...salaryFull.matchAll(/(\d+),(\d{2}),(\d{3})/g)];
  if (amounts.length > 0) {
    const monthly = amounts.map((m) => Math.round((parseInt(m[1]) * 100000 + parseInt(m[2]) * 1000 + parseInt(m[3])) / 12));
    const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");
    return monthly.length >= 2 ? `${fmt(monthly[0])} – ${fmt(monthly[1])}/month` : `${fmt(monthly[0])}/month`;
  }
  const lakh = salaryFull.match(/(\d+)\s*(?:lakh|lac|L)/i);
  if (lakh) return "₹" + Math.round(parseInt(lakh[1]) * 100000 / 12).toLocaleString("en-IN") + "/month";
  return salaryFull;
}

type JobDetail = {
  _id: string;
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
  isActive: boolean;
};

export default function JobDetailPage() {
  const params = useParams();
  const rawId  = params.id as string;
  const [job, setJob] = useState<JobDetail | null | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/jobs/public/${rawId}`)
      .then((r) => r.json())
      .then((d) => setJob(d.success && d.data ? (d.data as JobDetail) : null))
      .catch(() => setJob(null));
  }, [rawId]);

  if (job === undefined) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar activePage="jobs" />
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="h-10 w-48 bg-gray-200 animate-pulse rounded mb-5" />
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <JobDetailSkeleton />
            </div>
            {/* Sidebar skeleton */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="bg-white border border-gray-200 rounded-lg shadow-md p-5 animate-pulse space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full" />
                ))}
                <div className="h-10 bg-gray-200 rounded w-full mt-2" />
              </div>
            </aside>
          </div>
        </div>
        <ContactFooter />
      </div>
    );
  }

  if (job === null) return notFound();

  const infoItems = [
    { label: "Location",     value: job.location,    filledIcon: true,  iconPath: <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /> },
    { label: "Salary",       value: formatMonthly(job.salaryFull || ""),  filledIcon: false, iconPath: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { label: "Experience",   value: job.experience,  filledIcon: false, iconPath: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { label: "Vacancies",    value: String(job.vacancies), filledIcon: false, iconPath: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /> },
    { label: "Last Date",    value: job.lastDate,    filledIcon: false, iconPath: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
    { label: "Shift Timing", value: job.shiftTiming, filledIcon: false, iconPath: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="jobs" />
      <div className="max-w-6xl mx-auto px-4 py-5">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-white text-sm font-bold uppercase px-5 py-3 rounded mb-5 transition-colors min-h-[44px]"
        >
          ← Back to All Listings
        </Link>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 uppercase tracking-wide leading-tight">
                {job.title}
              </h1>
              {job.isActive && (
                <span className="inline-flex items-center bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-1">
                  OPEN
                </span>
              )}
            </div>
            <p className="text-gray-500 font-medium mt-1 text-xs sm:text-sm">{job.project}</p>

            <div className="mt-4 border border-gray-200 rounded-lg bg-white p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {infoItems.map(({ label, value, filledIcon, iconPath }) => (
                <div key={label} className="flex items-start gap-2 min-w-0">
                  <svg
                    className="w-4 h-4 text-[#1a2744] mt-0.5 shrink-0"
                    fill={filledIcon ? "currentColor" : "none"}
                    stroke={filledIcon ? undefined : "currentColor"}
                    viewBox="0 0 24 24"
                    strokeWidth={filledIcon ? undefined : 2}
                  >
                    {iconPath}
                  </svg>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-semibold">{label}</p>
                    <p className="text-xs sm:text-sm text-gray-700 break-words leading-snug">{value || "—"}</p>
                  </div>
                </div>
              ))}
            </div>

            {job.qualification && (
              <div className="flex items-center gap-2 mt-3 bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-3">
                <svg className="w-4 h-4 text-[#1a2744] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold">Qualification: </span>
                  <span className="text-xs sm:text-sm text-gray-700">{job.qualification}</span>
                </div>
              </div>
            )}

            {[
              { heading: "Job Description",         content: job.description,      type: "para" as const },
              { heading: "Key Responsibilities",    content: job.responsibilities, type: "list" as const },
              { heading: "Required Qualifications", content: job.qualifications,   type: "list" as const },
              { heading: "Essential Documents",     content: job.documents,        type: "list" as const },
            ]
              .filter(({ content }) => content && (Array.isArray(content) ? content.length > 0 : content))
              .map(({ heading, content, type }) => (
                <section key={heading} className="mt-5">
                  <h2 className="text-sm sm:text-base font-bold text-gray-800 mb-2 border-b border-gray-100 pb-1">{heading}</h2>
                  {type === "para" ? (
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{content as string}</p>
                  ) : (
                    <ul className="list-disc list-outside ml-4 text-xs sm:text-sm text-gray-600 space-y-1.5">
                      {(content as string[]).map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  )}
                </section>
              ))}

            <div className="lg:hidden mt-6 mb-8">
              <Link
                href={`/jobs/${rawId}/apply`}
                className="flex items-center justify-center w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold uppercase py-4 rounded-lg transition-colors tracking-wider text-sm min-h-[52px]"
              >
                Apply Now →
              </Link>
            </div>
          </div>

          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-5 sticky top-20">
              <h3 className="font-bold text-[#1a2744] uppercase text-sm text-center mb-4 leading-snug">{job.title}</h3>
              <div className="space-y-3">
                {infoItems.map(({ label, value, filledIcon, iconPath }) => (
                  <div key={label} className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 text-[#1a2744] shrink-0 mt-0.5"
                      fill={filledIcon ? "currentColor" : "none"}
                      stroke={filledIcon ? undefined : "currentColor"}
                      viewBox="0 0 24 24"
                      strokeWidth={filledIcon ? undefined : 2}
                    >
                      {iconPath}
                    </svg>
                    <span className="text-xs leading-snug text-gray-700 break-words">
                      <span className="font-semibold">{label}: </span>{value || "—"}
                    </span>
                  </div>
                ))}
              </div>
              <Link
                href={`/jobs/${rawId}/apply`}
                className="mt-5 flex items-center justify-center w-full bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold uppercase py-3 rounded transition-colors tracking-wider text-sm min-h-[44px]"
              >
                Apply Now
              </Link>
            </div>
          </aside>
        </div>
      </div>
      <ContactFooter />
    </div>
  );
}
