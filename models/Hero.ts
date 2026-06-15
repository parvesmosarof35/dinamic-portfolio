import mongoose, { Schema, model, models } from "mongoose";

const HeroSchema = new Schema(
  {
    name: { type: String, default: "Parves Mosarof" },
    designation: { type: String, default: "Full Stack Developer" },
    bio: { type: String, default: "I excel at crafting elegant digital experiences." },
    image: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    whatsappUrl: { type: String, default: "" },
    emailUrl: { type: String, default: "" },
    downloadCvUrl: { type: String, default: "" },
    showCvButton: { type: Boolean, default: true },
    customButtonText: { type: String, default: "Download CV" },
    backgroundImage: { type: String, default: "" },
    backgroundVideo: { type: String, default: "" },
    enableAnimation: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Hero = models.Hero || model("Hero", HeroSchema);
