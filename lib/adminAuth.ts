import { NextRequest } from "next/server";
import { verifyAdminToken } from "./jwt";

export async function isAdminAuthorized(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("adminSession")?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}
