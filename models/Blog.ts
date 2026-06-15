import mongoose, { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    featuredImage: { type: String, default: "" },
    content: { type: String, required: true }, // markdown content
    tags: [{ type: String }],
    category: { type: String, required: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true }
);

export const Blog = models.Blog || model("Blog", BlogSchema);
