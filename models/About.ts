import mongoose, { Schema, model, models } from "mongoose";

const TimelineItemSchema = new Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
});

const AboutSchema = new Schema(
  {
    profileImage: { type: String, default: "" },
    image1: { type: String, default: "" },
    image2: { type: String, default: "" },
    image3: { type: String, default: "" },
    personalStory: { type: String, default: "" },
    journey: [TimelineItemSchema],
    workExperience: [TimelineItemSchema],
    education: [TimelineItemSchema],
    hobbies: [{ type: String }],
    enableJourney: { type: Boolean, default: true },
    enableWork: { type: Boolean, default: true },
    enableEducation: { type: Boolean, default: true },
    enableHobbies: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const About = models.About || model("About", AboutSchema);
