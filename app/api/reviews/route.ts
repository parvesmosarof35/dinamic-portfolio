import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Review } from "@/models/Review";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const reviews = await Review.find().sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching reviews", error: error.message },
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

    if (!body.clientName || !body.reviewText) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const review = await Review.create(body);
    return NextResponse.json({ message: "Review created successfully", review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error creating review", error: error.message },
      { status: 500 }
    );
  }
}
