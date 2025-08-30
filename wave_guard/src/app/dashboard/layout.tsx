import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "../providers";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: {
    template: "%s | WaveGuard Dashboard",
    default: "WaveGuard Dashboard",
  },
  description: "WaveGuard Admin Dashboard",
};

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <Providers>
        <NextTopLoader color="#5750F1" showSpinner={false} />

        <div className="flex min-h-screen">
          <Sidebar />

          <div className="w-full bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
            <Header />

            <main className="relative z-10 mx-auto w-full max-w-screen-2xl overflow-visible p-4 pt-8 md:p-6 md:pt-12 2xl:p-10 2xl:pt-16">
              {children}
            </main>
          </div>
        </div>
      </Providers>
    </AuthProvider>
  );
}
