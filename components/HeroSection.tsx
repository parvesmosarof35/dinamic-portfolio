"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Facebook, Github, Linkedin, MessageCircle, Mail, Download } from "lucide-react";

export default function HeroSection() {
  const { data: hero, isLoading } = useQuery({
    queryKey: ["hero-data"],
    queryFn: async () => {
      const res = await fetch("/api/hero");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center pt-20">
        <div className="animate-pulse space-y-6 text-center">
          <div className="h-8 w-48 bg-muted rounded-full mx-auto" />
          <div className="h-12 w-64 bg-muted rounded-lg mx-auto" />
          <div className="h-4 w-96 bg-muted rounded mx-auto" />
          <div className="h-12 w-40 bg-muted rounded-full mx-auto" />
        </div>
      </section>
    );
  }

  const socialLinks = [
    { icon: <Facebook size={20} />, href: hero?.facebookUrl, label: "Facebook" },
    { icon: <Github size={20} />, href: hero?.githubUrl, label: "GitHub" },
    { icon: <Linkedin size={20} />, href: hero?.linkedinUrl, label: "LinkedIn" },
    { icon: <MessageCircle size={20} />, href: hero?.whatsappUrl, label: "WhatsApp" },
    { icon: <Mail size={20} />, href: hero?.emailUrl ? `mailto:${hero.emailUrl}` : undefined, label: "Email" },
  ].filter((link) => link.href);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden"
      style={
        hero?.backgroundImage
          ? {
              backgroundImage: `url(${hero.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      {hero?.backgroundVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-15 pointer-events-none"
        >
          <source src={hero.backgroundVideo} type="video/mp4" />
        </video>
      )}

      {!hero?.backgroundImage && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] rounded-full bg-primary/15 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[35rem] h-[35rem] rounded-full bg-indigo-500/10 blur-[150px]" />
        </div>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 text-center lg:text-left space-y-6"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 text-primary px-4 py-1.5 rounded-full text-sm font-semibold"
          >
            <span>Hello, I'm</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight"
          >
            <span className="block text-foreground">{hero?.name || "Parves Mosarof"}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400 mt-2">
              {hero?.designation || "Full Stack Developer"}
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            {hero?.bio ||
              "I excel at crafting elegant digital experiences and am proficient in various programming languages."}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            {hero?.showCvButton && hero?.downloadCvUrl && (
              <a
                href={hero.downloadCvUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-primary hover:bg-primary/95 text-primary-foreground px-8 py-3.5 rounded-full text-base font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/45 hover:-translate-y-0.5 cursor-pointer"
              >
                <Download size={18} />
                <span>{hero.customButtonText || "Download CV"}</span>
              </a>
            )}
            <a
              href="#contact"
              className="px-8 py-3.5 rounded-full text-base font-semibold border border-border hover:border-primary/50 text-foreground hover:bg-muted/50 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              Let's Connect
            </a>
          </motion.div>

          {socialLinks.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center lg:justify-start space-x-4 pt-4"
            >
              {socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-full glass hover:text-primary hover:scale-110 hover:shadow-lg transition-all cursor-pointer"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </motion.div>
          )}
        </motion.div>

        {hero?.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            className="flex-1 flex justify-center items-center z-10"
          >
            <div className="relative w-80 h-80 sm:w-[400px] sm:h-[400px] rounded-3xl overflow-hidden border-2 border-border shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent z-10 pointer-events-none group-hover:opacity-40 transition-opacity" />
              <img
                src={hero.image}
                alt={hero.name || "Developer Profile"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
