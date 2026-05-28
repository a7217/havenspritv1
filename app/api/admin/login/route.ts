import { NextRequest, NextResponse } from "next/server";
import { signAdminToken } from "@/lib/jwt";

const attempts = new Map<string, { count: number; resetAt: number }>();

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now > rec.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return false;
  }
  if (rec.count >= 5) return true;
  rec.count++;
  return false;
}

export async function POST(req: NextRequest) {
  const ip = getIP(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many login attempts. Please try again in 15 minutes.",
      },
      { status: 429 }
    );
  }

  try {
    const { username, password } = await req.json();
    const validUsername = process.env.ADMIN_USERNAME || "admin";
    const validPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await signAdminToken();
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });
    response.cookies.set("adminSession", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 60 * 60,
    });
    attempts.delete(ip);
    return response;
  } catch (err) {
    console.error("POST /api/admin/login error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
