"use client";

import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HappyClients() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews-data"],
    queryFn: async () => {
      const res = await fetch("/api/reviews");
      return res.json();
    },
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    if (!reviews || reviews.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    if (!reviews || reviews.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  useEffect(() => {
    if (!reviews || reviews.length <= 1) return;
    timeoutRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [reviews, activeIndex]);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
      timeoutRef.current = setInterval(nextSlide, 5000);
    }
  };

  if (isLoading) {
    return (
      <section id="clients" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="h-8 w-32 bg-muted animate-pulse rounded mx-auto mb-6" />
        </div>
      </section>
    );
  }

  if (!reviews || reviews.length === 0) return null;

  const activeReview = reviews[activeIndex];

  return (
    <section id="clients" className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground">Happy Clients</h2>
          <div className="h-1.5 w-20 bg-primary mx-auto rounded-full mt-4" />
          <p className="text-muted-foreground mt-4 text-base">
            Hear from businesses and clients I've collaborated with.
          </p>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {activeReview && (
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.98, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98, x: -20 }}
                transition={{ duration: 0.35 }}
                className="glass p-8 sm:p-12 rounded-3xl border border-border shadow-sm text-center space-y-6 relative"
              >
                <div className="absolute top-6 left-8 text-primary/10 pointer-events-none">
                  <Quote size={80} />
                </div>

                <div className="flex justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < activeReview.rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/20"
                      }
                    />
                  ))}
                </div>

                <p className="text-lg sm:text-xl text-foreground font-medium italic leading-relaxed max-w-2xl mx-auto">
                  "{activeReview.reviewText}"
                </p>

                <div className="flex flex-col items-center space-y-2">
                  {activeReview.profileImage && (
                    <img
                      src={activeReview.profileImage}
                      alt={activeReview.clientName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary shadow-sm"
                    />
                  )}
                  <div>
                    <h4 className="font-bold text-foreground">{activeReview.clientName}</h4>
                    <p className="text-xs text-muted-foreground">
                      {activeReview.companyName && `${activeReview.companyName}, `}
                      {activeReview.country}
                    </p>
                  </div>
                  {activeReview.projectName && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 mt-1">
                      Project: {activeReview.projectName}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {reviews.length > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => {
                  prevSlide();
                  resetTimer();
                }}
                className="p-3 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full border border-border transition-all cursor-pointer"
                aria-label="Previous review"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex space-x-1.5">
                {reviews.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveIndex(idx);
                      resetTimer();
                    }}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      activeIndex === idx ? "w-6 bg-primary" : "w-2.5 bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  nextSlide();
                  resetTimer();
                }}
                className="p-3 bg-muted hover:bg-primary hover:text-primary-foreground rounded-full border border-border transition-all cursor-pointer"
                aria-label="Next review"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
