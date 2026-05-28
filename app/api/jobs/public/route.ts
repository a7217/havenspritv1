import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Job } from "@/lib/models/Job";

export async function GET() {
  try {
    await connectDB();
    const jobs = await Job.find({ isActive: true })
      .select(
        "title project location salary salaryFull experience vacancies lastDate shiftTiming department qualification description responsibilities qualifications documents"
      )
      .sort({ createdAt: -1 });

    const response = NextResponse.json({ success: true, data: jobs });
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300"
    );
    return response;
  } catch (err) {
    console.error("GET /api/jobs/public error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
