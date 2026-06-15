import React from "react";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import { Blog } from "@/models/Blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Calendar, Tag, ArrowRight } from "lucide-react";

interface BlogsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

export const metadata = {
  title: "Blogs | DevParves Portfolio",
  description: "Read my latest articles, tutorials, and insights about full stack development.",
};

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  await connectToDatabase();
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category || "All";
  const currentPage = parseInt(params.page || "1", 10);
  const limit = 6;
  const skip = (currentPage - 1) * limit;

  const filter: any = {};
  if (category !== "All") {
    filter.category = category;
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  const total = await Blog.countDocuments(filter);
  const blogs = await Blog.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const distinctCategories = await Blog.distinct("category");
  const categories = ["All", ...distinctCategories];
  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              My Blog
            </h1>
            <div className="h-1.5 w-20 bg-primary mx-auto rounded-full mt-4" />
            <p className="text-muted-foreground mt-4">
              Insights, guides, and stories about web engineering, design systems, and programming languages.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-12">
            {/* Search Input Form */}
            <form action="/blogs" method="GET" className="md:col-span-6 relative">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search articles..."
                className="w-full bg-muted/50 border border-border rounded-xl pl-12 pr-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              <Search className="absolute left-4 top-3.5 text-muted-foreground w-4 h-4" />
              {category !== "All" && (
                <input type="hidden" name="category" value={category} />
              )}
            </form>

            {/* Category tabs */}
            <div className="md:col-span-6 flex flex-wrap gap-2 justify-start md:justify-end">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/blogs?category=${cat}${search ? `&search=${search}` : ""}`}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    category === cat
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Blogs Grid */}
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <article
                  key={blog._id}
                  className="glass rounded-3xl overflow-hidden border border-border shadow-sm hover:border-primary/30 transition-all hover:shadow-lg flex flex-col group h-full"
                >
                  {/* Image */}
                  {blog.featuredImage && (
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1 space-y-4">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag size={12} />
                        {blog.category}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      {blog.metaDescription && (
                        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                          {blog.metaDescription}
                        </p>
                      )}
                    </div>

                    {/* Footer read link */}
                    <div className="pt-4 border-t border-border mt-auto">
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="flex items-center space-x-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group-hover:gap-2.5"
                      >
                        <span>Read Article</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-border rounded-3xl">
              <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
              <Link href="/blogs" className="text-primary font-bold text-sm mt-2 inline-block">
                Clear Filters
              </Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const p = idx + 1;
                return (
                  <Link
                    key={p}
                    href={`/blogs?page=${p}${category !== "All" ? `&category=${category}` : ""}${
                      search ? `&search=${search}` : ""
                    }`}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold border border-border transition-colors ${
                      currentPage === p
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
