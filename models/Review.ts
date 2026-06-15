import mongoose, { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    clientName: { type: String, required: true },
    companyName: { type: String },
    country: { type: String },
    profileImage: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    reviewText: { type: String, required: true },
    projectName: { type: String },
    isFeatured: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Review = models.Review || model("Review", ReviewSchema);
