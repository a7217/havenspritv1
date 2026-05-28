import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "application/pdf"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only PDF, JPG and PNG files are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "File size exceeds the 5 MB limit." },
        { status: 400 }
      );
    }

    const bytes   = await file.arrayBuffer();
    const base64  = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: "auto",
      folder: "govt-tender",
      use_filename: true,
      unique_filename: true,
    });

    return NextResponse.json({
      success:    true,
      url:        result.secure_url,
      displayUrl: result.secure_url,
      deleteUrl:  null,
    });
  } catch (err) {
    console.error("POST /api/upload error:", err);
    return NextResponse.json({ success: false, error: "Upload failed. Please try again." }, { status: 500 });
  }
}
