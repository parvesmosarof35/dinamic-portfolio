import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { About } from "@/models/About";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    let about = await About.findOne();
    if (!about) {
      about = await About.create({
        journey: [],
        workExperience: [],
        education: [],
        hobbies: [],
      });
    }
    return NextResponse.json(about);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching about data", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    let about = await About.findOne();
    if (!about) {
      about = new About(body);
    } else {
      Object.assign(about, body);
    }

    await about.save();
    return NextResponse.json({ message: "About data updated successfully", about });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating about data", error: error.message },
      { status: 500 }
    );
  }
}
