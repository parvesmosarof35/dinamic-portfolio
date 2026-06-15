import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { file, folder } = await req.json();
    if (!file) {
      return NextResponse.json({ message: "No file data provided" }, { status: 400 });
    }

    const secureUrl = await uploadImage(file, folder || "general");
    return NextResponse.json({ url: secureUrl });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { message: "Error uploading image to Cloudinary", error: error.message },
      { status: 500 }
    );
  }
}
