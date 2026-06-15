import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/Project";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, ExternalLink, Github, CheckCircle } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  await connectToDatabase();
  const { slug } = await params;
  const project = await Project.findOne({ slug });
  if (!project) {
    return { title: "Project Not Found" };
  }
  return {
    title: `${project.name} | Project Details`,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  await connectToDatabase();
  const { slug } = await params;
  const project = await Project.findOne({ slug });

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-32 pb-24 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/#projects"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Projects</span>
          </Link>

          {/* Title Area */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary text-primary-foreground">
                {project.projectType}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground">
                {project.status}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              {project.name}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
              {project.shortDescription}
            </p>
          </div>

          {/* Featured Image */}
          {project.featuredImage && (
            <div className="aspect-video w-full rounded-3xl overflow-hidden border border-border shadow-md mb-12 bg-muted">
              <img
                src={project.featuredImage}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Content column */}
            <div className="lg:col-span-8 space-y-10">
              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Project Overview</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-base">
                  {project.longDescription}
                </p>
              </div>

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">Key Features</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.features.map((feature: string, i: number) => (
                      <li key={i} className="flex gap-3 items-start">
                        <CheckCircle size={18} className="text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges and Solutions */}
              {(project.challenges || project.solutions) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-border">
                  {project.challenges && (
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-foreground">Challenges</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {project.challenges}
                      </p>
                    </div>
                  )}
                  {project.solutions && (
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-foreground">Solutions</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {project.solutions}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Gallery Images */}
              {project.galleryImages && project.galleryImages.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <h2 className="text-2xl font-bold text-foreground">Gallery</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {project.galleryImages.map((image: string, idx: number) => (
                      <div
                        key={idx}
                        className="aspect-video rounded-2xl overflow-hidden border border-border shadow-sm bg-muted"
                      >
                        <img
                          src={image}
                          alt={`${project.name} gallery ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right details sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass p-6 rounded-3xl border border-border shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-foreground">Metadata</h3>

                {/* Tech Stack */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.map((tech: string, i: number) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1.5 bg-muted border border-border text-foreground font-semibold rounded-xl"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project links */}
                <div className="space-y-3 pt-6 border-t border-border">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Project Resources
                  </h4>
                  <div className="flex flex-col gap-2">
                    {project.showLive && project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-primary text-primary-foreground hover:bg-primary/95 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer"
                      >
                        <span>Live Preview</span>
                        <ExternalLink size={16} />
                      </a>
                    )}
                    {project.showGithub && project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-muted hover:bg-muted/80 text-foreground border border-border px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer"
                      >
                        <span>GitHub Source</span>
                        <Github size={16} />
                      </a>
                    )}
                    {project.showFrontend && project.frontendUrl && (
                      <a
                        href={project.frontendUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-muted hover:bg-muted/80 text-foreground border border-border px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer text-xs"
                      >
                        <span>Frontend Code</span>
                        <Github size={14} />
                      </a>
                    )}
                    {project.showBackend && project.backendUrl && (
                      <a
                        href={project.backendUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-muted hover:bg-muted/80 text-foreground border border-border px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer text-xs"
                      >
                        <span>Backend Code</span>
                        <Github size={14} />
                      </a>
                    )}
                    {project.showApp && project.mobileAppUrl && (
                      <a
                        href={project.mobileAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-muted hover:bg-muted/80 text-foreground border border-border px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer"
                      >
                        <span>Mobile App Download</span>
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
