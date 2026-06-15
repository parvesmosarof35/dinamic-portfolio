import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { Learning } from "@/models/Learning";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { ArrowLeft, BookOpen, Clock, Tag, ChevronRight } from "lucide-react";

interface LearningDetailsProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: LearningDetailsProps) {
  await connectToDatabase();
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const article = await Learning.findOne({ slug: decodedSlug });
  if (!article) {
    return { title: "Documentation Not Found" };
  }
  return {
    title: `${article.title} | ${article.category} Documentation`,
    description: `Technical article on ${article.title} inside ${article.category} logs.`,
  };
}

export default async function LearningDetailsPage({ params }: LearningDetailsProps) {
  await connectToDatabase();
  const { category, slug } = await params;

  const decodedCategory = decodeURIComponent(category);
  const decodedSlug = decodeURIComponent(slug);

  const article = await Learning.findOne({ slug: decodedSlug });
  if (!article) {
    notFound();
  }

  const sidebarArticles = await Learning.find({ category: decodedCategory }).sort({ title: 1 });

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Top Navigation */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground mb-8">
            <Link href="/learnings" className="hover:text-primary transition-colors">
              Docs & Learnings
            </Link>
            <ChevronRight size={12} />
            <span className="text-foreground">{decodedCategory}</span>
            <ChevronRight size={12} />
            <span className="text-primary truncate max-w-xs">{article.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar list (lg:col-span-3) */}
            <aside className="lg:col-span-3 glass p-6 rounded-3xl border border-border space-y-6 lg:sticky lg:top-28">
              <div className="space-y-1 pb-4 border-b border-border">
                <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  <span>{decodedCategory} Articles</span>
                </h3>
                <p className="text-[10px] text-muted-foreground font-semibold">
                  {sidebarArticles.length} guides available
                </p>
              </div>

              <div className="flex flex-col gap-1.5 max-h-[400px] overflow-y-auto pr-1">
                {sidebarArticles.map((sib) => {
                  const isActive = sib.slug === decodedSlug;
                  return (
                    <Link
                      key={sib._id}
                      href={`/learnings/${sib.category}/${sib.slug}`}
                      className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all border flex items-center justify-between ${
                        isActive
                          ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/10"
                          : "bg-transparent border-transparent hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="truncate max-w-[200px]">{sib.title}</span>
                      <ChevronRight size={12} className={isActive ? "opacity-100" : "opacity-0"} />
                    </Link>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-border">
                <Link
                  href="/learnings"
                  className="flex items-center space-x-1.5 text-xs font-bold text-primary hover:opacity-85"
                >
                  <ArrowLeft size={12} />
                  <span>All Categories</span>
                </Link>
              </div>
            </aside>

            {/* Document Content (lg:col-span-9) */}
            <article className="lg:col-span-9 space-y-6">
              <div className="glass p-8 sm:p-12 rounded-3xl border border-border shadow-sm">
                <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground mb-6">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase">
                    {article.difficulty || "Intermediate"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-primary" />
                    Updated: {new Date(article.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-8 pb-4 border-b border-border">
                  {article.title}
                </h1>

                {/* Markdown Parser */}
                <MarkdownRenderer content={article.content} />

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-8 mt-12 border-t border-border">
                    {article.tags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] px-2.5 py-1 bg-muted border border-border text-muted-foreground rounded-lg font-bold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
