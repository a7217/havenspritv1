import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Job } from "@/lib/models/Job";
import { isAdminAuthorized } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!await isAdminAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: jobs });
  } catch (err) {
    console.error("GET /api/jobs error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!await isAdminAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await req.json();

    const job = await Job.create({
      title:            body.title,
      project:          body.project || `[Associated Project: ${body.tender}]`,
      location:         body.location,
      salary:           body.salaryFull,
      salaryFull:       body.salaryFull,
      experience:       body.experience,
      vacancies:        Number(body.vacancies) || 1,
      lastDate:         body.lastDate,
      shiftTiming:      body.shiftTiming || "Full-Time, 9 AM - 6 PM",
      department:       body.department,
      qualification:    body.qualification,
      description:      body.description,
      responsibilities: body.responsibilities || [],
      qualifications:   body.qualifications || [],
      documents:        body.documents || [],
    });

    revalidatePath("/");
    revalidatePath("/jobs");
    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (err) {
    console.error("POST /api/jobs error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create job" },
      { status: 500 }
    );
  }
}
