import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AdminProfile } from "@/lib/models/AdminProfile";
import { isAdminAuthorized } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!await isAdminAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    let profile = await AdminProfile.findOne().lean() as {
      name?: string; email?: string; phone?: string; designation?: string;
    } | null;
    if (!profile) {
      profile = await AdminProfile.create({});
    }
    return NextResponse.json({ success: true, data: profile });
  } catch (err) {
    console.error("GET /api/admin/profile error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!await isAdminAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await req.json();
    const allowed = ["name", "email", "phone", "designation"];
    const update: Record<string, string> = {};
    for (const key of allowed) {
      if (typeof body[key] === "string") update[key] = body[key].trim();
    }
    const profile = await AdminProfile.findOneAndUpdate(
      {},
      { $set: update },
      { new: true, upsert: true }
    );
    return NextResponse.json({ success: true, data: profile });
  } catch (err) {
    console.error("PATCH /api/admin/profile error:", err);
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}
