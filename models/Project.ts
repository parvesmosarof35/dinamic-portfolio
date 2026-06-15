import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    featuredImage: { type: String, default: "" },
    galleryImages: [{ type: String }],
    techStack: [{ type: String }],
    liveUrl: { type: String, default: "" },
    frontendUrl: { type: String, default: "" },
    backendUrl: { type: String, default: "" },
    mobileAppUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    showLive: { type: Boolean, default: true },
    showFrontend: { type: Boolean, default: true },
    showBackend: { type: Boolean, default: true },
    showApp: { type: Boolean, default: false },
    showGithub: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["Completed", "Running", "Client Project", "Personal Project"],
      default: "Completed",
    },
    isFeatured: { type: Boolean, default: false },
    projectType: {
      type: String,
      enum: ["Frontend", "Backend", "Full Stack", "Mobile App", "AI Project"],
      default: "Full Stack",
    },
    features: [{ type: String }],
    challenges: { type: String, default: "" },
    solutions: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Project = models.Project || model("Project", ProjectSchema);
