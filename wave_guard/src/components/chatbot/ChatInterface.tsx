'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Waves, AlertCircle, Info, Zap } from 'lucide-react';
import { clsx } from 'clsx';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

// Initial welcome message - can be customized or removed once ML model is integrated
const welcomeMessage: Message = {
  id: 'welcome',
  type: 'assistant',
  content: 'Hello! I\'m your AI Coastal Assistant. I\'m currently being integrated with advanced ML models to provide you with:\n\n• Real-time coastal threat analysis\n• Intelligent threat detection\n• Emergency response guidance\n• Incident reporting assistance\n\nHow can I help you today?',
  timestamp: new Date(),
};

// Placeholder function for ML model integration
const callMLModel = async (userInput: string): Promise<string> => {
  // TODO: Replace this with actual ML model API call
  // This is where you would integrate your tsunami/cyclone detection models
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  // Placeholder response - replace with actual ML model response
  return `I understand you're asking: "${userInput}". I'm currently being integrated with ML models to provide intelligent coastal threat analysis. Please connect your trained models to this interface for full functionality.`;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userInput = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call ML model API
      const aiResponse = await callMLModel(userInput);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      // Handle errors gracefully
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again later or contact support if the issue persists.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-dark-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
        
        {/* Chat Header */}
        <div className="bg-ocean-600 dark:bg-ocean-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-ocean-500 dark:bg-ocean-600 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">AI Coastal Assistant</h2>
              <p className="text-ocean-100 text-sm">Ready to help with ML model integration</p>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <div className="w-3 h-3 bg-sky-400 rounded-full animate-pulse" />
              <span className="text-white text-sm">Ready</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={clsx(
              'flex items-start space-x-3',
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
            )}>
              <div className={clsx(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                message.type === 'user'
                  ? 'bg-ocean-500'
                  : 'bg-ocean-600 dark:bg-ocean-700'
              )}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              
              <div className={clsx(
                'max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-4 py-3',
                message.type === 'user'
                  ? 'bg-ocean-500 text-white ml-auto'
                  : 'bg-gray-100 dark:bg-dark-3 text-gray-900 dark:text-white'
              )}>
                <p className="whitespace-pre-line leading-relaxed">
                  {message.content}
                </p>
                {message.suggestions && (
                  <div className="mt-3 space-y-2">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
                <div className={clsx(
                  'text-xs mt-2 opacity-70',
                  message.type === 'user' ? 'text-ocean-100' : 'text-gray-500 dark:text-gray-400'
                )}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ocean-600 dark:bg-ocean-700 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-dark-3 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4 bg-slate-100 dark:bg-dark-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => handleSuggestionClick('What are current threats?')}
              className="flex items-center space-x-1 px-3 py-1 bg-white dark:bg-dark-4 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-ocean-50 hover:text-ocean-600 dark:hover:bg-ocean-900/30 dark:hover:text-ocean-400 transition-colors"
            >
              <AlertCircle className="h-3 w-3" />
              <span>Current Threats</span>
            </button>
            <button 
              onClick={() => handleSuggestionClick('Emergency preparedness')}
              className="flex items-center space-x-1 px-3 py-1 bg-white dark:bg-dark-4 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-ocean-50 hover:text-ocean-600 dark:hover:bg-ocean-900/30 dark:hover:text-ocean-400 transition-colors"
            >
              <Info className="h-3 w-3" />
              <span>Preparedness</span>
            </button>
            <button 
              onClick={() => handleSuggestionClick('Report incident')}
              className="flex items-center space-x-1 px-3 py-1 bg-white dark:bg-dark-4 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-ocean-50 hover:text-ocean-600 dark:hover:bg-ocean-900/30 dark:hover:text-ocean-400 transition-colors"
            >
              <Zap className="h-3 w-3" />
              <span>Report</span>
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-2">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about coastal threats, safety tips, or report incidents..."
                className="w-full px-4 py-3 bg-white dark:bg-dark-3 border border-gray-200 dark:border-dark-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent resize-none"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 bg-ocean-600 hover:bg-ocean-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
