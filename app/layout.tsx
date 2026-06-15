import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { ThemeProvider } from "./theme-context";

export const metadata: Metadata = {
  title: "Parves Mosarof | Full Stack Developer Portfolio",
  description: "A premium dynamic developer portfolio showcasing projects, learnings, blogs, client reviews, and custom calendar booking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" style={{ scrollBehavior: "smooth" }}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

