"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ProjectsSection() {
  const [filter, setFilter] = useState<string>("All");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects-data", filter],
    queryFn: async () => {
      const res = await fetch(`/api/projects?type=${filter}`);
      return res.json();
    },
  });

  const categories = ["All", "Frontend", "Backend", "Full Stack", "Mobile App", "AI Project"];

  if (isLoading) {
    return (
      <section id="projects" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="h-8 w-32 bg-muted animate-pulse rounded mx-auto mb-6" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 bg-muted/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground">Featured Projects</h2>
          <div className="h-1.5 w-20 bg-primary mx-auto rounded-full mt-4" />
          <p className="text-muted-foreground mt-4 text-base">
            A curated selection of work I've built, ranging from web applications to AI-powered services.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                filter === cat
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {projects?.map((project: any, idx: number) => (
              <motion.div
                layout
                key={project._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="glass rounded-3xl overflow-hidden border border-border shadow-sm hover:border-primary/30 transition-all hover:shadow-lg flex flex-col group h-full"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  {project.featuredImage ? (
                    <img
                      src={project.featuredImage}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No image available
                    </div>
                  )}

                  <span className="absolute top-4 left-4 z-10 text-xs font-semibold px-2.5 py-1 rounded-full bg-background/80 border border-border backdrop-blur-sm">
                    {project.status}
                  </span>

                  <span className="absolute top-4 right-4 z-10 text-xs font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground shadow-sm">
                    {project.projectType}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                      {project.shortDescription}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.techStack?.slice(0, 4).map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 bg-muted border border-border rounded-lg text-muted-foreground font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack?.length > 4 && (
                      <span className="text-xs px-2 py-1 bg-muted border border-border rounded-lg text-muted-foreground font-medium">
                        +{project.techStack.length - 4} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-border">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex items-center space-x-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight size={16} />
                    </Link>

                    <div className="flex items-center space-x-2">
                      {project.showLive && project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg border border-border transition-colors cursor-pointer"
                          title="Live Demo"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      {project.showGithub && project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-muted hover:bg-primary/10 hover:text-primary rounded-lg border border-border transition-colors cursor-pointer"
                          title="Source Code"
                        >
                          <Github size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
