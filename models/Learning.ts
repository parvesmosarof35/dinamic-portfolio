import mongoose, { Schema, model, models } from "mongoose";

const LearningSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true }, // markdown content
    category: { type: String, required: true }, // React, Next.js, Node.js, AWS, etc.
    tags: [{ type: String }],
    difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Intermediate" },
  },
  { timestamps: true }
);

export const Learning = models.Learning || model("Learning", LearningSchema);
