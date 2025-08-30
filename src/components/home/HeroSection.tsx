import Link from 'next/link';
import { ArrowRight, Shield, Waves } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-sky-50 to-blue-50 dark:from-dark-2 dark:to-dark-3">
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-ocean-100 dark:bg-ocean-900 rounded-full">
            <Waves className="h-16 w-16 text-ocean-600 dark:text-ocean-400" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900 dark:text-white">
          Coastal Threat
          <span className="block text-ocean-600 dark:text-ocean-400">
            Alert System
          </span>
        </h1>
        
        <p className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          AI-powered real-time monitoring and detection system for tsunamis, cyclones, and coastal threats to protect communities worldwide.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 bg-ocean-600 hover:bg-ocean-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            <Shield className="h-5 w-5" />
            <span>View Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          
          <Link
            href="/report"
            className="flex items-center space-x-2 border border-ocean-600 text-ocean-600 hover:bg-ocean-600 hover:text-white px-8 py-3 rounded-lg font-medium transition-colors dark:border-ocean-400 dark:text-ocean-400 dark:hover:bg-ocean-400 dark:hover:text-white"
          >
            <span>Report Incident</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="bg-white/90 dark:bg-dark-3 border border-sky-200 dark:border-gray-700 rounded-xl p-8 shadow-lg backdrop-blur-sm">
            <div className="text-3xl font-bold mb-3 text-ocean-600 dark:text-sky-400">24/7</div>
            <div className="text-gray-700 dark:text-gray-300 font-medium">Monitoring</div>
          </div>
          <div className="bg-white/90 dark:bg-dark-3 border border-sky-200 dark:border-gray-700 rounded-xl p-8 shadow-lg backdrop-blur-sm">
            <div className="text-3xl font-bold mb-3 text-ocean-600 dark:text-sky-400">AI-Powered</div>
            <div className="text-gray-700 dark:text-gray-300 font-medium">Detection</div>
          </div>
          <div className="bg-white/90 dark:bg-dark-3 border border-sky-200 dark:border-gray-700 rounded-xl p-8 shadow-lg backdrop-blur-sm">
            <div className="text-3xl font-bold mb-3 text-ocean-600 dark:text-sky-400">Real-time</div>
            <div className="text-gray-700 dark:text-gray-300 font-medium">Alerts</div>
          </div>
        </div>
      </div>
    </section>
  );
}
