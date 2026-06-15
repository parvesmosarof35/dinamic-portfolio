import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Learning } from "@/models/Learning";
import { verifyAuth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    let learning;
    if (mongoose.Types.ObjectId.isValid(id)) {
      learning = await Learning.findById(id);
    } else {
      learning = await Learning.findOne({ slug: id });
    }

    if (!learning) {
      return NextResponse.json({ message: "Learning not found" }, { status: 404 });
    }

    return NextResponse.json(learning);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching learning details", error: error.message },
      { status: 500 }
    );
  }
}

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

    let learning;
    if (mongoose.Types.ObjectId.isValid(id)) {
      learning = await Learning.findByIdAndUpdate(id, body, { new: true });
    } else {
      learning = await Learning.findOneAndUpdate({ slug: id }, body, { new: true });
    }

    if (!learning) {
      return NextResponse.json({ message: "Learning not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Learning updated successfully", learning });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating learning", error: error.message },
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

    let learning;
    if (mongoose.Types.ObjectId.isValid(id)) {
      learning = await Learning.findByIdAndDelete(id);
    } else {
      learning = await Learning.findOneAndDelete({ slug: id });
    }

    if (!learning) {
      return NextResponse.json({ message: "Learning not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Learning deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error deleting learning", error: error.message },
      { status: 500 }
    );
  }
}
