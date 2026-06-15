import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { verifyAuth } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const date = searchParams.get("date");
    const user = await verifyAuth(req);

    if (date && !user) {
      const bookings = await Booking.find({ date, status: { $ne: "Rejected" } }).select("time");
      const bookedSlots = bookings.map((b) => b.time);
      return NextResponse.json(bookedSlots);
    }

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const bookings = await Booking.find().sort({ date: 1, time: 1 });
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching bookings", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { name, email, date, time, purpose } = await req.json();

    if (!name || !email || !date || !time || !purpose) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const existing = await Booking.findOne({ date, time, status: { $ne: "Rejected" } });
    if (existing) {
      return NextResponse.json({ message: "This time slot is already booked" }, { status: 400 });
    }

    const booking = await Booking.create({
      name,
      email,
      date,
      time,
      purpose,
      status: "Pending",
    });

    try {
      const emailHtml = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #4f46e5;">New Calendar Booking Request</h2>
          <p><strong>Client:</strong> ${name} (${email})</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Purpose:</strong></p>
          <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${purpose}</p>
          <p>Go to your dashboard to approve or reject this booking.</p>
        </div>
      `;
      await sendEmail({
        to: process.env.NODEMAILER_EMAIL || "parvesmosarof2@gmail.com",
        subject: `[Booking Request] New Request from ${name}`,
        html: emailHtml,
      });
    } catch (e) {
      console.error("Booking email alert failed:", e);
    }

    return NextResponse.json(
      { message: "Booking requested successfully. We will confirm shortly!", booking },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error requesting booking", error: error.message },
      { status: 500 }
    );
  }
}
