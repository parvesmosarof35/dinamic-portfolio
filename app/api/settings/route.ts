import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Setting } from "@/models/Setting";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching settings", error: error.message },
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

    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting(body);
    } else {
      Object.assign(settings, body);
    }

    await settings.save();
    return NextResponse.json({ message: "Settings updated successfully", settings });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating settings", error: error.message },
      { status: 500 }
    );
  }
}
