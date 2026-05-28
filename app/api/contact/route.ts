import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/lib/models/Contact";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }
    const contact = await Contact.create({ name, email, subject, message });
    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to save message" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: contacts });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 });
  }
}
