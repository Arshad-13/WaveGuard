import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "../providers";

export const metadata: Metadata = {
  title: {
    template: "%s | WaveGuard Auth",
    default: "WaveGuard Authentication",
  },
  description: "WaveGuard Authentication Pages",
};

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <Providers>
      <NextTopLoader color="#5750F1" showSpinner={false} />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900" style={{ paddingTop: 0 }}>
        <main className="w-full h-full" style={{ paddingTop: 0 }}>
          {children}
        </main>
      </div>
    </Providers>
  );
}
