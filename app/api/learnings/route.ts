import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Learning } from "@/models/Learning";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const filter: any = {};

    const category = searchParams.get("category");
    if (category && category !== "All") {
      filter.category = category;
    }

    const search = searchParams.get("search");
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const learnings = await Learning.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(learnings);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching learnings", error: error.message },
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

    if (!body.title || !body.slug || !body.content || !body.category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existing = await Learning.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json({ message: "Slug already exists" }, { status: 400 });
    }

    const learning = await Learning.create(body);
    return NextResponse.json({ message: "Learning created successfully", learning }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error creating learning", error: error.message },
      { status: 500 }
    );
  }
}
