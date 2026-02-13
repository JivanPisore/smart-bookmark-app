import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Bookmarks | Modern Bookmark Manager",
  description: "A real-time, secure, and beautiful bookmark manager for your digital life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased min-h-screen relative`}>
        {/* Advanced Background System */}
        <div className="fixed inset-0 -z-10 bg-[#020205]">
          <div className="grain" />

          {/* Animated Aurora Elements */}
          <div className="aurora w-[60%] h-[60%] top-[-20%] left-[-10%] bg-primary/30 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="aurora w-[50%] h-[50%] bottom-[-10%] right-[-10%] bg-purple-600/20 animate-pulse" style={{ animationDuration: '12s' }} />
          <div className="aurora w-[30%] h-[30%] top-[40%] left-[20%] bg-blue-600/10 animate-pulse" style={{ animationDuration: '15s' }} />

          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {children}
        </main>
      </body>

    </html>
  );
}
