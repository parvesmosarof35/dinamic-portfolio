import { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/Project";
import { Blog } from "@/models/Blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await connectToDatabase();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

    const projects = await Project.find().select("slug updatedAt");
    const projectUrls = projects.map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      lastModified: new Date(p.updatedAt),
    }));

    const blogs = await Blog.find().select("slug updatedAt");
    const blogUrls = blogs.map((b) => ({
      url: `${siteUrl}/blogs/${b.slug}`,
      lastModified: new Date(b.updatedAt),
    }));

    const staticUrls = [
      { url: `${siteUrl}`, lastModified: new Date() },
      { url: `${siteUrl}/blogs`, lastModified: new Date() },
      { url: `${siteUrl}/learnings`, lastModified: new Date() },
    ];

    return [...staticUrls, ...projectUrls, ...blogUrls];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return [
      { url: "https://example.com", lastModified: new Date() }
    ];
  }
}
