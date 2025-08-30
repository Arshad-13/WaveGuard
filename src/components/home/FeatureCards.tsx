import Link from 'next/link';
import { Waves, Wind, Brain, Zap, ArrowRight } from 'lucide-react';
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
    <section className="py-24 px-6 sm:px-8 lg:px-12 bg-slate-100 dark:bg-dark-2">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI-Powered Detection Systems
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our advanced machine learning algorithms provide early warning systems for coastal threats, 
            helping communities prepare and respond effectively.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {features.map((feature) => {
            const Icon = feature.icon;
            
            return (
              <div
                key={feature.id}
                className="bg-white dark:bg-dark-3 rounded-2xl border border-slate-200 dark:border-gray-600 hover:shadow-xl hover:border-ocean-200 dark:hover:border-ocean-700 transition-all duration-300"
              >
                <div className="p-10">
                  <div className="flex items-center mb-6">
                    <div className={clsx(
                      "p-3 rounded-lg",
                      feature.id === 'tsunami' ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" : "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
                    )}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Brain className="h-4 w-4 mr-1" />
                        AI/ML Powered
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {feature.features.map((item, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Zap className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>

                  <Link
                    href={feature.href}
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-ocean-600 hover:bg-ocean-700 text-white font-medium transition-colors"
                  >
                    View System
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-gray-50 dark:bg-dark-2 border border-gray-200 dark:border-gray-700 rounded-lg p-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Join the Coastal Protection Network
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Help us build a safer tomorrow by reporting coastal activities and staying informed about threats in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/report"
              className="bg-ocean-600 hover:bg-ocean-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Report Activity
            </Link>
            <Link
              href="/chatbot"
              className="border border-ocean-600 text-ocean-600 hover:bg-ocean-600 hover:text-white px-8 py-3 rounded-lg font-medium transition-colors dark:border-ocean-400 dark:text-ocean-400 dark:hover:bg-ocean-400 dark:hover:text-white"
            >
              Ask AI Assistant
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
