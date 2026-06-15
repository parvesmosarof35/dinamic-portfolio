import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Message } from "@/models/Message";
import { verifyAuth } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const messages = await Message.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching messages", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const newMessage = await Message.create({ name, email, subject, message });

    // Send email alert
    try {
      const emailHtml = `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <h2 style="color: #333;">New Contact Message Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; font-style: italic;">
            ${message.replace(/\n/g, "<br/>")}
          </div>
        </div>
      `;
      await sendEmail({
        to: process.env.NODEMAILER_EMAIL || "parvesmosarof2@gmail.com",
        subject: `[Portfolio Alert] New Message: ${subject}`,
        html: emailHtml,
      });
    } catch (e) {
      console.error("Email notification sending failed:", e);
    }

    return NextResponse.json(
      { message: "Message submitted successfully", data: newMessage },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error submitting message", error: error.message },
      { status: 500 }
    );
  }
}
