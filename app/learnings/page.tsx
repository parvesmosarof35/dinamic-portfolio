import React from "react";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Learning } from "@/models/Learning";

export const dynamic = "force-dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, Search, ArrowRight, Code, Brain, Database, ShieldAlert, Cpu } from "lucide-react";

export const metadata = {
  title: "My Learnings | DevParves LMS",
  description: "A hub of technical documentation, tutorials, and notes.",
};

const categoryIcons: any = {
  "React": <Code className="w-8 h-8 text-primary" />,
  "Next.js": <Code className="w-8 h-8 text-primary" />,
  "Node.js": <Cpu className="w-8 h-8 text-primary" />,
  "MongoDB": <Database className="w-8 h-8 text-primary" />,
  "AWS": <Brain className="w-8 h-8 text-primary" />,
  "DevOps": <ShieldAlert className="w-8 h-8 text-primary" />,
  "AI": <Brain className="w-8 h-8 text-primary" />,
  "Career": <BookOpen className="w-8 h-8 text-primary" />,
};

interface LearningsIndexProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function LearningsPage({ searchParams }: LearningsIndexProps) {
  await connectToDatabase();
  const params = await searchParams;
  const search = params.search || "";

  let filter: any = {};
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  const articles = await Learning.find(filter).sort({ category: 1, title: 1 });

  // Group by category
  const categoriesMap: any = {};
  articles.forEach((art) => {
    if (!categoriesMap[art.category]) {
      categoriesMap[art.category] = [];
    }
    categoriesMap[art.category].push(art);
  });

  const categoryNames = Object.keys(categoriesMap);

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Documentation & Learnings
            </h1>
            <div className="h-1.5 w-20 bg-primary mx-auto rounded-full mt-4" />
            <p className="text-muted-foreground mt-4 text-base">
              Explore my technical logs, programming tutorials, syntax cheat sheets, and conceptual notes.
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-xl mx-auto mb-16">
            <form action="/learnings" method="GET" className="relative">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search tutorials, code snippets, notes..."
                className="w-full bg-muted/50 border border-border rounded-2xl pl-12 pr-4 py-3.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              <Search className="absolute left-4 top-4 text-muted-foreground w-5 h-5" />
            </form>
          </div>

          {/* Grouped Lists */}
          {categoryNames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categoryNames.map((catName) => {
                const catArticles = categoriesMap[catName];
                const icon = categoryIcons[catName] || <BookOpen className="w-8 h-8 text-primary" />;

                return (
                  <div
                    key={catName}
                    className="glass p-8 rounded-3xl border border-border shadow-sm flex flex-col space-y-6"
                  >
                    <div className="flex items-center gap-4 border-b border-border pb-4">
                      <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-2xl">
                        {icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{catName}</h2>
                        <p className="text-xs text-muted-foreground font-semibold">
                          {catArticles.length} dynamic articles
                        </p>
                      </div>
                    </div>

                    {/* Articles list */}
                    <div className="space-y-4 flex-grow">
                      {catArticles.slice(0, 5).map((art: any) => (
                        <Link
                          key={art._id}
                          href={`/learnings/${art.category}/${art.slug}`}
                          className="flex items-center justify-between p-3 hover:bg-muted/50 border border-transparent hover:border-border rounded-xl transition-all group"
                        >
                          <div className="space-y-0.5">
                            <span className="font-bold text-foreground text-sm group-hover:text-primary transition-colors block">
                              {art.title}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 bg-primary/10 rounded-full uppercase">
                                {art.difficulty || "Intermediate"}
                              </span>
                            </div>
                          </div>
                          <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
                        </Link>
                      ))}
                    </div>

                    {catArticles.length > 5 && (
                      <div className="pt-2 text-center border-t border-border">
                        <Link
                          href={`/learnings/${catName}/${catArticles[5].slug}`}
                          className="text-xs font-bold text-primary hover:opacity-85"
                        >
                          View all {catArticles.length} articles
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-border rounded-3xl">
              <p className="text-muted-foreground">No learning articles found matching your criteria.</p>
              <Link href="/learnings" className="text-primary font-bold text-sm mt-2 inline-block">
                Clear Filters
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
