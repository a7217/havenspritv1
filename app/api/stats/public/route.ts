import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Job } from "@/lib/models/Job";
import { Tender } from "@/lib/models/Tender";
import { Application } from "@/lib/models/Application";

export async function GET() {
  try {
    await connectDB();

    const [activeJobs, activeTenders, totalApplications, vacanciesAgg, deptAgg] =
      await Promise.all([
        Job.countDocuments({ isActive: true }),
        Tender.countDocuments({ status: "ACTIVE" }),
        Application.countDocuments(),
        Job.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: null, total: { $sum: "$vacancies" } } },
        ]),
        Job.distinct("department", { isActive: true }),
      ]);

    const totalVacancies = vacanciesAgg[0]?.total ?? 0;
    const partnerDepts   = deptAgg.length;

    const response = NextResponse.json({
      success: true,
      data: {
        totalVacancies,
        totalApplications,
        activeProjects: activeTenders,
        partnerDepts,
        activeJobs,
      },
    });
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300"
    );
    return response;
  } catch (err) {
    console.error("GET /api/stats/public error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
