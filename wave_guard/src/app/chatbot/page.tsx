"use client";

import { useState, useEffect, useRef } from "react";
import {
  saveMessageToFirestore,
  getMessagesFromFirestore,
} from "@/lib/chatbot-utils";
import { useAuth } from "@/hooks/useAuth";
import { chatWithGemini } from "@/lib/chatbot";
import { marked } from "marked";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from '@/lib/authLib';

import { useRouter } from "next/navigation";

export default function ChatBot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const router = useRouter();

    useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        alert("Please Login first to talk with Zyra, our AI fashion consultant.")
        router.push('/auth/login');
      }
      // else setUser(u);
    });

    return () => unsub();
  }, []);

  // Load chat history for demo user
  useEffect(() => {
    if (user?.uid) {
      const fetchMessages = async () => {
      const history = await getMessagesFromFirestore(user.uid);
      setMessages(history);
    };
    fetchMessages();
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, loading]);

  const addMessage = async (role, content) => {
    const message = {
      role,
      type: "text",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
    await saveMessageToFirestore(user.uid, message);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userInput = input.trim();
    await addMessage("user", userInput);
    setInput("");
    setLoading(true);

    try {
      if (userInput === "/help") {
        await addMessage(
          "bot",
          "Instructions:\n- What should I do if Tsunami strikes in?"
        );
      } else {
        const allMessages = [...messages, { role: "user", content: userInput }];
        const response = await chatWithGemini(allMessages.map((m) => m.content), user.uid);
        await addMessage("bot", marked(response));
      }
    } catch (err) {
      await addMessage("bot", "Oops! " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V19C3 20.1 3.9 21 5 21H11V19H5V3H13V9H21Z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-900 bg-clip-text text-transparent">
              WaveGuard Chatbot
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-medium">
            Get instant answers about coastal safety, emergency procedures, and marine conditions from our AI-powered assistant.
          </p>
        </div>
        
        {/* Chat Interface */}
        <ChatInterface />
      </div>
    </div>
  );
}
