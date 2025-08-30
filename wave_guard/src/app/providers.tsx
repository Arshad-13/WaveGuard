"use client";

import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class" enableSystem={false} forcedTheme="light">
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
  );
}
