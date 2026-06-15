import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Hero } from "@/models/Hero";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({});
    }
    return NextResponse.json(hero);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching hero data", error: error.message },
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

    let hero = await Hero.findOne();
    if (!hero) {
      hero = new Hero(body);
    } else {
      Object.assign(hero, body);
    }

    await hero.save();
    return NextResponse.json({ message: "Hero data updated successfully", hero });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error updating hero data", error: error.message },
      { status: 500 }
    );
  }
}
