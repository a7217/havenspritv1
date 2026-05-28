import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/adminAuth";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  if (!await isAdminAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    const validPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (currentPassword !== validPassword) {
      return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 400 });
    }
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ success: false, error: "New password must be at least 6 characters" }, { status: 400 });
    }

    const envPath = path.join(process.cwd(), ".env");
    let content = fs.readFileSync(envPath, "utf-8");

    if (/^ADMIN_PASSWORD=.*/m.test(content)) {
      content = content.replace(/^ADMIN_PASSWORD=.*/m, `ADMIN_PASSWORD=${newPassword}`);
    } else {
      content += `\nADMIN_PASSWORD=${newPassword}`;
    }

    fs.writeFileSync(envPath, content, "utf-8");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("change-password error:", err);
    return NextResponse.json({ success: false, error: "Failed to update password" }, { status: 500 });
  }
}
