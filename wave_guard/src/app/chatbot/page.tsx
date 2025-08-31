"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '@/lib/authLib';
import { useRouter } from "next/navigation";
import { ChatInterface } from "@/components/chatbot/ChatInterface";
import { useAuth } from "@/hooks/useAuth";


export default function ChatBot() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        alert("Please Login first to talk with WaveGuard, our AI coastal safety assistant.")
        router.push('/auth');
      }
    });

    return () => unsub();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 p-6">
      <ChatInterface />
    </div>
  );
}
