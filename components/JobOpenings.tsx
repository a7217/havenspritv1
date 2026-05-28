import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Job } from "@/lib/models/Job";

type JobRow = {
  _id: string;
  title: string;
  project: string;
  department: string;
  location: string;
  salaryFull: string;
  vacancies: number;
  lastDate: string;
};

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

async function getLatestJobs(): Promise<JobRow[]> {
  noStore();
  try {
    await connectDB();
    const jobs = await Job.find({ isActive: true })
      .select("title project department location salaryFull vacancies lastDate")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    return jobs.map((j) => ({
      _id:        String(j._id),
      title:      String(j.title),
      project:    String(j.project || ""),
      department: String(j.department || ""),
      location:   String(j.location || ""),
      salaryFull: String(j.salaryFull || ""),
      vacancies:  Number(j.vacancies || 0),
      lastDate:   String(j.lastDate || ""),
    }));
  } catch {
    return [];
  }
}

export default async function JobOpenings() {
  const jobs = await getLatestJobs();

  return (
    <section className="py-10 sm:py-14 px-4 bg-[#1a2744]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-7">
          <p className="text-[#f59e0b] text-xs font-bold uppercase tracking-widest mb-1">Now Hiring</p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-wide">
            Active Job Openings
          </h2>
          <p className="text-gray-400 text-sm mt-1">Government project vacancies — apply before last date</p>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white/10 rounded-xl p-10 text-center">
            <svg className="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-400 text-sm">No active job openings at the moment. Check back soon.</p>
          </div>
        ) : (
          <div className={`grid gap-4 ${jobs.length === 1 ? "grid-cols-1 max-w-sm mx-auto" : jobs.length === 2 ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto" : "grid-cols-1 sm:grid-cols-3"}`}>
            {jobs.map((job) => (
              <div key={job._id} className="bg-white rounded-xl p-5 shadow-lg flex flex-col gap-2 border border-gray-100">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm leading-snug">{job.title}</h3>
                    {job.department && (
                      <span className="inline-block mt-1 bg-[#1a2744] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {job.department}
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 bg-green-100 text-green-700 text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wide">OPEN</span>
                </div>

                {job.location && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{job.location}</span>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-2 mt-1 text-xs text-gray-700 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Salary</span>
                    <span className="font-semibold text-right">{formatMonthly(job.salaryFull)}</span>
                  </div>
                  {job.vacancies > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vacancies</span>
                      <span className="font-semibold">{job.vacancies}</span>
                    </div>
                  )}
                  {job.lastDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Date</span>
                      <span className="font-semibold text-red-500">{job.lastDate}</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/jobs/${job._id}`}
                  className="mt-2 bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs font-bold py-2.5 rounded-lg transition-colors text-center uppercase tracking-wide"
                >
                  View & Apply →
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 border border-white/30 hover:border-[#f59e0b] text-white hover:text-[#f59e0b] text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            View All Job Listings
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 10 10.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
