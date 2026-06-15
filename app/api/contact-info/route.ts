import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ContactInfo } from "@/models/ContactInfo";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    let contact = await ContactInfo.findOne();
    if (!contact) {
      contact = await ContactInfo.create({});
    }
    return NextResponse.json(contact);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching contact info", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    let contact = await ContactInfo.findOne();
    if (!contact) {
      contact = new ContactInfo(body);
    } else {
      Object.assign(contact, body);
    }

    await contact.save();
    return NextResponse.json({ message: "Contact info updated successfully", contact });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating contact info", error: error.message },
      { status: 500 }
    );
  }
}
