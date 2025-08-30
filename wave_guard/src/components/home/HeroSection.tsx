import Link from 'next/link';
import { ArrowRight, Shield, Waves, Bell, UserPlus, LogIn } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 overflow-hidden pt-16 pb-16">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center py-4">
        {/* Hero Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full shadow-xl mb-8 mt-4">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-white">🌊 Live Monitoring Active</span>
        </div>
        
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight tracking-tight">
            Coastal Threat
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Detection System
            </span>
          </h1>
        </div>
        
        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-gray-200 mb-16 max-w-4xl mx-auto leading-relaxed font-medium">
          Advanced AI-powered monitoring and early warning system for tsunamis, cyclones, 
          and coastal hazards. <span className="text-cyan-300 font-semibold">Protecting communities through real-time detection and instant alerts.</span>
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Link
            href="/auth?mode=signup"
            className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 flex items-center space-x-3"
          >
            <UserPlus className="h-7 w-7" />
            <span>Get Started</span>
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/auth?mode=signin"
            className="group bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:border-cyan-400 px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white/20 flex items-center space-x-3"
          >
            <LogIn className="h-7 w-7" />
            <span>Sign In</span>
          </Link>
        </div>

        {/* Secondary Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <Link
            href="/dashboard"
            className="group bg-white/5 backdrop-blur-sm text-white border border-white/20 hover:border-cyan-400/50 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:bg-white/10 flex items-center space-x-2"
          >
            <Shield className="h-5 w-5" />
            <span>View Dashboard</span>
          </Link>
          
          <Link
            href="/report"
            className="group bg-white/5 backdrop-blur-sm text-white border border-white/20 hover:border-cyan-400/50 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:bg-white/10 flex items-center space-x-2"
          >
            <Bell className="h-5 w-5" />
            <span>Report Activity</span>
          </Link>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-3xl hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">24/7</div>
            <div className="text-white font-bold text-lg">Real-time Monitoring</div>
            <div className="text-gray-300 text-sm mt-2">Continuous AI surveillance</div>
          </div>
          
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-3xl hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">99.9%</div>
            <div className="text-white font-bold text-lg">Detection Accuracy</div>
            <div className="text-gray-300 text-sm mt-2">ML-powered precision</div>
          </div>
          
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-3xl hover:scale-105 transition-all duration-300 hover:shadow-2xl">
            <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">&lt;30s</div>
            <div className="text-white font-bold text-lg">Alert Response Time</div>
            <div className="text-gray-300 text-sm mt-2">Instant notifications</div>
          </div>
        </div>
      </div>
    </section>
  );
}
