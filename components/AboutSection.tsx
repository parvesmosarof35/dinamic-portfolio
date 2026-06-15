"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState<"journey" | "work" | "education" | "hobbies">("journey");

  const { data: about, isLoading } = useQuery({
    queryKey: ["about-data"],
    queryFn: async () => {
      const res = await fetch("/api/about");
      return res.json();
    },
  });

  if (isLoading || !about) {
    return (
      <section id="about" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="h-8 w-32 bg-muted animate-pulse rounded mx-auto mb-6" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded mx-auto" />
        </div>
      </section>
    );
  }

  const availableTabs = [
    { id: "journey", label: "Journey", enabled: about.enableJourney, data: about.journey },
    { id: "work", label: "Work Experience", enabled: about.enableWork, data: about.workExperience },
    { id: "education", label: "Education", enabled: about.enableEducation, data: about.education },
    { id: "hobbies", label: "Hobbies", enabled: about.enableHobbies, data: about.hobbies },
  ].filter((t) => t.enabled);

  const currentTab = availableTabs.find((t) => t.id === activeTab) ? activeTab : (availableTabs[0]?.id as any);

  return (
    <section id="about" className="py-24 bg-muted/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground">About Me</h2>
          <div className="h-1.5 w-20 bg-primary mx-auto rounded-full mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {about.profileImage && (
              <div className="col-span-2 aspect-square rounded-2xl overflow-hidden shadow-lg border border-border">
                <img
                  src={about.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            {about.image1 && (
              <div className="aspect-video rounded-xl overflow-hidden shadow-md border border-border">
                <img
                  src={about.image1}
                  alt="Story 1"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            {about.image2 && (
              <div className="aspect-video rounded-xl overflow-hidden shadow-md border border-border">
                <img
                  src={about.image2}
                  alt="Story 2"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="glass p-8 rounded-3xl border border-border shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-foreground">My Story</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-base">
                {about.personalStory || "No story added yet."}
              </p>
            </div>

            {availableTabs.length > 0 && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 border-b border-border pb-2">
                  {availableTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                        currentTab === tab.id
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="min-h-[250px] relative">
                  <AnimatePresence mode="wait">
                    {currentTab && (
                      <motion.div
                        key={currentTab}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-6"
                      >
                        {currentTab === "hobbies" ? (
                          <div className="flex flex-wrap gap-3">
                            {about.hobbies?.map((hobby: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-4 py-2 bg-muted border border-border rounded-xl text-sm font-medium hover:border-primary/30 transition-colors"
                              >
                                {hobby}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-6 border-l-2 border-primary/30 pl-6 ml-2">
                            {(about[currentTab === "work" ? "workExperience" : currentTab] || []).map(
                              (item: any, idx: number) => (
                                <div key={idx} className="relative space-y-1.5">
                                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                                  <span className="text-xs font-bold text-primary tracking-wider uppercase">
                                    {item.year}
                                  </span>
                                  <h4 className="text-lg font-bold text-foreground">
                                    {item.title}
                                  </h4>
                                  {item.subtitle && (
                                    <p className="text-sm font-medium text-muted-foreground">
                                      {item.subtitle}
                                    </p>
                                  )}
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
