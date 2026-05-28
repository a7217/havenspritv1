import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Application } from "@/lib/models/Application";
import { isAdminAuthorized } from "@/lib/adminAuth";

const PALETTE = [
  "#1a2744", "#f59e0b", "#10b981", "#ef4444",
  "#6366f1", "#8b5cf6", "#ec4899", "#06b6d4",
];

export async function GET(req: NextRequest) {
  if (!await isAdminAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const [dailyAgg, qualAgg, cityAgg, statusAgg] = await Promise.all([
      Application.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Application.aggregate([
        { $match: { qualification: { $nin: [null, ""] } } },
        { $group: { _id: "$qualification", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      Application.aggregate([
        { $match: { city: { $nin: [null, ""] } } },
        { $group: { _id: "$city", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
      Application.aggregate([
        { $group: { _id: "$applicationStatus", count: { $sum: 1 } } },
      ]),
    ]);

    const dailyMap = new Map(
      dailyAgg.map((d) => [d._id as string, d.count as number])
    );
    const dailyTrends = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      return {
        day: `${d.getDate()}/${d.getMonth() + 1}`,
        date: key,
        apps: dailyMap.get(key) ?? 0,
      };
    });

    const qualDist = qualAgg.map((q, i) => ({
      name:  String(q._id),
      value: q.count as number,
      color: PALETTE[i % PALETTE.length],
    }));

    const cityDist = cityAgg.map((c, i) => ({
      name:  String(c._id),
      count: (c.count as number).toLocaleString("en-IN"),
      color: PALETTE[i % PALETTE.length],
    }));

    const statusMap: Record<string, number> = {};
    for (const s of statusAgg) {
      statusMap[s._id as string] = s.count as number;
    }
    const statusDist = [
      {
        label: "Status",
        PENDING:     statusMap.PENDING     ?? 0,
        SHORTLISTED: statusMap.SHORTLISTED ?? 0,
        SELECTED:    statusMap.SELECTED    ?? 0,
        REJECTED:    statusMap.REJECTED    ?? 0,
      },
    ];

    return NextResponse.json({
      success: true,
      data: { dailyTrends, qualDist, cityDist, statusDist },
    });
  } catch (err) {
    console.error("GET /api/stats/analytics error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
