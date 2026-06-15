import mongoose, { Schema, model, models } from "mongoose";

const BookingSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true }, // format: YYYY-MM-DD
    time: { type: String, required: true }, // format: HH:MM
    purpose: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Booking = models.Booking || model("Booking", BookingSchema);
