"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

export default function SkillsSection() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["skills-data"],
    queryFn: async () => {
      const res = await fetch("/api/skills");
      return res.json();
    },
  });

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="w-6 h-6 text-primary" />;
    }
    return <Icons.Cpu className="w-6 h-6 text-primary" />;
  };

  if (isLoading) {
    return (
      <section id="skills" className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="h-8 w-32 bg-muted animate-pulse rounded mx-auto mb-6" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground">Technical Skills</h2>
          <div className="h-1.5 w-20 bg-primary mx-auto rounded-full mt-4" />
          <p className="text-muted-foreground mt-4 text-base">
            A comprehensive list of technologies and skills I use to build scalable products.
          </p>
        </div>

        <div className="space-y-16">
          {categories?.map((category: any) => (
            <div key={category._id} className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
                <span>{category.name}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {category.skills?.length || 0} skills
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.skills?.map((skill: any, idx: number) => (
                  <motion.div
                    key={skill._id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="glass p-6 rounded-2xl border border-border shadow-sm hover:border-primary/30 transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                        {getIcon(skill.icon)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground text-lg">{skill.name}</h4>
                        {skill.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {skill.description}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-bold text-primary">{skill.percentage}%</span>
                    </div>

                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-gradient-to-r from-primary to-indigo-500 h-full rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
