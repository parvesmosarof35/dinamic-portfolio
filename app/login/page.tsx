"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Lock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginValues) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Login successful! Welcome back.");
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      router.push("/admin");
    },
    onError: (err: any) => {
      toast.error(err.message || "Invalid email or password.");
    },
  });

  const onSubmit = (data: LoginValues) => {
    mutation.mutate(data);
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center relative p-4 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-8">
        {/* Brand */}
        <div className="text-center">
          <Link href="/" className="text-3xl font-extrabold tracking-tight text-primary">
            Dev<span className="text-foreground">Parves</span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground font-semibold">
            Admin Management Console
          </p>
        </div>

        {/* Login Card */}
        <div className="glass p-8 sm:p-10 rounded-3xl border border-border shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold text-foreground uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="admin@example.com"
                />
                <Mail className="absolute left-4 top-3.5 text-muted-foreground w-4 h-4" />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-bold text-foreground uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  {...register("password")}
                  className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-4 top-3.5 text-muted-foreground w-4 h-4" />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 hover:scale-[1.01] cursor-pointer"
            >
              {mutation.isPending ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </main>
  );
}
