import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface DecodedToken {
  userId: string;
  email: string;
}

export async function verifyAuth(req: NextRequest): Promise<DecodedToken | null> {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return null;
    }

    const secret = process.env.JWT_ACCESS_SECRET || "fallback_secret";
    const decoded = jwt.verify(token, secret) as DecodedToken;
    return decoded;
  } catch (error) {
    return null;
  }
}
