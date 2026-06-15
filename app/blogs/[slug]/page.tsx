import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { Blog } from "@/models/Blog";

export const dynamic = "force-dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { ArrowLeft, Calendar, Tag, User } from "lucide-react";

interface BlogDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailsPageProps) {
  await connectToDatabase();
  const { slug } = await params;
  const blog = await Blog.findOne({ slug });
  if (!blog) return { title: "Blog Not Found" };
  return {
    title: `${blog.metaTitle || blog.title} | Blogs`,
    description: blog.metaDescription || blog.title,
  };
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  await connectToDatabase();
  const { slug } = await params;
  const blog = await Blog.findOne({ slug });

  if (!blog) {
    notFound();
  }

  const relatedBlogs = await Blog.find({
    category: blog.category,
    _id: { $ne: blog._id },
  })
    .sort({ createdAt: -1 })
    .limit(3);

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/blogs"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Blogs</span>
          </Link>

          {/* Blog Meta */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-primary" />
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Tag size={14} className="text-primary" />
                {blog.category}
              </span>
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-primary" />
                By Admin
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              {blog.title}
            </h1>
          </div>

          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="aspect-video w-full rounded-3xl overflow-hidden border border-border shadow-md mb-12 bg-muted">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Markdown Content */}
          <div className="glass p-8 sm:p-12 rounded-3xl border border-border shadow-sm mb-16">
            <MarkdownRenderer content={blog.content} />
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-16 pb-8 border-b border-border">
              {blog.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 bg-muted border border-border text-muted-foreground rounded-lg font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedBlogs.map((rel) => (
                  <Link
                    key={rel._id}
                    href={`/blogs/${rel.slug}`}
                    className="glass rounded-2xl overflow-hidden border border-border hover:border-primary/30 p-4 transition-all hover:shadow-md block"
                  >
                    {rel.featuredImage && (
                      <div className="aspect-video rounded-xl overflow-hidden mb-3 bg-muted">
                        <img
                          src={rel.featuredImage}
                          alt={rel.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
