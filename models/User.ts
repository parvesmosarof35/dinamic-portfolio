import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    designation: { type: String },
    avatar: { type: String },
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
