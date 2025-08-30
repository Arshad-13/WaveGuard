import Link from 'next/link';
import { Waves, Wind, Brain, Zap, ArrowRight, Shield } from 'lucide-react';
import { clsx } from 'clsx';

const features = [
  {
    id: 'tsunami',
    title: 'Tsunami Detection System',
    description: 'Advanced AI/ML algorithms monitor seismic activity, ocean buoy data, and underwater sensors to predict tsunami threats with high accuracy.',
    icon: Waves,
    color: 'from-blue-500 to-cyan-500',
    darkColor: 'dark:from-blue-600 dark:to-cyan-600',
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
    color: 'from-purple-500 to-pink-500',
    darkColor: 'dark:from-purple-600 dark:to-pink-600',
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
    <section className="py-24 px-6 sm:px-8 lg:px-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-ocean-100 px-6 py-3 rounded-full mb-6">
            <Brain className="h-5 w-5 text-primary" />
            <span className="text-ocean-800 font-semibold">AI-Powered Technology</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-ocean-900 mb-6">
            Advanced Detection Systems
          </h2>
          <p className="text-xl text-ocean-700 max-w-3xl mx-auto leading-relaxed">
            Cutting-edge machine learning algorithms provide comprehensive early warning systems for coastal threats, 
            empowering communities with life-saving intelligence.
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
                className="group relative bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 overflow-hidden"
              >
                {/* Card Accent */}
                <div className={`absolute top-0 left-0 right-0 h-2 ${
                  isFirstCard ? 'bg-cyan-500' : 'bg-purple-500'
                }`}></div>
                
                <div className="p-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center">
                      <div className={`p-4 rounded-2xl shadow-lg ${
                        isFirstCard 
                          ? 'bg-cyan-100 text-cyan-600' 
                          : 'bg-purple-100 text-purple-600'
                      }`}>
                        <Icon className="h-10 w-10" />
                      </div>
                      <div className="ml-6">
                        <h3 className="text-2xl font-bold text-ocean-900 mb-2">
                          {feature.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-ocean-600">AI/ML Powered</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-ocean-700 mb-8 leading-relaxed text-lg">
                    {feature.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-4 mb-10">
                    {feature.features.map((item, index) => (
                      <div key={index} className="flex items-center group-hover:translate-x-2 transition-transform duration-300">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                          isFirstCard ? 'bg-cyan-100' : 'bg-purple-100'
                        }`}>
                          <Zap className={`h-4 w-4 ${
                            isFirstCard ? 'text-cyan-600' : 'text-purple-600'
                          }`} />
                        </div>
                        <span className="text-ocean-800 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={feature.href}
                    className={`inline-flex items-center px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      isFirstCard 
                        ? 'bg-cyan-500 hover:bg-cyan-600 text-white' 
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}
                  >
                    <span>Explore System</span>
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Professional CTA Section */}
        <div className="relative bg-primary rounded-3xl p-16 text-center overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-48 -translate-x-48"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-3 bg-white/20 px-6 py-3 rounded-full mb-8">
              <Shield className="h-5 w-5 text-white" />
              <span className="text-white font-semibold">Join Our Network</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Become Part of the Solution
            </h3>
            <p className="text-xl text-ocean-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of coastal communities in building a comprehensive early warning network. 
              Your participation helps save lives and protect coastal regions worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/report"
                className="group flex items-center space-x-3 bg-white hover:bg-ocean-100 text-primary px-10 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>Report Coastal Activity</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/chatbot"
                className="group flex items-center space-x-3 border-2 border-white text-white hover:bg-white hover:text-primary px-10 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <span>AI Assistant</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
