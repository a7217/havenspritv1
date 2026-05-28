import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Job } from "@/lib/models/Job";

type JobRow = { _id: string; title: string; project: string; salaryFull: string; vacancies: number; lastDate: string };

async function getLatestJobs(): Promise<JobRow[]> {
  noStore();
  try {
    await connectDB();
    const jobs = await Job.find({ isActive: true })
      .select("title project salaryFull vacancies lastDate")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    return jobs.map((j) => ({
      _id: String(j._id),
      title: String(j.title),
      project: String(j.project),
      salaryFull: String(j.salaryFull),
      vacancies: Number(j.vacancies),
      lastDate: String(j.lastDate),
    }));
  } catch {
    return [];
  }
}

export default async function JobOpenings() {
  const jobs = await getLatestJobs();

  return (
    <section className="py-8 sm:py-10 px-4 bg-gray-100">
      <div className="max-w-5xl mx-auto bg-[#1a2744] rounded-xl p-4 sm:p-6 md:p-8 shadow-xl">
        <h2 className="text-center text-white text-lg sm:text-xl font-bold uppercase tracking-wider sm:tracking-widest mb-5 sm:mb-6">
          Active Job Openings
        </h2>
        {jobs.length === 0 ? (
          <div className="text-center text-gray-400 py-6 text-sm">
            No active job openings at the moment. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg p-4 sm:p-5 shadow flex flex-col gap-2">
                <h3 className="font-bold text-gray-800 text-base">{job.title}</h3>
                <p className="text-gray-500 text-xs">{job.project}</p>
                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  <p><span className="font-semibold">Salary:</span> {job.salaryFull || "—"}</p>
                  <p><span className="font-semibold">Vacancies:</span> {job.vacancies}</p>
                  <p><span className="font-semibold">Last Date:</span> {job.lastDate || "—"}</p>
                </div>
                <Link
                  href={`/jobs/${job._id}`}
                  className="mt-3 bg-[#1a2744] hover:bg-[#243560] text-white text-sm font-semibold py-3 rounded transition-colors text-center"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
        <div className="mt-5 text-center">
          <Link href="/jobs" className="text-[#f59e0b] text-sm font-semibold hover:underline">
            View All Job Listings →
          </Link>
        </div>
      </div>
    </section>
  );
}
