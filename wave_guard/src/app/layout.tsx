import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { FloatingChatbot } from "@/components/layout/FloatingChatbot";
import { AuthProvider } from "@/lib/auth-context";

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
        <AuthProvider>
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
          <FloatingChatbot />
        </AuthProvider>
      </body>
    </html>
  );
}
