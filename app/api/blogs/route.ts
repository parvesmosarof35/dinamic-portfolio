import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Blog } from "@/models/Blog";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const relatedTo = searchParams.get("relatedTo");
    if (relatedTo) {
      const currentBlog = await Blog.findOne({
        $or: [
          { slug: relatedTo },
          ...(relatedTo.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: relatedTo }] : []),
        ],
      });
      if (!currentBlog) {
        const fallback = await Blog.find().limit(3);
        return NextResponse.json(fallback);
      }
      const related = await Blog.find({
        category: currentBlog.category,
        _id: { $ne: currentBlog._id },
      }).limit(3);
      return NextResponse.json(related);
    }

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

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "6", 10);
    const skip = (page - 1) * limit;

    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      blogs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching blogs", error: error.message },
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

    const existing = await Blog.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json({ message: "Slug already exists" }, { status: 400 });
    }

    const blog = await Blog.create(body);
    return NextResponse.json({ message: "Blog created successfully", blog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error creating blog", error: error.message },
      { status: 500 }
    );
  }
}
