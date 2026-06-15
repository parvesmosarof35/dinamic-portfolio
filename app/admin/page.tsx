"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  User,
  Sliders,
  Code,
  FolderGit2,
  BookOpen,
  BookMarked,
  HeartHandshake,
  Mail,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Trash2,
  Edit3,
  Check,
  Eye,
  FileText,
  Upload,
} from "lucide-react";

type TabType =
  | "analytics"
  | "hero"
  | "about"
  | "skills"
  | "projects"
  | "learnings"
  | "blogs"
  | "reviews"
  | "contact"
  | "bookings"
  | "messages"
  | "settings";

export default function AdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>("analytics");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth check
  const { data: authData, isError: authError } = useQuery({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    },
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
      queryClient.setQueryData(["auth-me"], null);
      router.push("/login");
    },
  });

  // Base64 upload helper
  const uploadImageFn = async (fileStr: string, folder: string) => {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: fileStr, folder }),
    });
    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.url;
  };

  const menuItems = [
    { id: "analytics", label: "Analytics", icon: <LayoutDashboard size={18} /> },
    { id: "hero", label: "Hero Management", icon: <User size={18} /> },
    { id: "about", label: "About Management", icon: <Sliders size={18} /> },
    { id: "skills", label: "Skills Management", icon: <Code size={18} /> },
    { id: "projects", label: "Projects Management", icon: <FolderGit2 size={18} /> },
    { id: "learnings", label: "Learnings LMS", icon: <BookOpen size={18} /> },
    { id: "blogs", label: "Blog Management", icon: <BookMarked size={18} /> },
    { id: "reviews", label: "Happy Clients", icon: <HeartHandshake size={18} /> },
    { id: "contact", label: "Contact Coordinates", icon: <Mail size={18} /> },
    { id: "bookings", label: "Calendar Bookings", icon: <Calendar size={18} /> },
    { id: "messages", label: "Inbox Messages", icon: <FileText size={18} /> },
    { id: "settings", label: "SEO & Settings", icon: <Settings size={18} /> },
  ];

  if (authError) {
    router.push("/login");
    return null;
  }

  if (!authData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-semibold">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Securing session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border py-4 px-6 flex items-center justify-between">
        <span className="text-xl font-bold text-primary">DevParves Console</span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:sticky lg:top-0 lg:h-screen"
        }`}
      >
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          {/* Brand */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <span className="text-2xl font-black text-primary tracking-tight">
              Dev<span className="text-foreground">Parves</span>
            </span>
            <button className="lg:hidden p-1 rounded hover:bg-muted" onClick={() => setSidebarOpen(false)}>
              <X size={16} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as TabType);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer info & logout */}
        <div className="p-4 border-t border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center font-bold text-primary">
              {authData.user?.name ? authData.user.name[0] : "A"}
            </div>
            <div className="truncate">
              <p className="text-sm font-bold text-foreground truncate">{authData.user?.name || "Admin"}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {authData.user?.designation || "Full Stack Owner"}
              </p>
            </div>
          </div>

          <button
            onClick={() => logoutMutation.mutate()}
            className="w-full flex items-center justify-center space-x-2 bg-muted hover:bg-red-500/10 border border-border hover:border-red-500/30 text-muted-foreground hover:text-red-500 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden min-h-screen pt-20 lg:pt-0">
        <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border pb-6 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground capitalize">
                {activeTab.replace("-", " ")}
              </h1>
              <p className="text-xs text-muted-foreground mt-1 font-semibold uppercase tracking-wider">
                Console Panel / {activeTab}
              </p>
            </div>
          </div>

          {/* Dynamically Rendered Tab Panels */}
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "hero" && <HeroTab uploadImageFn={uploadImageFn} />}
          {activeTab === "about" && <AboutTab uploadImageFn={uploadImageFn} />}
          {activeTab === "skills" && <SkillsTab />}
          {activeTab === "projects" && <ProjectsTab uploadImageFn={uploadImageFn} />}
          {activeTab === "learnings" && <LearningsTab />}
          {activeTab === "blogs" && <BlogsTab uploadImageFn={uploadImageFn} />}
          {activeTab === "reviews" && <ReviewsTab uploadImageFn={uploadImageFn} />}
          {activeTab === "contact" && <ContactTab />}
          {activeTab === "bookings" && <BookingsTab />}
          {activeTab === "messages" && <MessagesTab />}
          {activeTab === "settings" && <SettingsTab uploadImageFn={uploadImageFn} />}
        </div>
      </main>
    </div>
  );
}

// -------------------------------------------------------------
// ANALYTICS TAB
// -------------------------------------------------------------
function AnalyticsTab() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      return res.json();
    },
  });

  if (isLoading || !analytics) {
    return <div className="text-muted-foreground animate-pulse">Computing system analytics...</div>;
  }

  const cards = [
    { label: "Total Projects", value: analytics.counters?.projects, color: "border-primary" },
    { label: "Blog Articles", value: analytics.counters?.blogs, color: "border-indigo-500" },
    { label: "Documentation Guides", value: analytics.counters?.learnings, color: "border-emerald-500" },
    { label: "Client Testimonials", value: analytics.counters?.reviews, color: "border-purple-500" },
    {
      label: "Inbox Messages",
      value: `${analytics.counters?.messages?.unread} Unread`,
      color: "border-amber-500",
    },
    {
      label: "Meeting Bookings",
      value: `${analytics.counters?.bookings?.pending} Pending`,
      color: "border-pink-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, idx) => (
          <div key={idx} className={`glass p-6 rounded-2xl border-l-4 ${c.color} shadow-sm space-y-2`}>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {c.label}
            </span>
            <p className="text-3xl font-black text-foreground">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Messages */}
        <div className="glass p-6 rounded-3xl border border-border space-y-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Mail size={18} className="text-primary" />
            <span>Recent Messages</span>
          </h3>
          <div className="space-y-3">
            {analytics.recentMessages?.slice(0, 3).map((m: any) => (
              <div key={m._id} className="p-3 bg-muted/40 border border-border rounded-xl text-xs space-y-1">
                <div className="flex justify-between font-bold text-foreground">
                  <span>{m.name}</span>
                  <span className="text-muted-foreground">{new Date(m.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-muted-foreground font-semibold">Sub: {m.subject}</p>
                <p className="text-muted-foreground line-clamp-1">{m.message}</p>
              </div>
            ))}
            {(!analytics.recentMessages || analytics.recentMessages.length === 0) && (
              <p className="text-muted-foreground text-xs">No recent messages.</p>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="glass p-6 rounded-3xl border border-border space-y-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            <span>Recent Bookings</span>
          </h3>
          <div className="space-y-3">
            {analytics.recentBookings?.slice(0, 3).map((b: any) => (
              <div key={b._id} className="p-3 bg-muted/40 border border-border rounded-xl text-xs space-y-1">
                <div className="flex justify-between font-bold text-foreground">
                  <span>{b.name}</span>
                  <span className="text-muted-foreground">{b.date} ({b.time})</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-muted-foreground line-clamp-1">Agenda: {b.purpose}</span>
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                      b.status === "Approved"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                        : b.status === "Rejected"
                        ? "bg-red-500/10 border-red-500/30 text-red-500"
                        : "bg-amber-500/10 border-amber-500/30 text-amber-500"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
            {(!analytics.recentBookings || analytics.recentBookings.length === 0) && (
              <p className="text-muted-foreground text-xs">No recent bookings.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// HERO TAB
// -------------------------------------------------------------
function HeroTab({ uploadImageFn }: { uploadImageFn: any }) {
  const queryClient = useQueryClient();
  const { data: hero, isLoading } = useQuery({
    queryKey: ["admin-hero"],
    queryFn: async () => {
      const res = await fetch("/api/hero");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save hero data");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Hero section updated!");
      queryClient.invalidateQueries({ queryKey: ["admin-hero"] });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        toast.info("Uploading image to Cloudinary...");
        const url = await uploadImageFn(reader.result as string, "hero");
        toast.success("Image uploaded!");
        mutation.mutate({ ...hero, [field]: url });
      } catch (err: any) {
        toast.error(err.message || "Failed to upload image.");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      ...hero,
      name: formData.get("name"),
      designation: formData.get("designation"),
      bio: formData.get("bio"),
      facebookUrl: formData.get("facebookUrl"),
      githubUrl: formData.get("githubUrl"),
      linkedinUrl: formData.get("linkedinUrl"),
      whatsappUrl: formData.get("whatsappUrl"),
      emailUrl: formData.get("emailUrl"),
      downloadCvUrl: formData.get("downloadCvUrl"),
      customButtonText: formData.get("customButtonText"),
      showCvButton: formData.get("showCvButton") === "true",
      enableAnimation: formData.get("enableAnimation") === "true",
    };
    mutation.mutate(data);
  };

  if (isLoading || !hero) return <div className="text-muted-foreground">Loading hero settings...</div>;

  return (
    <form onSubmit={handleSubmit} className="glass p-6 sm:p-8 rounded-3xl border border-border space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider">Name</label>
          <input
            type="text"
            name="name"
            defaultValue={hero.name}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
          />
        </div>

        {/* Designation */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider">Designation</label>
          <input
            type="text"
            name="designation"
            defaultValue={hero.designation}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
          />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground uppercase tracking-wider">Short Bio</label>
        <textarea
          name="bio"
          defaultValue={hero.bio}
          rows={3}
          className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile/Hero Image */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider">Hero Image</label>
          <div className="flex items-center gap-3">
            {hero.image && (
              <img src={hero.image} alt="Hero" className="w-12 h-12 rounded-xl object-cover border border-border" />
            )}
            <label className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted/80 rounded-xl text-xs font-bold border border-border cursor-pointer transition-all">
              <Upload size={14} />
              <span>Upload</span>
              <input type="file" onChange={(e) => handleFileUpload(e, "image")} className="hidden" />
            </label>
          </div>
        </div>

        {/* Background Image */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider">Background Image</label>
          <div className="flex items-center gap-3">
            {hero.backgroundImage && (
              <img src={hero.backgroundImage} alt="Hero BG" className="w-12 h-12 rounded-xl object-cover border border-border" />
            )}
            <label className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted/80 rounded-xl text-xs font-bold border border-border cursor-pointer transition-all">
              <Upload size={14} />
              <span>Upload</span>
              <input type="file" onChange={(e) => handleFileUpload(e, "backgroundImage")} className="hidden" />
            </label>
          </div>
        </div>

        {/* Optional background video URL */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider">Background Video URL</label>
          <input
            type="text"
            name="backgroundVideo"
            defaultValue={hero.backgroundVideo}
            placeholder="https://..."
            className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="pt-6 border-t border-border space-y-4">
        <h4 className="text-sm font-bold text-foreground">Social Links</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Facebook</label>
            <input
              type="text"
              name="facebookUrl"
              defaultValue={hero.facebookUrl}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">GitHub</label>
            <input
              type="text"
              name="githubUrl"
              defaultValue={hero.githubUrl}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">LinkedIn</label>
            <input
              type="text"
              name="linkedinUrl"
              defaultValue={hero.linkedinUrl}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">WhatsApp Number</label>
            <input
              type="text"
              name="whatsappUrl"
              defaultValue={hero.whatsappUrl}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Email Address</label>
            <input
              type="text"
              name="emailUrl"
              defaultValue={hero.emailUrl}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Action buttons & configuration toggles */}
      <div className="pt-6 border-t border-border space-y-6">
        <h4 className="text-sm font-bold text-foreground">Action Buttons & Settings</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">CV URL / Link</label>
            <input
              type="text"
              name="downloadCvUrl"
              defaultValue={hero.downloadCvUrl}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">CV Button Text</label>
            <input
              type="text"
              name="customButtonText"
              defaultValue={hero.customButtonText}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase block">Show CV Button</label>
            <select
              name="showCvButton"
              defaultValue={String(hero.showCvButton)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            >
              <option value="true">Show</option>
              <option value="false">Hide</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase block">Enable Background Animations</label>
            <select
              name="enableAnimation"
              defaultValue={String(hero.enableAnimation)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
      >
        {mutation.isPending ? "Saving changes..." : "Save Settings"}
      </button>
    </form>
  );
}

// -------------------------------------------------------------
// ABOUT TAB
// -------------------------------------------------------------
function AboutTab({ uploadImageFn }: { uploadImageFn: any }) {
  const queryClient = useQueryClient();
  const { data: about, isLoading } = useQuery({
    queryKey: ["admin-about"],
    queryFn: async () => {
      const res = await fetch("/api/about");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update about data");
      return res.json();
    },
    onSuccess: () => {
      toast.success("About section updated!");
      queryClient.invalidateQueries({ queryKey: ["admin-about"] });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        toast.info("Uploading image...");
        const url = await uploadImageFn(reader.result as string, "about");
        toast.success("Image uploaded!");
        mutation.mutate({ ...about, [field]: url });
      } catch (err: any) {
        toast.error(err.message || "Upload failed");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTimelineAction = (
    action: "add" | "delete",
    field: "journey" | "workExperience" | "education",
    indexOrItem?: any
  ) => {
    const fieldData = [...(about[field] || [])];
    if (action === "add") {
      fieldData.push({ year: "2026", title: "New Node", subtitle: "Org Name", description: "" });
    } else {
      fieldData.splice(indexOrItem, 1);
    }
    mutation.mutate({ ...about, [field]: fieldData });
  };

  const handleTimelineChange = (
    field: "journey" | "workExperience" | "education",
    idx: number,
    key: string,
    val: string
  ) => {
    const fieldData = [...(about[field] || [])];
    fieldData[idx] = { ...fieldData[idx], [key]: val };
    mutation.mutate({ ...about, [field]: fieldData });
  };

  if (isLoading || !about) return <div className="text-muted-foreground">Loading about settings...</div>;

  return (
    <div className="space-y-8">
      {/* Narrative & Layout toggles */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          mutation.mutate({
            ...about,
            personalStory: formData.get("personalStory"),
            enableJourney: formData.get("enableJourney") === "true",
            enableWork: formData.get("enableWork") === "true",
            enableEducation: formData.get("enableEducation") === "true",
            enableHobbies: formData.get("enableHobbies") === "true",
          });
        }}
        className="glass p-6 sm:p-8 rounded-3xl border border-border space-y-6"
      >
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider block">My Story Narrative</label>
          <textarea
            name="personalStory"
            defaultValue={about.personalStory}
            rows={5}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm resize-none"
          />
        </div>

        {/* Image upload row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-border">
          {[
            { label: "Profile Picture", key: "profileImage" },
            { label: "Story Image 1", key: "image1" },
            { label: "Story Image 2", key: "image2" },
            { label: "Story Image 3", key: "image3" },
          ].map((imgItem) => (
            <div key={imgItem.key} className="space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{imgItem.label}</span>
              <div className="flex items-center gap-2">
                {about[imgItem.key] && (
                  <img
                    src={about[imgItem.key]}
                    alt={imgItem.label}
                    className="w-10 h-10 rounded-lg object-cover border border-border"
                  />
                )}
                <label className="flex items-center gap-1 px-2.5 py-1.5 bg-muted hover:bg-muted/80 border border-border rounded-lg text-[10px] font-extrabold cursor-pointer transition-all">
                  <Upload size={10} />
                  <span>File</span>
                  <input type="file" onChange={(e) => handleFileUpload(e, imgItem.key)} className="hidden" />
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Subsection toggles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase block">Journey Tab</label>
            <select
              name="enableJourney"
              defaultValue={String(about.enableJourney)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase block">Work Exp Tab</label>
            <select
              name="enableWork"
              defaultValue={String(about.enableWork)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase block">Education Tab</label>
            <select
              name="enableEducation"
              defaultValue={String(about.enableEducation)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase block">Hobbies Tab</label>
            <select
              name="enableHobbies"
              defaultValue={String(about.enableHobbies)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
        >
          Update Story & Display Settings
        </button>
      </form>

      {/* Hobbies list */}
      <div className="glass p-6 sm:p-8 rounded-3xl border border-border space-y-4">
        <h3 className="text-lg font-bold text-foreground">Hobbies List</h3>
        <div className="flex flex-wrap gap-2">
          {about.hobbies?.map((hobby: string, idx: number) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-muted rounded-xl text-xs font-semibold border border-border flex items-center gap-1.5"
            >
              <span>{hobby}</span>
              <button
                type="button"
                onClick={() => {
                  const items = [...about.hobbies];
                  items.splice(idx, 1);
                  mutation.mutate({ ...about, hobbies: items });
                }}
                className="text-muted-foreground hover:text-red-500 cursor-pointer"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem("hobbyName") as HTMLInputElement;
              if (!input.value) return;
              const items = [...(about.hobbies || [])];
              items.push(input.value);
              mutation.mutate({ ...about, hobbies: items });
              input.value = "";
            }}
            className="flex items-center gap-1.5"
          >
            <input
              type="text"
              name="hobbyName"
              placeholder="Add hobby..."
              className="bg-background border border-border rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <button
              type="submit"
              className="p-1.5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg cursor-pointer"
            >
              <Plus size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Timelines CRUD (Journey, Work, Education) */}
      {["journey", "workExperience", "education"].map((timelineKey: any) => {
        const titleLabel =
          timelineKey === "journey"
            ? "Journey / Milestones"
            : timelineKey === "workExperience"
            ? "Work Experience timeline"
            : "Education history";

        return (
          <div key={timelineKey} className="glass p-6 sm:p-8 rounded-3xl border border-border space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-lg font-bold text-foreground capitalize">{titleLabel}</h3>
              <button
                type="button"
                onClick={() => handleTimelineAction("add", timelineKey)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Node</span>
              </button>
            </div>

            <div className="space-y-4">
              {about[timelineKey]?.map((node: any, idx: number) => (
                <div key={idx} className="p-4 bg-muted/30 border border-border rounded-2xl grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase block">Year / Era</label>
                    <input
                      type="text"
                      value={node.year}
                      onChange={(e) => handleTimelineChange(timelineKey, idx, "year", e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase block">Headline / Title</label>
                    <input
                      type="text"
                      value={node.title}
                      onChange={(e) => handleTimelineChange(timelineKey, idx, "title", e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase block">Subtitle / Location</label>
                    <input
                      type="text"
                      value={node.subtitle}
                      onChange={(e) => handleTimelineChange(timelineKey, idx, "subtitle", e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[9px] font-bold text-muted-foreground uppercase block">Description text</label>
                    <input
                      type="text"
                      value={node.description}
                      onChange={(e) => handleTimelineChange(timelineKey, idx, "description", e.target.value)}
                      className="w-full bg-background border border-border rounded-lg px-2 py-1 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleTimelineAction("delete", timelineKey, idx)}
                      className="p-2 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-500/10 border border-transparent transition-all cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {(!about[timelineKey] || about[timelineKey].length === 0) && (
                <p className="text-muted-foreground text-xs italic">No items created in this timeline.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// -------------------------------------------------------------
// SKILLS TAB
// -------------------------------------------------------------
function SkillsTab() {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-skills"],
    queryFn: async () => {
      const res = await fetch("/api/skills");
      return res.json();
    },
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, skills: [] }),
      });
      if (!res.ok) throw new Error("Failed to add category");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Category added!");
      setNewCategoryName("");
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Category deleted!");
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (cat: any) => {
      const res = await fetch(`/api/skills/${cat._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cat),
      });
      if (!res.ok) throw new Error("Failed to update category");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Category skills updated!");
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
    },
  });

  const handleAddSkill = (cat: any) => {
    const skills = [...(cat.skills || [])];
    skills.push({ name: "New Skill", icon: "Cpu", percentage: 80, description: "" });
    updateCategoryMutation.mutate({ ...cat, skills });
  };

  const handleDeleteSkill = (cat: any, skillIdx: number) => {
    const skills = [...(cat.skills || [])];
    skills.splice(skillIdx, 1);
    updateCategoryMutation.mutate({ ...cat, skills });
  };

  const handleSkillChange = (cat: any, skillIdx: number, key: string, val: any) => {
    const skills = [...(cat.skills || [])];
    skills[skillIdx] = { ...skills[skillIdx], [key]: val };
    // update state locally for smooth inputs, commit on blur or save button
    const updatedCat = { ...cat, skills };
    setEditingCategory(updatedCat);
  };

  if (isLoading || !categories) return <div className="text-muted-foreground">Loading skills metrics...</div>;

  return (
    <div className="space-y-8">
      {/* Add Category Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!newCategoryName) return;
          addCategoryMutation.mutate(newCategoryName);
        }}
        className="glass p-6 rounded-3xl border border-border flex flex-col sm:flex-row items-center gap-4"
      >
        <div className="flex-1 space-y-1.5 w-full">
          <label className="text-xs font-bold text-foreground uppercase">New Category Name</label>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Frontend, Backend, DevOps..."
            className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl text-sm font-semibold transition-all sm:mt-5 cursor-pointer"
        >
          Create Category
        </button>
      </form>

      {/* Categories listing */}
      <div className="space-y-8">
        {categories.map((cat: any) => {
          const isSelected = editingCategory?._id === cat._id;
          const activeCat = isSelected ? editingCategory : cat;

          return (
            <div key={cat._id} className="glass p-6 rounded-3xl border border-border space-y-6">
              {/* Category title */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-foreground">{cat.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {cat.skills?.length || 0} skills
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (isSelected) {
                        updateCategoryMutation.mutate(editingCategory);
                        setEditingCategory(null);
                      } else {
                        setEditingCategory(JSON.parse(JSON.stringify(cat)));
                      }
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-muted border border-border text-xs font-bold hover:bg-primary hover:text-primary-foreground rounded-lg transition-all cursor-pointer"
                  >
                    {isSelected ? <Check size={12} /> : <Edit3 size={12} />}
                    <span>{isSelected ? "Save Skills" : "Edit Skills"}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this category?")) {
                        deleteCategoryMutation.mutate(cat._id);
                      }
                    }}
                    className="p-1.5 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-500/10 border border-transparent transition-all cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Skills nested listing */}
              <div className="space-y-4">
                {activeCat.skills?.map((skill: any, idx: number) => (
                  <div key={idx} className="p-4 bg-muted/20 border border-border rounded-2xl grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase">Skill Name</label>
                      <input
                        type="text"
                        disabled={!isSelected}
                        value={skill.name}
                        onChange={(e) => handleSkillChange(activeCat, idx, "name", e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-2.5 py-1 text-xs disabled:opacity-50"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase">Lucide Icon name</label>
                      <input
                        type="text"
                        disabled={!isSelected}
                        value={skill.icon}
                        onChange={(e) => handleSkillChange(activeCat, idx, "icon", e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-2.5 py-1 text-xs disabled:opacity-50"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase">Percentage ({skill.percentage}%)</label>
                      <input
                        type="range"
                        disabled={!isSelected}
                        min="0"
                        max="100"
                        value={skill.percentage}
                        onChange={(e) => handleSkillChange(activeCat, idx, "percentage", parseInt(e.target.value))}
                        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                      />
                    </div>
                    <div className="sm:col-span-4 space-y-1">
                      <label className="text-[9px] font-bold text-muted-foreground uppercase">Short Description</label>
                      <input
                        type="text"
                        disabled={!isSelected}
                        value={skill.description}
                        onChange={(e) => handleSkillChange(activeCat, idx, "description", e.target.value)}
                        className="w-full bg-background border border-border rounded-lg px-2.5 py-1 text-xs disabled:opacity-50"
                      />
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        disabled={!isSelected}
                        onClick={() => handleDeleteSkill(activeCat, idx)}
                        className="p-1.5 text-muted-foreground hover:text-red-500 disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {isSelected && (
                  <button
                    onClick={() => handleAddSkill(activeCat)}
                    className="flex items-center space-x-1 px-4 py-2 border border-dashed border-border hover:border-primary text-muted-foreground hover:text-primary rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Skill item</span>
                  </button>
                )}

                {(!activeCat.skills || activeCat.skills.length === 0) && (
                  <p className="text-muted-foreground text-xs italic">No skills created under this category.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// PROJECTS TAB
// -------------------------------------------------------------
function ProjectsTab({ uploadImageFn }: { uploadImageFn: any }) {
  const queryClient = useQueryClient();
  const [editingProject, setEditingProject] = useState<any | null>(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (project: any) => {
      const isNew = !project._id;
      const url = isNew ? "/api/projects" : `/api/projects/${project._id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save project");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Project saved successfully!");
      setEditingProject(null);
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        toast.info("Uploading project image...");
        const url = await uploadImageFn(reader.result as string, "projects");
        toast.success("Uploaded!");
        if (field === "featuredImage") {
          setEditingProject({ ...editingProject, featuredImage: url });
        } else if (field === "galleryImages") {
          const gallery = [...(editingProject.galleryImages || [])];
          gallery.push(url);
          setEditingProject({ ...editingProject, galleryImages: gallery });
        }
      } catch (err: any) {
        toast.error(err.message || "Upload failed");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddField = (field: "techStack" | "features", val: string) => {
    const arr = [...(editingProject[field] || [])];
    arr.push(val);
    setEditingProject({ ...editingProject, [field]: arr });
  };

  const handleRemoveField = (field: "techStack" | "features" | "galleryImages", idx: number) => {
    const arr = [...(editingProject[field] || [])];
    arr.splice(idx, 1);
    setEditingProject({ ...editingProject, [field]: arr });
  };

  if (isLoading || !projects) return <div className="text-muted-foreground">Loading projects queue...</div>;

  return (
    <div className="space-y-8">
      {!editingProject ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() =>
                setEditingProject({
                  name: "",
                  slug: "",
                  shortDescription: "",
                  longDescription: "",
                  featuredImage: "",
                  galleryImages: [],
                  techStack: [],
                  liveUrl: "",
                  frontendUrl: "",
                  backendUrl: "",
                  mobileAppUrl: "",
                  githubUrl: "",
                  showLive: true,
                  showFrontend: true,
                  showBackend: true,
                  showApp: false,
                  showGithub: true,
                  status: "Completed",
                  isFeatured: false,
                  projectType: "Full Stack",
                  features: [],
                  challenges: "",
                  solutions: "",
                })
              }
              className="flex items-center space-x-1.5 bg-primary hover:bg-primary/95 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Create New Project</span>
            </button>
          </div>

          <div className="glass rounded-3xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted border-b border-border font-bold text-foreground">
                    <th className="p-4">Name</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Featured</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-semibold">
                  {projects.map((proj: any) => (
                    <tr key={proj._id} className="hover:bg-muted/30">
                      <td className="p-4 font-bold text-foreground">{proj.name}</td>
                      <td className="p-4">{proj.projectType}</td>
                      <td className="p-4">{proj.status}</td>
                      <td className="p-4 text-center">{proj.isFeatured ? "Yes" : "No"}</td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => setEditingProject(proj)}
                          className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg border border-border transition-colors cursor-pointer"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this project?")) {
                              deleteMutation.mutate(proj._id);
                            }
                          }}
                          className="p-2 bg-muted hover:bg-red-500 hover:text-white rounded-lg border border-border transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {projects.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                        No projects created yet. Click above to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(editingProject);
          }}
          className="glass p-6 sm:p-8 rounded-3xl border border-border space-y-6"
        >
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-xl font-bold text-foreground">
              {editingProject._id ? "Modify Project details" : "Create New Project"}
            </h3>
            <button
              type="button"
              onClick={() => setEditingProject(null)}
              className="px-4 py-2 border border-border hover:bg-muted rounded-xl text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase block">Project Name</label>
              <input
                type="text"
                required
                value={editingProject.name}
                onChange={(e) => {
                  const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                  setEditingProject({ ...editingProject, name: e.target.value, slug });
                }}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase block">URL Slug</label>
              <input
                type="text"
                required
                value={editingProject.slug}
                onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase block">Status</label>
              <select
                value={editingProject.status}
                onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
              >
                <option value="Completed">Completed</option>
                <option value="Running">Running</option>
                <option value="Client Project">Client Project</option>
                <option value="Personal Project">Personal Project</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase block">Filter Category</label>
              <select
                value={editingProject.projectType}
                onChange={(e) => setEditingProject({ ...editingProject, projectType: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Mobile App">Mobile App</option>
                <option value="AI Project">AI Project</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase block">Featured project</label>
              <select
                value={String(editingProject.isFeatured)}
                onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.value === "true" })}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase block">Short Summary</label>
            <input
              type="text"
              required
              value={editingProject.shortDescription}
              onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase block">Detailed Overview</label>
            <textarea
              required
              value={editingProject.longDescription}
              onChange={(e) => setEditingProject({ ...editingProject, longDescription: e.target.value })}
              rows={4}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm resize-none"
            />
          </div>

          {/* File upload images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase block">Featured Image</label>
              <div className="flex items-center gap-3">
                {editingProject.featuredImage && (
                  <img
                    src={editingProject.featuredImage}
                    alt="Proj Featured"
                    className="w-12 h-12 rounded-xl object-cover border border-border"
                  />
                )}
                <label className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted/80 rounded-xl text-xs font-bold border border-border cursor-pointer transition-all">
                  <Upload size={14} />
                  <span>Choose file</span>
                  <input type="file" onChange={(e) => handleFileUpload(e, "featuredImage")} className="hidden" />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase block">Add Gallery Image</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted/80 rounded-xl text-xs font-bold border border-border cursor-pointer transition-all">
                  <Upload size={14} />
                  <span>Upload to Gallery</span>
                  <input type="file" onChange={(e) => handleFileUpload(e, "galleryImages")} className="hidden" />
                </label>
                <div className="flex gap-1 overflow-x-auto max-w-xs">
                  {editingProject.galleryImages?.map((img: string, i: number) => (
                    <div key={i} className="relative w-8 h-8 rounded border border-border flex-shrink-0 group overflow-hidden">
                      <img src={img} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveField("galleryImages", i)}
                        className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Links & Visibility Toggles */}
          <div className="pt-6 border-t border-border space-y-4">
            <h4 className="text-sm font-bold text-foreground">Resource Links & Display Toggles</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: "Live Site URL", key: "liveUrl", toggle: "showLive" },
                { label: "GitHub Source URL", key: "githubUrl", toggle: "showGithub" },
                { label: "Frontend Repository URL", key: "frontendUrl", toggle: "showFrontend" },
                { label: "Backend Repository URL", key: "backendUrl", toggle: "showBackend" },
                { label: "Mobile App Store URL", key: "mobileAppUrl", toggle: "showApp" },
              ].map((link) => (
                <div key={link.key} className="p-4 bg-muted/20 border border-border rounded-2xl space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">{link.label}</label>
                    <input
                      type="text"
                      value={editingProject[link.key]}
                      onChange={(e) => setEditingProject({ ...editingProject, [link.key]: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-foreground">Visible on Details</span>
                    <select
                      value={String(editingProject[link.toggle])}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, [link.toggle]: e.target.value === "true" })
                      }
                      className="bg-background border border-border rounded-lg px-2 py-1 text-[10px]"
                    >
                      <option value="true">Show</option>
                      <option value="false">Hide</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Arrays (Technologies, Features) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border">
            {/* Tech Stack */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground uppercase">Technologies Stack</span>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem("tech") as HTMLInputElement;
                    if (!input.value) return;
                    handleAddField("techStack", input.value);
                    input.value = "";
                  }}
                  className="flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    name="tech"
                    placeholder="React, Next, Mongoose..."
                    className="bg-background border border-border rounded-xl px-2.5 py-1.5 text-xs"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg cursor-pointer"
                  >
                    <Plus size={12} />
                  </button>
                </form>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {editingProject.techStack?.map((t: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-muted border border-border text-xs rounded-lg flex items-center gap-1.5 text-muted-foreground font-semibold"
                  >
                    <span>{t}</span>
                    <button type="button" onClick={() => handleRemoveField("techStack", i)}>
                      <X size={10} className="hover:text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground uppercase">Key Features</span>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem("feat") as HTMLInputElement;
                    if (!input.value) return;
                    handleAddField("features", input.value);
                    input.value = "";
                  }}
                  className="flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    name="feat"
                    placeholder="Add feature description..."
                    className="bg-background border border-border rounded-xl px-2.5 py-1.5 text-xs"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg cursor-pointer"
                  >
                    <Plus size={12} />
                  </button>
                </form>
              </div>
              <div className="space-y-2">
                {editingProject.features?.map((f: string, i: number) => (
                  <div
                    key={i}
                    className="p-2 bg-muted/30 border border-border rounded-xl flex items-center justify-between text-xs font-semibold text-muted-foreground"
                  >
                    <span className="truncate max-w-[250px]">{f}</span>
                    <button type="button" onClick={() => handleRemoveField("features", i)} className="text-muted-foreground hover:text-red-500">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Challenges & Solutions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-border">
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase block">Challenges Faced</label>
              <textarea
                value={editingProject.challenges}
                onChange={(e) => setEditingProject({ ...editingProject, challenges: e.target.value })}
                rows={3}
                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase block">Solutions implemented</label>
              <textarea
                value={editingProject.solutions}
                onChange={(e) => setEditingProject({ ...editingProject, solutions: e.target.value })}
                rows={3}
                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-3 rounded-xl text-sm transition-all cursor-pointer"
          >
            {mutation.isPending ? "Saving project details..." : "Save Project"}
          </button>
        </form>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// LEARNINGS TAB
// -------------------------------------------------------------
function LearningsTab() {
  const queryClient = useQueryClient();
  const [editingLearning, setEditingLearning] = useState<any | null>(null);

  const { data: learnings, isLoading } = useQuery({
    queryKey: ["admin-learnings"],
    queryFn: async () => {
      const res = await fetch("/api/learnings");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (item: any) => {
      const isNew = !item._id;
      const url = isNew ? "/api/learnings" : `/api/learnings/${item._id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save guide");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Learning article saved!");
      setEditingLearning(null);
      queryClient.invalidateQueries({ queryKey: ["admin-learnings"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/learnings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete guide");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Learning article deleted!");
      queryClient.invalidateQueries({ queryKey: ["admin-learnings"] });
    },
  });

  if (isLoading || !learnings) return <div className="text-muted-foreground">Loading learnings documents...</div>;

  return (
    <div className="space-y-8">
      {!editingLearning ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() =>
                setEditingLearning({
                  title: "",
                  slug: "",
                  content: "",
                  category: "React",
                  tags: [],
                  difficulty: "Intermediate",
                })
              }
              className="flex items-center space-x-1.5 bg-primary hover:bg-primary/95 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Create Documentation Guide</span>
            </button>
          </div>

          <div className="glass rounded-3xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted border-b border-border font-bold text-foreground">
                    <th className="p-4">Guide Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Difficulty</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-semibold">
                  {learnings.map((item: any) => (
                    <tr key={item._id} className="hover:bg-muted/30">
                      <td className="p-4 font-bold text-foreground">{item.title}</td>
                      <td className="p-4">{item.category}</td>
                      <td className="p-4">{item.difficulty}</td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => setEditingLearning(item)}
                          className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg border border-border transition-colors cursor-pointer"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this guide article?")) {
                              deleteMutation.mutate(item._id);
                            }
                          }}
                          className="p-2 bg-muted hover:bg-red-500 hover:text-white rounded-lg border border-border transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {learnings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground italic">
                        No learnings documented yet. Click above to add some guides.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(editingLearning);
          }}
          className="glass p-6 sm:p-8 rounded-3xl border border-border space-y-6"
        >
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-xl font-bold text-foreground">
              {editingLearning._id ? "Modify Guide article" : "Write Documentation Guide"}
            </h3>
            <button
              type="button"
              onClick={() => setEditingLearning(null)}
              className="px-4 py-2 border border-border hover:bg-muted rounded-xl text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase block">Guide Title</label>
              <input
                type="text"
                required
                value={editingLearning.title}
                onChange={(e) => {
                  const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                  setEditingLearning({ ...editingLearning, title: e.target.value, slug });
                }}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase block">URL Slug</label>
              <input
                type="text"
                required
                value={editingLearning.slug}
                onChange={(e) => setEditingLearning({ ...editingLearning, slug: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase block">LMS Category</label>
              <select
                value={editingLearning.category}
                onChange={(e) => setEditingLearning({ ...editingLearning, category: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
              >
                <option value="React">React</option>
                <option value="Next.js">Next.js</option>
                <option value="Node.js">Node.js</option>
                <option value="MongoDB">MongoDB</option>
                <option value="AWS">AWS</option>
                <option value="DevOps">DevOps</option>
                <option value="AI">AI</option>
                <option value="Career">Career</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase block">Difficulty</label>
              <select
                value={editingLearning.difficulty}
                onChange={(e) => setEditingLearning({ ...editingLearning, difficulty: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase block">Tags (comma-separated)</label>
              <input
                type="text"
                value={editingLearning.tags?.join(", ")}
                onChange={(e) =>
                  setEditingLearning({
                    ...editingLearning,
                    tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
                placeholder="hooks, state, frontend"
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          {/* Markdown Content */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase block">Markdown Body Content</label>
            <textarea
              required
              value={editingLearning.content}
              onChange={(e) => setEditingLearning({ ...editingLearning, content: e.target.value })}
              rows={12}
              className="w-full bg-background border border-border rounded-xl p-4 font-mono text-xs resize-none"
              placeholder="# Guide Heading&#10;&#10;Use markdown syntax to write tutorial content and code snippets..."
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-3 rounded-xl text-sm transition-all cursor-pointer"
          >
            {mutation.isPending ? "Saving documentation..." : "Save Documentation"}
          </button>
        </form>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// BLOGS TAB
// -------------------------------------------------------------
function BlogsTab({ uploadImageFn }: { uploadImageFn: any }) {
  const queryClient = useQueryClient();
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  const { data: blogResponse, isLoading } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const res = await fetch("/api/blogs?limit=50");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (blog: any) => {
      const isNew = !blog._id;
      const url = isNew ? "/api/blogs" : `/api/blogs/${blog._id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save blog post");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Blog article saved!");
      setEditingBlog(null);
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete blog post");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Blog article deleted!");
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        toast.info("Uploading image to Cloudinary...");
        const url = await uploadImageFn(reader.result as string, "blogs");
        toast.success("Uploaded!");
        setEditingBlog({ ...editingBlog, featuredImage: url });
      } catch (err: any) {
        toast.error(err.message || "Upload failed");
      }
    };
    reader.readAsDataURL(file);
  };

  if (isLoading || !blogResponse) return <div className="text-muted-foreground">Loading blog listings...</div>;

  const blogs = blogResponse.blogs || [];

  return (
    <div className="space-y-8">
      {!editingBlog ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() =>
                setEditingBlog({
                  title: "",
                  slug: "",
                  featuredImage: "",
                  content: "",
                  category: "Frontend",
                  tags: [],
                  metaTitle: "",
                  metaDescription: "",
                })
              }
              className="flex items-center space-x-1.5 bg-primary hover:bg-primary/95 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Create Blog Post</span>
            </button>
          </div>

          <div className="glass rounded-3xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted border-b border-border font-bold text-foreground">
                    <th className="p-4">Post Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Created</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-semibold">
                  {blogs.map((b: any) => (
                    <tr key={b._id} className="hover:bg-muted/30">
                      <td className="p-4 font-bold text-foreground">{b.title}</td>
                      <td className="p-4">{b.category}</td>
                      <td className="p-4">{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => setEditingBlog(b)}
                          className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg border border-border transition-colors cursor-pointer"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this blog post?")) {
                              deleteMutation.mutate(b._id);
                            }
                          }}
                          className="p-2 bg-muted hover:bg-red-500 hover:text-white rounded-lg border border-border transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {blogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground italic">
                        No blogs written yet. Click above to write one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(editingBlog);
          }}
          className="glass p-6 sm:p-8 rounded-3xl border border-border space-y-6"
        >
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-xl font-bold text-foreground">
              {editingBlog._id ? "Modify Blog details" : "Write Blog Post"}
            </h3>
            <button
              type="button"
              onClick={() => setEditingBlog(null)}
              className="px-4 py-2 border border-border hover:bg-muted rounded-xl text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase block">Post Title</label>
              <input
                type="text"
                required
                value={editingBlog.title}
                onChange={(e) => {
                  const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                  setEditingBlog({ ...editingBlog, title: e.target.value, slug });
                }}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase block">URL Slug</label>
              <input
                type="text"
                required
                value={editingBlog.slug}
                onChange={(e) => setEditingBlog({ ...editingBlog, slug: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase block">Category</label>
              <input
                type="text"
                required
                value={editingBlog.category}
                onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                placeholder="Tech, Career, Tutorial..."
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase block">Tags (comma-separated)</label>
              <input
                type="text"
                value={editingBlog.tags?.join(", ")}
                onChange={(e) =>
                  setEditingBlog({
                    ...editingBlog,
                    tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
                placeholder="coding, react"
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase block">Cover Image</label>
              <div className="flex items-center gap-3">
                {editingBlog.featuredImage && (
                  <img
                    src={editingBlog.featuredImage}
                    alt="Blog Cover"
                    className="w-10 h-10 rounded-lg object-cover border border-border"
                  />
                )}
                <label className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted/80 rounded-xl text-xs font-bold border border-border cursor-pointer transition-all">
                  <Upload size={12} />
                  <span>File</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Markdown Editor */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase block">Markdown Blog Content</label>
            <textarea
              required
              value={editingBlog.content}
              onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
              rows={12}
              className="w-full bg-background border border-border rounded-xl p-4 font-mono text-xs resize-none"
              placeholder="# Blog Post Title..."
            />
          </div>

          {/* SEO Metadata */}
          <div className="pt-6 border-t border-border space-y-4">
            <h4 className="text-sm font-bold text-foreground">Post SEO Settings</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Meta Title</label>
                <input
                  type="text"
                  value={editingBlog.metaTitle}
                  onChange={(e) => setEditingBlog({ ...editingBlog, metaTitle: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Meta Description</label>
                <input
                  type="text"
                  value={editingBlog.metaDescription}
                  onChange={(e) => setEditingBlog({ ...editingBlog, metaDescription: e.target.value })}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-3 rounded-xl text-sm transition-all cursor-pointer"
          >
            {mutation.isPending ? "Saving post..." : "Publish Blog Post"}
          </button>
        </form>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// REVIEWS TAB (Happy Clients)
// -------------------------------------------------------------
function ReviewsTab({ uploadImageFn }: { uploadImageFn: any }) {
  const queryClient = useQueryClient();
  const [editingReview, setEditingReview] = useState<any | null>(null);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const res = await fetch("/api/reviews");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (review: any) => {
      const isNew = !review._id;
      const url = isNew ? "/api/reviews" : `/api/reviews/${review._id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review),
      });
      if (!res.ok) throw new Error("Failed to save review");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Review saved!");
      setEditingReview(null);
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete review");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Review deleted!");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        toast.info("Uploading profile image...");
        const url = await uploadImageFn(reader.result as string, "clients");
        toast.success("Uploaded!");
        setEditingReview({ ...editingReview, profileImage: url });
      } catch (err: any) {
        toast.error(err.message || "Upload failed");
      }
    };
    reader.readAsDataURL(file);
  };

  if (isLoading || !reviews) return <div className="text-muted-foreground">Loading reviews...</div>;

  return (
    <div className="space-y-8">
      {!editingReview ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() =>
                setEditingReview({
                  clientName: "",
                  companyName: "",
                  country: "",
                  profileImage: "",
                  rating: 5,
                  reviewText: "",
                  projectName: "",
                  isFeatured: true,
                })
              }
              className="flex items-center space-x-1.5 bg-primary hover:bg-primary/95 text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Client Review</span>
            </button>
          </div>

          <div className="glass rounded-3xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted border-b border-border font-bold text-foreground">
                    <th className="p-4">Client</th>
                    <th className="p-4">Country</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4 text-center">Featured</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-semibold">
                  {reviews.map((rev: any) => (
                    <tr key={rev._id} className="hover:bg-muted/30">
                      <td className="p-4 font-bold text-foreground">
                        {rev.clientName} {rev.companyName && `(${rev.companyName})`}
                      </td>
                      <td className="p-4">{rev.country}</td>
                      <td className="p-4">{rev.rating}/5 stars</td>
                      <td className="p-4 text-center">{rev.isFeatured ? "Yes" : "No"}</td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => setEditingReview(rev)}
                          className="p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg border border-border transition-colors cursor-pointer"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this client review?")) {
                              deleteMutation.mutate(rev._id);
                            }
                          }}
                          className="p-2 bg-muted hover:bg-red-500 hover:text-white rounded-lg border border-border transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {reviews.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                        No reviews created yet. Click above to add client feedback.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(editingReview);
          }}
          className="glass p-6 sm:p-8 rounded-3xl border border-border space-y-6"
        >
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-xl font-bold text-foreground">
              {editingReview._id ? "Modify Review details" : "Add Client Review"}
            </h3>
            <button
              type="button"
              onClick={() => setEditingReview(null)}
              className="px-4 py-2 border border-border hover:bg-muted rounded-xl text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase block">Client Name</label>
              <input
                type="text"
                required
                value={editingReview.clientName}
                onChange={(e) => setEditingReview({ ...editingReview, clientName: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase block">Company Name</label>
              <input
                type="text"
                value={editingReview.companyName}
                onChange={(e) => setEditingReview({ ...editingReview, companyName: e.target.value })}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase block">Country</label>
              <input
                type="text"
                value={editingReview.country}
                onChange={(e) => setEditingReview({ ...editingReview, country: e.target.value })}
                placeholder="USA, Bangladesh..."
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase block">Project Name</label>
              <input
                type="text"
                value={editingReview.projectName}
                onChange={(e) => setEditingReview({ ...editingReview, projectName: e.target.value })}
                placeholder="Portfolio, SaaS..."
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase block">Rating</label>
              <select
                value={editingReview.rating}
                onChange={(e) => setEditingReview({ ...editingReview, rating: parseInt(e.target.value) })}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground uppercase block">Client Avatar</label>
              <div className="flex items-center gap-3">
                {editingReview.profileImage && (
                  <img
                    src={editingReview.profileImage}
                    alt="Client Profile"
                    className="w-10 h-10 rounded-lg object-cover border border-border"
                  />
                )}
                <label className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted/80 rounded-xl text-xs font-bold border border-border cursor-pointer transition-all">
                  <Upload size={12} />
                  <span>File</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase block">Client Review feedback</label>
            <textarea
              required
              value={editingReview.reviewText}
              onChange={(e) => setEditingReview({ ...editingReview, reviewText: e.target.value })}
              rows={4}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-3 rounded-xl text-sm transition-all cursor-pointer"
          >
            {mutation.isPending ? "Saving review..." : "Save Review"}
          </button>
        </form>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// CONTACT TAB (Contact Coordinates)
// -------------------------------------------------------------
function ContactTab() {
  const queryClient = useQueryClient();
  const { data: contact, isLoading } = useQuery({
    queryKey: ["admin-contact"],
    queryFn: async () => {
      const res = await fetch("/api/contact-info");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/contact-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save contact info");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Contact information saved!");
      queryClient.invalidateQueries({ queryKey: ["admin-contact"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      address: formData.get("address"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      whatsapp: formData.get("whatsapp"),
      facebook: formData.get("facebook"),
      github: formData.get("github"),
      linkedin: formData.get("linkedin"),
      twitter: formData.get("twitter"),
    };
    mutation.mutate(data);
  };

  if (isLoading || !contact) return <div className="text-muted-foreground">Loading contact info...</div>;

  return (
    <form onSubmit={handleSubmit} className="glass p-6 sm:p-8 rounded-3xl border border-border space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase block">Address / Location</label>
          <input
            type="text"
            name="address"
            defaultValue={contact.address}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase block">Email Address</label>
          <input
            type="email"
            name="email"
            defaultValue={contact.email}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase block">Phone Number</label>
          <input
            type="text"
            name="phone"
            defaultValue={contact.phone}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase block">WhatsApp link/number</label>
          <input
            type="text"
            name="whatsapp"
            defaultValue={contact.whatsapp}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-border space-y-4">
        <h4 className="text-sm font-bold text-foreground">Footer Social handles</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Facebook</label>
            <input
              type="text"
              name="facebook"
              defaultValue={contact.facebook}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">GitHub</label>
            <input
              type="text"
              name="github"
              defaultValue={contact.github}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              defaultValue={contact.linkedin}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Twitter / X</label>
            <input
              type="text"
              name="twitter"
              defaultValue={contact.twitter}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
      >
        {mutation.isPending ? "Saving contact coordinates..." : "Save Contact Info"}
      </button>
    </form>
  );
}

// -------------------------------------------------------------
// MESSAGES TAB (Inbox Messages)
// -------------------------------------------------------------
function MessagesTab() {
  const queryClient = useQueryClient();
  const { data: messages, isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const res = await fetch("/api/messages");
      return res.json();
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) => {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete message");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Message deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    },
  });

  if (isLoading || !messages) return <div className="text-muted-foreground">Loading message logs...</div>;

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted border-b border-border font-bold text-foreground">
                <th className="p-4">Sender</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Received</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-semibold">
              {messages.map((m: any) => (
                <tr key={m._id} className={`hover:bg-muted/30 ${!m.isRead ? "bg-primary/5" : ""}`}>
                  <td className="p-4">
                    <p className="font-bold text-foreground">{m.name}</p>
                    <p className="text-[10px] text-muted-foreground">{m.email}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-foreground">{m.subject}</p>
                    <p className="text-muted-foreground font-normal line-clamp-1">{m.message}</p>
                  </td>
                  <td className="p-4">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => markReadMutation.mutate({ id: m._id, isRead: !m.isRead })}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border cursor-pointer transition-colors ${
                        m.isRead
                          ? "bg-muted text-muted-foreground border-border"
                          : "bg-primary/10 border-primary/20 text-primary"
                      }`}
                    >
                      {m.isRead ? "Read" : "Unread"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm("Delete this message?")) {
                          deleteMutation.mutate(m._id);
                        }
                      }}
                      className="p-2 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-500/10 border border-transparent transition-all cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                    Inbox is empty. No messages received.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// BOOKINGS TAB (Calendar Bookings)
// -------------------------------------------------------------
function BookingsTab() {
  const queryClient = useQueryClient();
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "Approved" | "Rejected" }) => {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update booking status");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Booking updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete booking");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Booking deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
    },
  });

  if (isLoading || !bookings) return <div className="text-muted-foreground">Loading calendar bookings...</div>;

  return (
    <div className="glass rounded-3xl border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted border-b border-border font-bold text-foreground">
              <th className="p-4">Client</th>
              <th className="p-4">Schedule</th>
              <th className="p-4">Agenda</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border font-semibold">
            {bookings.map((b: any) => (
              <tr key={b._id} className="hover:bg-muted/30">
                <td className="p-4">
                  <p className="font-bold text-foreground">{b.name}</p>
                  <p className="text-[10px] text-muted-foreground">{b.email}</p>
                </td>
                <td className="p-4">
                  <p className="font-bold text-foreground">{b.date}</p>
                  <p className="text-[10px] text-muted-foreground">Time: {b.time}</p>
                </td>
                <td className="p-4 max-w-[200px] truncate">{b.purpose}</td>
                <td className="p-4 text-center">
                  <span
                    className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      b.status === "Approved"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                        : b.status === "Rejected"
                        ? "bg-red-500/10 border-red-500/30 text-red-500"
                        : "bg-amber-500/10 border-amber-500/30 text-amber-500"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-1.5">
                  {b.status === "Pending" && (
                    <>
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: b._id, status: "Approved" })}
                        className="p-1 px-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatusMutation.mutate({ id: b._id, status: "Rejected" })}
                        className="p-1 px-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      if (confirm("Delete this booking request?")) {
                        deleteMutation.mutate(b._id);
                      }
                    }}
                    className="p-1.5 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-500/10 border border-transparent transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground italic">
                  No meeting requests schedule.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// SEO & GLOBAL SETTINGS TAB
// -------------------------------------------------------------
function SettingsTab({ uploadImageFn }: { uploadImageFn: any }) {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Settings saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        toast.info("Uploading image to Cloudinary...");
        const url = await uploadImageFn(reader.result as string, "settings");
        toast.success("Uploaded!");
        mutation.mutate({ ...settings, ogImage: url });
      } catch (err: any) {
        toast.error(err.message || "Upload failed");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      logoText: formData.get("logoText"),
      siteName: formData.get("siteName"),
      footerText: formData.get("footerText"),
      metaTitle: formData.get("metaTitle"),
      metaDescription: formData.get("metaDescription"),
      keywords: formData
        .get("keywords")
        ?.toString()
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      robotsTxt: formData.get("robotsTxt"),
    };
    mutation.mutate(data);
  };

  const changePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Password change failed");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const oldPassword = formData.get("oldPassword");
    const newPassword = formData.get("newPassword");
    if (!oldPassword || !newPassword) return;
    changePasswordMutation.mutate({ oldPassword, newPassword });
    e.currentTarget.reset();
  };

  if (isLoading || !settings) return <div className="text-muted-foreground">Loading site settings...</div>;

  return (
    <div className="space-y-8">
      {/* Site and SEO Settings */}
      <form onSubmit={handleSubmit} className="glass p-6 sm:p-8 rounded-3xl border border-border space-y-6">
        <h3 className="text-lg font-bold text-foreground">Global Site Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase block">Branding Logo Text</label>
            <input
              type="text"
              name="logoText"
              defaultValue={settings.logoText}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase block">Site Name Title</label>
            <input
              type="text"
              name="siteName"
              defaultValue={settings.siteName}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase block">Footer Credits Text</label>
            <input
              type="text"
              name="footerText"
              defaultValue={settings.footerText}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
            />
          </div>
        </div>

        {/* Global SEO Settings */}
        <h3 className="text-lg font-bold text-foreground pt-6 border-t border-border">Dynamic SEO Parameters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase block">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              defaultValue={settings.metaTitle}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase block">Meta Description</label>
            <input
              type="text"
              name="metaDescription"
              defaultValue={settings.metaDescription}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase block">SEO Keywords (comma-separated)</label>
            <input
              type="text"
              name="keywords"
              defaultValue={settings.keywords?.join(", ")}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
              placeholder="portfolio, developer, code"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase block">Open Graph Cover Image</label>
            <div className="flex items-center gap-3">
              {settings.ogImage && (
                <img
                  src={settings.ogImage}
                  alt="OG Image Preview"
                  className="w-10 h-10 rounded-lg object-cover border border-border"
                />
              )}
              <label className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted/80 rounded-xl text-xs font-bold border border-border cursor-pointer transition-all">
                <Upload size={12} />
                <span>Upload</span>
                <input type="file" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-foreground uppercase block">Robots.txt contents</label>
          <textarea
            name="robotsTxt"
            defaultValue={settings.robotsTxt}
            rows={3}
            className="w-full bg-background border border-border rounded-xl p-4 font-mono text-xs resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-3 rounded-xl text-sm transition-all cursor-pointer"
        >
          {mutation.isPending ? "Saving configuration..." : "Save Settings"}
        </button>
      </form>

      {/* Change Password Panel */}
      <form onSubmit={handlePasswordSubmit} className="glass p-6 sm:p-8 rounded-3xl border border-border space-y-6">
        <h3 className="text-lg font-bold text-foreground">Change Password</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase block">Current Password</label>
            <input
              type="password"
              name="oldPassword"
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground uppercase block">New Password</label>
            <input
              type="password"
              name="newPassword"
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
        >
          {changePasswordMutation.isPending ? "Updating password..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
