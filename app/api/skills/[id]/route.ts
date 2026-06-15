import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { SkillCategory } from "@/models/Skill";
import { verifyAuth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();
    const body = await req.json();

    const category = await SkillCategory.findByIdAndUpdate(id, body, { new: true });
    if (!category) {
      return NextResponse.json({ message: "Skill category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Skill category updated", category });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating skill category", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDatabase();

    const category = await SkillCategory.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ message: "Skill category not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Skill category deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error deleting skill category", error: error.message },
      { status: 500 }
    );
  }
}
