import Link from 'next/link';
import { ArrowRight, Shield, Waves } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-ocean-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        {/* Hero Badge */}
        <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-lg mb-8">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-ocean-700">Live Monitoring Active</span>
        </div>
        
        {/* Logo/Icon */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="p-6 bg-primary rounded-2xl shadow-2xl">
              <Waves className="h-20 w-20 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          <span className="text-ocean-900">Coastal</span>
          <span className="block text-primary">Threat Guard</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl mb-12 text-ocean-700 max-w-4xl mx-auto leading-relaxed font-medium">
          Advanced AI-powered monitoring system delivering real-time coastal threat detection, 
          tsunami alerts, and cyclone tracking to protect communities worldwide.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link
            href="/dashboard"
            className="group flex items-center space-x-3 bg-primary hover:bg-ocean-700 text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Shield className="h-6 w-6" />
            <span>Launch Dashboard</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/report"
            className="group flex items-center space-x-3 bg-white hover:bg-ocean-100 text-primary border-2 border-primary px-10 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>Report Threat</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Professional Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-xl border-l-4 border-primary transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-ocean-100 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary">24/7</div>
            </div>
            <h3 className="text-lg font-semibold text-ocean-900 mb-2">Continuous Monitoring</h3>
            <p className="text-ocean-700 text-sm">Round-the-clock surveillance of coastal conditions</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl border-l-4 border-cyan-500 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                <Waves className="h-6 w-6 text-cyan-500" />
              </div>
              <div className="text-3xl font-bold text-cyan-500">AI</div>
            </div>
            <h3 className="text-lg font-semibold text-ocean-900 mb-2">Smart Detection</h3>
            <p className="text-ocean-700 text-sm">Machine learning algorithms for precise threat analysis</p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl border-l-4 border-green-500 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ArrowRight className="h-6 w-6 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-500">Real-time</div>
            </div>
            <h3 className="text-lg font-semibold text-ocean-900 mb-2">Instant Alerts</h3>
            <p className="text-ocean-700 text-sm">Immediate notifications when threats are detected</p>
          </div>
        </div>
      </div>
    </section>
  );
}
