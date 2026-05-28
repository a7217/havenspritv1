import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Application } from "@/lib/models/Application";
import { isAdminAuthorized } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!await isAdminAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const [total, selected, pending, shortlisted, tenderBreakdown] =
      await Promise.all([
        Application.countDocuments(),
        Application.countDocuments({ applicationStatus: "SELECTED" }),
        Application.countDocuments({ applicationStatus: "PENDING" }),
        Application.countDocuments({ applicationStatus: "SHORTLISTED" }),
        Application.aggregate([
          { $match: { tender: { $exists: true, $nin: [null, ""] } } },
          { $group: { _id: "$tender", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        totalApplications:  total,
        selectedCandidates: selected,
        pendingReviews:     pending,
        shortlisted,
        tenderDistribution: tenderBreakdown.map((t) => ({
          name:  String(t._id),
          count: t.count as number,
        })),
      },
    });
  } catch (err) {
    console.error("GET /api/stats error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
