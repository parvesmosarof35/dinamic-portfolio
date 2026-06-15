import mongoose, { Schema, model, models } from "mongoose";

const SkillItemSchema = new Schema({
  name: { type: String, required: true },
  icon: { type: String }, // store lucide icon name as a string (e.g. "Cpu", "Code")
  percentage: { type: Number, default: 0 },
  description: { type: String },
});

const SkillCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    skills: [SkillItemSchema],
  },
  { timestamps: true }
);

export const SkillCategory = models.SkillCategory || model("SkillCategory", SkillCategorySchema);
