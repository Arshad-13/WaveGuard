"use client";

import { ChatInterface } from "@/components/chatbot/ChatInterface";

export default function ChatBot() {
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
