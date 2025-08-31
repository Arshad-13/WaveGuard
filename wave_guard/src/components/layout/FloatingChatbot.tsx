'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, X } from 'lucide-react';

export function FloatingChatbot() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href="/chatbot"
        className="group relative flex items-center justify-center w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <MessageCircle className="w-6 h-6 text-white" />
        
        {/* Tooltip */}
        <div className={`absolute right-full mr-3 px-3 py-2 bg-dark text-white text-sm rounded-lg whitespace-nowrap transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}>
          Ask AI Assistant
          <div className="absolute top-1/2 left-full w-0 h-0 border-l-4 border-l-dark border-t-2 border-b-2 border-t-transparent border-b-transparent transform -translate-y-1/2" />
        </div>
      </Link>
    </div>
  );
}
