import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Tender } from "@/lib/models/Tender";
import { isAdminAuthorized } from "@/lib/adminAuth";

const ALLOWED_TENDER_FIELDS = new Set([
  "projectName", "clientDept", "tenderRef", "totalJobs", "jobsFilled",
  "activeVacancies", "startDate", "endDate", "status", "tendersManaged",
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
      if (ALLOWED_TENDER_FIELDS.has(key)) sanitized[key] = value;
    }

    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields to update." },
        { status: 400 }
      );
    }

    const updated = await Tender.findByIdAndUpdate(
      id,
      { $set: sanitized },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("PATCH /api/tenders/[id] error:", err);
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
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
    const deleted = await Tender.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("DELETE /api/tenders/[id] error:", err);
    return NextResponse.json({ success: false, error: "Delete failed" }, { status: 500 });
  }
}
