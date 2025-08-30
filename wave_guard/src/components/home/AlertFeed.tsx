'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, MapPin, Waves, Wind } from 'lucide-react';
import { clsx } from 'clsx';

interface Alert {
  id: string;
  type: 'tsunami' | 'cyclone' | 'all-clear' | 'warning';
  title: string;
  location: string;
  time: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

// Placeholder function for fetching alerts from ML models
const fetchAlertsFromMLModel = async (): Promise<Alert[]> => {
  // TODO: Replace this with actual ML model API call
  // This is where you would fetch real-time alerts from your trained models
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return empty array as placeholder - replace with actual ML model data
  return [
    {
      id: 'placeholder',
      type: 'warning',
      title: 'ML Model Integration Ready',
      location: 'System Status',
      time: 'Now',
      severity: 'low',
      description: 'Alert feed is ready for ML model integration. Connect your trained tsunami and cyclone detection models to display real-time threats.'
    }
  ];
};

const severityConfig = {
  critical: {
    color: 'bg-red-500',
    textColor: 'text-red-700 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-800',
    bgColor: 'bg-red-50 dark:bg-red-900/20'
  },
  high: {
    color: 'bg-orange-500',
    textColor: 'text-orange-700 dark:text-orange-400',
    borderColor: 'border-orange-200 dark:border-orange-800',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20'
  },
  medium: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700 dark:text-yellow-400',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
  },
  low: {
    color: 'bg-sky-500',
    textColor: 'text-sky-700 dark:text-sky-400',
    borderColor: 'border-sky-200 dark:border-sky-800',
    bgColor: 'bg-sky-50 dark:bg-sky-900/20'
  }
};

const typeIcons = {
  tsunami: Waves,
  cyclone: Wind,
  'all-clear': CheckCircle,
  warning: AlertTriangle
};

export function AlertFeed() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [loading, setLoading] = useState(true);

  // Load initial alerts from ML model
  useEffect(() => {
    const loadInitialAlerts = async () => {
      try {
        setLoading(true);
        const initialAlerts = await fetchAlertsFromMLModel();
        setAlerts(initialAlerts);
      } catch (error) {
        console.error('Failed to load alerts:', error);
        // Set placeholder alert for errors
        setAlerts([
          {
            id: 'error',
            type: 'warning',
            title: 'Alert System Status',
            location: 'System',
            time: 'Now',
            severity: 'medium',
            description: 'Currently connecting to ML monitoring systems. Please ensure your models are properly configured and accessible.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialAlerts();
  }, []);

  // Real-time updates from ML model
  useEffect(() => {
    if (!isLive || loading) return;

    const interval = setInterval(async () => {
      try {
        // Fetch new alerts from ML model
        const newAlerts = await fetchAlertsFromMLModel();
        setAlerts(newAlerts);
      } catch (error) {
        console.error('Failed to fetch real-time alerts:', error);
      }
    }, 30000); // Check every 30 seconds for ML model updates

    return () => clearInterval(interval);
  }, [isLive, loading]);

  return (
    <section className="py-24 px-6 sm:px-8 lg:px-12 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div>
            <div className="text-4xl mb-4">🚨</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              Real-time Alert
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Feed
              </span>
            </h2>
            <p className="text-blue-100 text-lg font-medium">
              Live monitoring of coastal threats and system status
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={clsx(
              'flex items-center space-x-3 px-6 py-3 rounded-full text-sm font-bold backdrop-blur-sm border shadow-lg',
              isLive 
                ? 'bg-green-500/20 text-green-300 border-green-400/30' 
                : 'bg-gray-500/20 text-gray-300 border-gray-400/30'
            )}>
              <div className={clsx(
                'w-3 h-3 rounded-full',
                isLive ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' : 'bg-gray-400'
              )} />
              <span className="text-lg">{isLive ? '🔴 LIVE' : '⏸️ PAUSED'}</span>
            </div>
            
            <button
              onClick={() => setIsLive(!isLive)}
              className="px-6 py-3 text-sm font-bold bg-white/20 backdrop-blur-sm border border-white/30 hover:border-cyan-400 text-white rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-105"
            >
              {isLive ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {alerts.map((alert) => {
            const Icon = typeIcons[alert.type];
            const severity = severityConfig[alert.severity];
            
            return (
              <div
                key={alert.id}
                className="group bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/20 hover:scale-105 hover:-translate-y-2 overflow-hidden"
              >
                {/* Bold gradient accent */}
                <div className={clsx(
                  'h-2 bg-gradient-to-r',
                  alert.severity === 'critical' ? 'from-red-500 to-pink-500' :
                  alert.severity === 'high' ? 'from-orange-500 to-yellow-500' :
                  alert.severity === 'medium' ? 'from-yellow-500 to-amber-500' :
                  'from-blue-500 to-cyan-500'
                )} />
                
                <div className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className={clsx(
                      'p-4 rounded-2xl flex-shrink-0 shadow-lg',
                      severity.color
                    )}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                          {alert.title}
                        </h3>
                        <div className="flex items-center text-gray-500 ml-4">
                          <Clock className="h-5 w-5 mr-2" />
                          <span className="font-bold">{alert.time}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                        <span className="font-bold text-lg">{alert.location}</span>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed text-lg font-medium mb-6">
                        {alert.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className={clsx(
                          'px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg',
                          alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                          alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        )}>
                          {alert.severity} Priority
                        </span>
                        
                        <button className="font-bold text-blue-600 hover:text-cyan-600 transition-colors group-hover:translate-x-2 transform duration-300 text-lg">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105">
            📊 View All Alerts
          </button>
        </div>
      </div>
    </section>
  );
}
