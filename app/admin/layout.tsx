import React from "react";

export const metadata = {
  title: "Admin Dashboard | DevParves",
  description: "Portfolio management console.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {children}
    </div>
  );
}
