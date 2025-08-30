import { ChatInterface } from '@/components/chatbot/ChatInterface';
import { Bot, Shield, Zap, Brain, MessageCircle } from 'lucide-react';

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-6 py-16">
        {/* Hero Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
            <Bot className="h-6 w-6 text-cyan-400" />
            <span className="text-cyan-100 font-semibold">AI-Powered Coastal Intelligence</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black tracking-tight text-white mb-6">
            Coastal AI
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
              Assistant
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-medium">
            Get instant expert guidance on coastal threats, emergency preparedness, and marine safety. 
            Your AI-powered guardian for coastal protection 🤖
          </p>
        </header>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Real-time Analysis */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Real-time Analysis</h3>
              </div>
              <p className="text-blue-100 leading-relaxed">
                Get instant threat assessments, weather updates, and safety recommendations powered by advanced AI.
              </p>
              <div className="mt-4 flex items-center space-x-2 text-blue-200">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">Live Intelligence</span>
              </div>
            </div>
          </div>

          {/* Expert Guidance */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-800 p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Expert Guidance</h3>
              </div>
              <p className="text-cyan-100 leading-relaxed">
                Access professional marine safety protocols, emergency procedures, and coastal protection strategies.
              </p>
              <div className="mt-4 flex items-center space-x-2 text-cyan-200">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">24/7 Available</span>
              </div>
            </div>
          </div>

          {/* Instant Response */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 p-6 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Instant Response</h3>
              </div>
              <p className="text-teal-100 leading-relaxed">
                Lightning-fast responses to your questions about coastal activities, threats, and safety measures.
              </p>
              <div className="mt-4 flex items-center space-x-2 text-teal-200">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">Sub-second Response</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <ChatInterface />

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-3xl font-bold text-cyan-400 mb-2">24/7</div>
            <div className="text-blue-200 font-medium">AI Assistant Active</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-3xl font-bold text-cyan-400 mb-2">12.5K</div>
            <div className="text-blue-200 font-medium">Questions Answered</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-3xl font-bold text-cyan-400 mb-2">&lt;1s</div>
            <div className="text-blue-200 font-medium">Average Response</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-3xl font-bold text-cyan-400 mb-2">99.8%</div>
            <div className="text-blue-200 font-medium">Accuracy Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
