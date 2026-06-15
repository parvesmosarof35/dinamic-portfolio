import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Please define the DATABASE_URL environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(DATABASE_URL!, opts).then(async (mongooseInstance) => {
      // Seed Super Admin if it doesn't exist
      try {
        const adminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@example.com";
        const adminPass = process.env.SUPER_ADMIN_PASS || "admin123";

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
          const hashedPassword = await bcrypt.hash(adminPass, 12);
          await User.create({
            email: adminEmail,
            password: hashedPassword,
            name: "Super Admin",
            designation: "Full Stack Developer",
            avatar: "",
          });
          console.log("Super admin user seeded successfully.");
        }
      } catch (err) {
        console.error("Error seeding super admin:", err);
      }

      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
