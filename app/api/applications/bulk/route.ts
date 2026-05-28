import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Application } from "@/lib/models/Application";
import { isAdminAuthorized } from "@/lib/adminAuth";

const VALID_STATUSES = new Set(["PENDING", "SHORTLISTED", "SELECTED", "REJECTED"]);

export async function PATCH(req: NextRequest) {
  if (!await isAdminAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const { ids, applicationStatus } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "No IDs provided" },
        { status: 400 }
      );
    }
    if (!applicationStatus || !VALID_STATUSES.has(applicationStatus)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value." },
        { status: 400 }
      );
    }

    await Application.updateMany({ _id: { $in: ids } }, { applicationStatus });
    return NextResponse.json({
      success: true,
      message: `Updated ${ids.length} applications`,
    });
  } catch (err) {
    console.error("PATCH /api/applications/bulk error:", err);
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

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "No IDs provided" },
        { status: 400 }
      );
    }

    await Application.deleteMany({ _id: { $in: ids } });
    return NextResponse.json({
      success: true,
      message: `Deleted ${ids.length} applications`,
    });
  } catch (err) {
    console.error("DELETE /api/applications/bulk error:", err);
    return NextResponse.json(
      { success: false, error: "Bulk delete failed" },
      { status: 500 }
    );
  }
}
