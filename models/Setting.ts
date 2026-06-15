import mongoose, { Schema, model, models } from "mongoose";

const SettingSchema = new Schema(
  {
    logoText: { type: String, default: "DevParves" },
    siteName: { type: String, default: "Parves Mosarof | Full Stack Developer Portfolio" },
    footerText: { type: String, default: "© 2026 Parves Mosarof. All rights reserved." },
    metaTitle: { type: String, default: "Parves Mosarof | Full Stack Developer Portfolio" },
    metaDescription: { type: String, default: "Portfolio of a Full Stack Developer showing projects, blogs, learnings, and client reviews." },
    keywords: [{ type: String }],
    ogImage: { type: String, default: "" },
    robotsTxt: { type: String, default: "User-agent: *\nAllow: /" },
    sitemapXml: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Setting = models.Setting || model("Setting", SettingSchema);
