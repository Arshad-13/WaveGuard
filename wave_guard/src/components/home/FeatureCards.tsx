import Link from 'next/link';
import { Waves, Wind, Brain, Zap, ArrowRight, Shield, Activity, Bell } from 'lucide-react';
import { clsx } from 'clsx';

const features = [
  {
    id: 'tsunami',
    title: 'Tsunami Detection System',
    description: 'Advanced AI/ML algorithms monitor seismic activity, ocean buoy data, and underwater sensors to predict tsunami threats with high accuracy.',
    icon: Waves,
    gradient: 'from-blue-600 to-cyan-600',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    features: [
      'Real-time seismic monitoring',
      'Ocean buoy data analysis',
      'AI-powered wave prediction',
      'Multi-source data fusion'
    ],
    href: '/dashboard/tsunami'
  },
  {
    id: 'cyclone',
    title: 'Cyclone Detection System',
    description: 'Satellite imagery analysis and meteorological data processing to detect and track cyclone formation and movement patterns.',
    icon: Wind,
    gradient: 'from-purple-600 to-pink-600',
    bgGradient: 'from-purple-500/20 to-pink-500/20',
    features: [
      'Satellite image processing',
      'Weather pattern analysis',
      'Storm tracking & prediction',
      'Wind speed estimation'
    ],
    href: '/dashboard/cyclone'
  }
];

export function FeatureCards() {
  return (
    <section className="py-24 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-slate-100 to-gray-200 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-300/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 rounded-full mb-8 shadow-xl">
            <Brain className="h-5 w-5 text-white" />
            <span className="text-white font-bold">🤖 AI-Powered Technology</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
            Advanced Detection
            <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Systems
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
            Cutting-edge machine learning algorithms provide comprehensive early warning systems for coastal threats, 
            <span className="text-blue-600 font-semibold"> empowering communities with life-saving intelligence.</span>
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isFirstCard = feature.id === 'tsunami';
            
            return (
              <div
                key={feature.id}
                className="group relative bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 border border-gray-200 overflow-hidden"
              >
                {/* Enhanced gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                
                {/* Bold accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-3 bg-gradient-to-r ${
                  isFirstCard ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'
                } rounded-t-3xl`}></div>
                
                <div className="relative p-10">
                  {/* Header */}
                  <div className="flex items-center mb-8">
                    <div className={`p-5 rounded-2xl shadow-xl bg-gradient-to-r ${
                      isFirstCard 
                        ? 'from-blue-500 to-cyan-500' 
                        : 'from-purple-500 to-pink-500'
                    }`}>
                      <Icon className="h-12 w-12 text-white" />
                    </div>
                    <div className="ml-6">
                      <h3 className="text-3xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-bold text-green-600">🚀 AI/ML Powered</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 mb-8 leading-relaxed text-lg font-medium">
                    {feature.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-5 mb-10">
                    {feature.features.map((item, index) => (
                      <div key={index} className="flex items-center group-hover:translate-x-3 transition-transform duration-300">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-gradient-to-r ${
                          isFirstCard ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'
                        } shadow-lg`}>
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-gray-800 font-bold text-lg">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={feature.href}
                    className={`inline-flex items-center px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 bg-gradient-to-r ${
                      isFirstCard 
                        ? 'from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500' 
                        : 'from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                    } text-white`}
                  >
                    <span>Explore System</span>
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced CTA Section */}
        <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-cyan-900 rounded-3xl p-16 text-center overflow-hidden shadow-2xl">
          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full -translate-y-32 translate-x-32 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full translate-y-48 -translate-x-48 animate-pulse"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm border border-white/30 px-8 py-4 rounded-full mb-8 shadow-xl">
              <Shield className="h-6 w-6 text-white" />
              <span className="text-white font-bold text-lg">🛡️ Join Our Network</span>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
              Become Part of the
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Solution
              </span>
            </h3>
            <p className="text-xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
              Join thousands of coastal communities in building a comprehensive early warning network. 
              <span className="text-cyan-300 font-bold">Your participation helps save lives and protect coastal regions worldwide.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/report"
                className="group flex items-center space-x-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Bell className="h-6 w-6" />
                <span>Report Coastal Activity</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/chatbot"
                className="group flex items-center space-x-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:border-cyan-400 text-white hover:bg-white/20 px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <Brain className="h-6 w-6" />
                <span>AI Assistant</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
