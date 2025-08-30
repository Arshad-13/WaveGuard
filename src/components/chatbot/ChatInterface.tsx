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
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-slate-800 to-blue-900 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-white font-bold text-xl">WaveGuard AI Assistant</h2>
                <p className="text-blue-200 font-medium">Coastal Intelligence • Marine Safety Expert</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white text-sm font-semibold">Online</span>
              </div>
              <div className="text-right">
                <div className="text-cyan-400 font-bold text-lg">⚡ Ready</div>
                <div className="text-blue-200 text-xs">Sub-second response</div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[500px] overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div key={message.id} className={clsx(
                'flex items-start space-x-4',
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              )}>
                <div className={clsx(
                  'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg',
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-600'
                    : 'bg-gradient-to-br from-slate-700 to-blue-800'
                )}>
                  {message.type === 'user' ? (
                    <User className="h-6 w-6 text-white" />
                  ) : (
                    <Bot className="h-6 w-6 text-white" />
                  )}
                </div>
                
                <div className={clsx(
                  'max-w-2xl rounded-2xl px-6 py-4 shadow-lg',
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white ml-auto'
                    : 'bg-white border border-gray-200 text-gray-900'
                )}>
                  <p className="whitespace-pre-line leading-relaxed text-lg font-medium">
                    {message.content}
                  </p>
                  {message.suggestions && (
                    <div className="mt-4 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 font-medium"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className={clsx(
                    'text-sm mt-3 font-medium',
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
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
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-blue-800 flex items-center justify-center shadow-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-gray-600 font-medium">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-8 py-6 bg-gray-100 border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm font-semibold text-gray-700 mb-4">🚀 Quick Actions</p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => handleSuggestionClick('What are the current coastal threats in my area?')}
                className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <AlertCircle className="h-4 w-4" />
                <span>Current Threats</span>
              </button>
              <button 
                onClick={() => handleSuggestionClick('How should I prepare for coastal emergencies?')}
                className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Info className="h-4 w-4" />
                <span>Emergency Prep</span>
              </button>
              <button 
                onClick={() => handleSuggestionClick('I need to report a coastal incident')}
                className="flex items-center space-x-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Zap className="h-4 w-4" />
                <span>Report Incident</span>
              </button>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-8 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about coastal threats, safety protocols, emergency procedures, or marine conditions..."
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg font-medium transition-all duration-300"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-slate-800 to-blue-900 hover:from-slate-900 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500 font-medium">
                💡 Press Enter to send • Shift+Enter for new line
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold">AI Ready • Powered by WaveGuard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
