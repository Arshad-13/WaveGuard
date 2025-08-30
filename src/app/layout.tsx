import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingChatbot } from "@/components/layout/FloatingChatbot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Coastal Threat Alert System | WaveGuard",
  description: "AI-powered coastal threat detection and alert system for tsunami and cyclone monitoring",
  keywords: ["tsunami", "cyclone", "coastal", "alert", "AI", "detection", "monitoring"],
  authors: [{ name: "WaveGuard Team" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-ocean-50 min-h-screen`}
      >
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <FloatingChatbot />
      </body>
    </html>
  );
}
