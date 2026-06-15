import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/Project";
import { Blog } from "@/models/Blog";
import { Learning } from "@/models/Learning";
import { Review } from "@/models/Review";
import { Message } from "@/models/Message";
import { Booking } from "@/models/Booking";
import { verifyAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const [
      totalProjects,
      totalBlogs,
      totalLearnings,
      totalReviews,
      totalMessages,
      unreadMessages,
      totalBookings,
      pendingBookings,
      recentMessages,
      recentBookings,
    ] = await Promise.all([
      Project.countDocuments(),
      Blog.countDocuments(),
      Learning.countDocuments(),
      Review.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ isRead: false }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "Pending" }),
      Message.find().sort({ createdAt: -1 }).limit(5),
      Booking.find().sort({ createdAt: -1 }).limit(5),
    ]);

    return NextResponse.json({
      counters: {
        projects: totalProjects,
        blogs: totalBlogs,
        learnings: totalLearnings,
        reviews: totalReviews,
        messages: {
          total: totalMessages,
          unread: unreadMessages,
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
        },
      },
      recentMessages,
      recentBookings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error compiling analytics", error: error.message },
      { status: 500 }
    );
  }
}
