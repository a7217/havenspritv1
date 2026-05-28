import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Tender } from "@/lib/models/Tender";
import { isAdminAuthorized } from "@/lib/adminAuth";

const VALID_STATUSES = new Set(["ACTIVE", "CLOSED", "PENDING"]);

export async function PATCH(req: NextRequest) {
  if (!await isAdminAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const { ids, status } = await req.json();
    if (!ids?.length) {
      return NextResponse.json({ success: false, error: "No IDs" }, { status: 400 });
    }
    if (!status || !VALID_STATUSES.has(status)) {
      return NextResponse.json({ success: false, error: "Invalid status value." }, { status: 400 });
    }
    await Tender.updateMany({ _id: { $in: ids } }, { status });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/tenders/bulk error:", err);
    return NextResponse.json(
      { success: false, error: "Bulk update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!await isAdminAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const { ids } = await req.json();
    if (!ids?.length) {
      return NextResponse.json({ success: false, error: "No IDs" }, { status: 400 });
    }
    await Tender.deleteMany({ _id: { $in: ids } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/tenders/bulk error:", err);
    return NextResponse.json(
      { success: false, error: "Bulk delete failed" },
      { status: 500 }
    );
  }
}
