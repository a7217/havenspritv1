import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Department } from "@/lib/models/Department";
import { isAdminAuthorized } from "@/lib/adminAuth";

const DEFAULT_JOB_DEPTS    = ["Government", "Education", "Environmental", "Communication", "Infrastructure", "Finance", "Other"];
const DEFAULT_TENDER_DEPTS = ["NHAI", "PWD", "Metro", "CPWD", "Railways", "MES", "DMRC"];

async function seedOnce() {
  const count = await Department.countDocuments({ _seeded: { $exists: false } });
  const total = await Department.countDocuments();
  if (total === 0) {
    const docs = [
      ...DEFAULT_JOB_DEPTS.map((name) => ({ name, type: "job",    isActive: true })),
      ...DEFAULT_TENDER_DEPTS.map((name) => ({ name, type: "tender", isActive: true })),
    ];
    await Department.insertMany(docs);
  }
  void count;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    await seedOnce();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const query: Record<string, unknown> = { isActive: true };
    if (type && type !== "all") query.type = { $in: [type, "both"] };
    if (type === "all") delete query.isActive;
    const departments = await Department.find(type === "all" ? {} : query).sort({ name: 1 });
    return NextResponse.json({ success: true, data: departments });
  } catch (err) {
    console.error("GET /api/departments error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch departments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!await isAdminAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await req.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, error: "Department name is required" }, { status: 400 });
    }
    const existing = await Department.findOne({ name: { $regex: new RegExp(`^${body.name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } });
    if (existing) {
      return NextResponse.json({ success: false, error: "Department already exists" }, { status: 409 });
    }
    const dept = await Department.create({
      name:     body.name.trim(),
      type:     body.type || "both",
      isActive: true,
    });
    return NextResponse.json({ success: true, data: dept }, { status: 201 });
  } catch (err) {
    console.error("POST /api/departments error:", err);
    return NextResponse.json({ success: false, error: "Failed to create department" }, { status: 500 });
  }
}
