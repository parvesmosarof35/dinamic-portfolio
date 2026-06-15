"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Facebook, Github, Linkedin, Twitter, ArrowUp } from "lucide-react";

export default function Footer() {
  const { data: contactData } = useQuery({
    queryKey: ["contact-info"],
    queryFn: async () => {
      const res = await fetch("/api/contact-info");
      return res.json();
    },
  });

  const { data: settingsData } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      return res.json();
    },
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const socialLinks = [
    { icon: <Facebook size={18} />, href: contactData?.facebook, name: "Facebook" },
    { icon: <Github size={18} />, href: contactData?.github, name: "GitHub" },
    { icon: <Linkedin size={18} />, href: contactData?.linkedin, name: "LinkedIn" },
    { icon: <Twitter size={18} />, href: contactData?.twitter, name: "Twitter/X" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="text-center md:text-left">
            <span className="text-xl font-bold text-primary">
              Dev<span className="text-foreground">Parves</span>
            </span>
            <p className="mt-2 text-sm text-muted-foreground">
              {settingsData?.footerText || `© ${new Date().getFullYear()} Parves Mosarof. All rights reserved.`}
            </p>
          </div>

          {socialLinks.length > 0 && (
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          )}

          <div>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <span className="p-2 rounded-full bg-background border border-border">
                <ArrowUp size={16} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
