"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { MapPin, Mail, Phone, MessageSquare, Send } from "lucide-react";
import confetti from "canvas-confetti";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const { data: contactInfo } = useQuery({
    queryKey: ["contact-info"],
    queryFn: async () => {
      const res = await fetch("/api/contact-info");
      return res.json();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Message sent successfully!");
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
      reset();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to send message.");
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    mutation.mutate(data);
  };

  const infoItems = [
    {
      icon: <MapPin className="text-primary w-5 h-5" />,
      label: "Address",
      value: contactInfo?.address,
    },
    {
      icon: <Mail className="text-primary w-5 h-5" />,
      label: "Email",
      value: contactInfo?.email,
      href: contactInfo?.email ? `mailto:${contactInfo.email}` : undefined,
    },
    {
      icon: <Phone className="text-primary w-5 h-5" />,
      label: "Phone",
      value: contactInfo?.phone,
      href: contactInfo?.phone ? `tel:${contactInfo.phone}` : undefined,
    },
    {
      icon: <MessageSquare className="text-primary w-5 h-5" />,
      label: "WhatsApp",
      value: contactInfo?.whatsapp,
      href: contactInfo?.whatsapp
        ? `https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, "")}`
        : undefined,
    },
  ].filter((item) => item.value);

  return (
    <section id="contact" className="py-24 bg-muted/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-foreground">Get In Touch</h2>
          <div className="h-1.5 w-20 bg-primary mx-auto rounded-full mt-4" />
          <p className="text-muted-foreground mt-4 text-base">
            Feel free to contact me for any project inquiries, collaborations, or questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="glass p-8 rounded-3xl border border-border shadow-sm space-y-6">
              <h3 className="text-2xl font-bold text-foreground mb-4">Contact Information</h3>
              <div className="space-y-6">
                {infoItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                        {item.label}
                      </h4>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-foreground font-medium hover:text-primary transition-colors text-base break-all"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-foreground font-medium text-base break-all">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="glass p-8 sm:p-10 rounded-3xl border border-border shadow-sm space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-foreground">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name")}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-foreground">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email")}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-semibold text-foreground">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  {...register("subject")}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                  placeholder="Inquiry about new project"
                />
                {errors.subject && (
                  <p className="text-xs text-red-500 font-medium">{errors.subject.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-semibold text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register("message")}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm resize-none"
                  placeholder="Write your message here..."
                />
                {errors.message && (
                  <p className="text-xs text-red-500 font-medium">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-[1.01] cursor-pointer"
              >
                {mutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
