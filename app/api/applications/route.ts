import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Application } from "@/lib/models/Application";
import { isAdminAuthorized } from "@/lib/adminAuth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[6-9]\d{9}$/;
const AADHAAR_RE = /^\d{12}$/;
const PINCODE_RE = /^\d{6}$/;

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
    const status = searchParams.get("status");
    const tender = searchParams.get("tender");
    const rawSearch = searchParams.get("search");
    const page  = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") || "100")));
    const skip  = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (status && status !== "All") query.applicationStatus = status;
    if (tender && tender !== "All") query.tender = tender;
    if (rawSearch) {
      const safe = escapeRegex(rawSearch.trim().slice(0, 100));
      query.$or = [
        { fullName: { $regex: safe, $options: "i" } },
        { jobTitle: { $regex: safe, $options: "i" } },
        { email:    { $regex: safe, $options: "i" } },
      ];
    }

    const [applications, total] = await Promise.all([
      Application.find(query)
        .select("-aadhaar -address -pinCode")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("GET /api/applications error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.fullName?.trim()) {
      return NextResponse.json({ success: false, error: "Full name is required." }, { status: 400 });
    }
    if (!body.email || !EMAIL_RE.test(body.email)) {
      return NextResponse.json({ success: false, error: "Valid email address is required." }, { status: 400 });
    }
    if (!body.mobile || !MOBILE_RE.test(body.mobile)) {
      return NextResponse.json({ success: false, error: "Valid 10-digit mobile number is required." }, { status: 400 });
    }
    if (body.aadhaar && !AADHAAR_RE.test(body.aadhaar)) {
      return NextResponse.json({ success: false, error: "Aadhaar number must be exactly 12 digits." }, { status: 400 });
    }
    if (body.pinCode && !PINCODE_RE.test(body.pinCode)) {
      return NextResponse.json({ success: false, error: "PIN code must be exactly 6 digits." }, { status: 400 });
    }
    if (!body.jobId || !body.jobTitle) {
      return NextResponse.json({ success: false, error: "Job information is missing." }, { status: 400 });
    }

    const application = await Application.create({
      jobId:         body.jobId,
      jobTitle:      body.jobTitle,
      tender:        body.tender || "General",
      fullName:      body.fullName.trim(),
      fatherName:    body.fatherName?.trim() || "",
      mobile:        body.mobile,
      email:         body.email.toLowerCase().trim(),
      dob:           body.dob           || "",
      aadhaar:       body.aadhaar       || "",
      address:       body.address?.trim() || "",
      state:         body.state         || "",
      city:          body.city          || "",
      pinCode:       body.pinCode       || "",
      qualification: body.qualification || "",
      experience:    Math.max(0, Number(body.experience) || 0),
      employer:      body.employer?.trim() || "",
      resumeUrl:              body.resumeUrl              || "",
      idProofUrl:             body.idProofUrl             || "",
      photoUrl:               body.photoUrl               || "",
      additionalCertificate:  body.additionalCertificate?.trim() || "",
      preferredDistrict:      body.preferredDistrict?.trim()     || "",
      preferredBlocks:        Array.isArray(body.preferredBlocks)
        ? body.preferredBlocks.map((b: string) => b?.trim()).filter(Boolean)
        : [],
    });

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (err) {
    console.error("POST /api/applications error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to submit application." },
      { status: 500 }
    );
  }
}
