import { ReportForm } from '@/components/report/ReportForm';
import { Shield, AlertTriangle, Phone } from 'lucide-react';

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl px-6 py-16">
        {/* Hero Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
            <Shield className="h-6 w-6 text-cyan-400" />
            <span className="text-cyan-100 font-semibold">Coastal Protection System</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black tracking-tight text-white mb-6">
            Report Coastal
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
              Activity
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-medium">
            Be the guardian of our coastlines. Report illegal activities, environmental threats, 
            and unsafe behavior to protect our marine ecosystems 🌊
          </p>
        </header>

        {/* Info Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Awareness Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🌊</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Protect Our Coasts</h2>
              </div>
              <p className="text-blue-100 text-lg leading-relaxed">
                Report garbage dumping, illegal fishing, water pollution, construction violations, 
                and wildlife disturbances. Your vigilance saves marine life.
              </p>
              <div className="mt-6 flex items-center space-x-2 text-blue-200">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">Community Powered Protection</span>
              </div>
            </div>
          </div>

          {/* Emergency Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 to-red-800 p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Emergency Alert</h2>
              </div>
              <p className="text-red-100 text-lg leading-relaxed">
                For immediate emergencies, contact local authorities directly. 
                This reporting system is for documentation and non-urgent incidents.
              </p>
              <div className="mt-6 flex items-center space-x-2 text-red-200">
                <Phone className="h-4 w-4" />
                <span className="text-sm font-semibold">Emergency: 911 | Coast Guard: 1-800-424-8802</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="relative">
          {/* Form Background */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-3xl"></div>
          
          {/* Form Content */}
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-slate-800 to-blue-900 px-8 py-6">
              <h3 className="text-2xl font-bold text-white flex items-center space-x-3">
                <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <span>Submit Your Report</span>
              </h3>
              <p className="text-blue-200 mt-2">All fields marked with * are required for processing</p>
            </div>
            
            {/* Form Body */}
            <div className="p-8">
              <ReportForm />
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-3xl font-bold text-cyan-400 mb-2">24/7</div>
            <div className="text-blue-200 font-medium">Monitoring Active</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-3xl font-bold text-cyan-400 mb-2">1,247</div>
            <div className="text-blue-200 font-medium">Reports Processed</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-3xl font-bold text-cyan-400 mb-2">98%</div>
            <div className="text-blue-200 font-medium">Response Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
