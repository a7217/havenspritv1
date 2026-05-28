import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Job } from "@/lib/models/Job";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const job = await Job.findOne({ _id: id, isActive: true });
    if (!job) return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: job });
  } catch (err) {
    console.error("GET /api/jobs/public/[id] error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch job" }, { status: 500 });
  }
}
