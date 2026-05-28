import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Tender } from "@/lib/models/Tender";
import { isAdminAuthorized } from "@/lib/adminAuth";

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: NextRequest) {
  if (!await isAdminAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const name   = searchParams.get("name");
    const dept   = searchParams.get("dept");
    const status = searchParams.get("status");

    const query: Record<string, unknown> = {};
    if (name) {
      const safe = escapeRegex(name.trim().slice(0, 100));
      query.$or = [
        { projectName: { $regex: safe, $options: "i" } },
        { projectId:   { $regex: safe, $options: "i" } },
      ];
    }
    if (dept   && dept   !== "All") query.clientDept = dept;
    if (status && status !== "All") query.status = status;

    const tenders = await Tender.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: tenders });
  } catch (err) {
    console.error("GET /api/tenders error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tenders" },
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
    const tender = await Tender.create({
      projectName:     body.projectName,
      clientDept:      body.clientDept || "NHAI",
      tenderRef:       body.tenderRef || "",
      totalJobs:       Number(body.totalJobs) || 0,
      jobsFilled:      Number(body.jobsFilled) || 0,
      activeVacancies: Number(body.activeVacancies) || 0,
      startDate:       body.startDate || "",
      endDate:         body.endDate || "",
      status:          body.status || "ACTIVE",
      tendersManaged:  Number(body.tendersManaged) || 1,
    });
    return NextResponse.json({ success: true, data: tender }, { status: 201 });
  } catch (err) {
    console.error("POST /api/tenders error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create tender" },
      { status: 500 }
    );
  }
}
