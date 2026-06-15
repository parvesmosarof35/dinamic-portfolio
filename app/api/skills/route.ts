import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { SkillCategory } from "@/models/Skill";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await SkillCategory.find().sort({ createdAt: 1 });
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching skills", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { name, skills } = await req.json();

    if (!name) {
      return NextResponse.json({ message: "Category name is required" }, { status: 400 });
    }

    const category = await SkillCategory.create({ name, skills: skills || [] });
    return NextResponse.json({ message: "Skill category created", category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error creating skill category", error: error.message },
      { status: 500 }
    );
  }
}
