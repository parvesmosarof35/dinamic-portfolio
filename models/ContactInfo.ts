import mongoose, { Schema, model, models } from "mongoose";

const ContactInfoSchema = new Schema(
  {
    address: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    facebook: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ContactInfo = models.ContactInfo || model("ContactInfo", ContactInfoSchema);
