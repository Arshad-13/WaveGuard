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
    <section className="py-24 px-6 sm:px-8 lg:px-12 bg-gray-50 dark:bg-dark">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Real-time Alert Feed
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Live monitoring of coastal threats and system status
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={clsx(
              'flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium',
              isLive 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
            )}>
              <div className={clsx(
                'w-2 h-2 rounded-full',
                isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              )} />
              <span>{isLive ? 'LIVE' : 'PAUSED'}</span>
            </div>
            
            <button
              onClick={() => setIsLive(!isLive)}
              className="px-4 py-2 text-sm bg-white dark:bg-dark-3 border border-gray-200 dark:border-dark-4 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-4 transition-colors"
            >
              {isLive ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {alerts.map((alert) => {
            const Icon = typeIcons[alert.type];
            const severity = severityConfig[alert.severity];
            
            return (
              <div
                key={alert.id}
                className={clsx(
                  'p-8 rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-dark-3',
                  severity.borderColor
                )}
              >
                <div className="flex items-start space-x-4">
                  <div className={clsx(
                    'p-2 rounded-lg flex-shrink-0',
                    severity.color
                  )}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={clsx(
                        'font-semibold text-lg',
                        severity.textColor
                      )}>
                        {alert.title}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center ml-4">
                        <Clock className="h-4 w-4 mr-1" />
                        {alert.time}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {alert.location}
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {alert.description}
                    </p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className={clsx(
                        'px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide',
                        severity.textColor,
                        'bg-white/50 dark:bg-black/20'
                      )}>
                        {alert.severity} Priority
                      </span>
                      
                      <button className="text-sm text-ocean-600 hover:text-ocean-700 dark:text-ocean-400 dark:hover:text-ocean-300 font-medium">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button className="bg-white dark:bg-dark-3 border border-gray-200 dark:border-dark-4 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-4 transition-colors font-medium">
            View All Alerts
          </button>
        </div>
      </div>
    </section>
  );
}
