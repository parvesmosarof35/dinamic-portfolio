import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/Project";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const filter: any = {};

    const type = searchParams.get("type");
    if (type && type !== "All") {
      // Map to exact enum values matching database enum
      // Enum values in Project.ts: ["Frontend", "Backend", "Full Stack", "Mobile App", "AI Project"]
      // Filter values passed: frontend, backend, fullstack, mobile, ai (convert dynamically)
      if (type.toLowerCase() === "frontend") filter.projectType = "Frontend";
      else if (type.toLowerCase() === "backend") filter.projectType = "Backend";
      else if (type.toLowerCase() === "full stack" || type.toLowerCase() === "fullstack") filter.projectType = "Full Stack";
      else if (type.toLowerCase() === "mobile app" || type.toLowerCase() === "mobile") filter.projectType = "Mobile App";
      else if (type.toLowerCase() === "ai project" || type.toLowerCase() === "ai") filter.projectType = "AI Project";
      else filter.projectType = type;
    }

    const isFeatured = searchParams.get("featured");
    if (isFeatured === "true") {
      filter.isFeatured = true;
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching projects", error: error.message },
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
    const body = await req.json();

    if (!body.name || !body.slug || !body.shortDescription || !body.longDescription) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existing = await Project.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json({ message: "Project slug already exists" }, { status: 400 });
    }

    const project = await Project.create(body);
    return NextResponse.json({ message: "Project created successfully", project }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error creating project", error: error.message },
      { status: 500 }
    );
  }
}
