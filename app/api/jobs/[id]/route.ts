import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { Job } from "@/lib/models/Job";
import { isAdminAuthorized } from "@/lib/adminAuth";

const ALLOWED_FIELDS = new Set([
  "title", "project", "location", "salary", "salaryFull",
  "experience", "vacancies", "lastDate", "shiftTiming", "department",
  "qualification", "description", "responsibilities", "qualifications",
  "documents", "isActive",
]);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAdminAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (ALLOWED_FIELDS.has(key)) sanitized[key] = value;
    }

    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields to update." },
        { status: 400 }
      );
    }

    const updated = await Job.findByIdAndUpdate(
      id,
      { $set: sanitized },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Job not found." },
        { status: 404 }
      );
    }
    revalidatePath("/");
    revalidatePath("/jobs");
    revalidatePath(`/jobs/${id}`);
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PATCH /api/jobs/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Update failed." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await isAdminAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const { id } = await params;
    const job = await Job.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found." },
        { status: 404 }
      );
    }
    revalidatePath("/");
    revalidatePath("/jobs");
    revalidatePath(`/jobs/${id}`);
    return NextResponse.json({ success: true, message: "Job closed successfully." });
  } catch (err) {
    console.error("DELETE /api/jobs/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to close job." },
      { status: 500 }
    );
  }
}
