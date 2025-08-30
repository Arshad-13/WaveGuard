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
    <div className="chatbot-container">
      <div className="chatbot-messages">
        <div className="chatbot-watermark">
          <img src="/logo-home.png" alt="Namaste.dev Logo" />
        </div>

        {messages.map((msg, idx) => (
          <div key={idx} className={`chatbot-message ${msg.role}`}>
            <span dangerouslySetInnerHTML={{ __html: marked(msg.content) }} />
          </div>
        ))}

        {loading && (
          <div className="chatbot-message bot">
            AI bot is typing<span className="typing-dots"><span>.</span><span>.</span><span>.</span></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="chatbot-input"
          placeholder="Ask for help/guidance"
        />
        <button onClick={handleSend} className="chatbot-send-btn">Send</button>
      </div>
    </div>
  );
}
