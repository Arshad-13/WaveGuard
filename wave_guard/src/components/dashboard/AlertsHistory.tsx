import { Clock, Waves, Wind, AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import { clsx } from 'clsx';

interface Alert {
  id: string;
  type: 'tsunami' | 'cyclone' | 'warning' | 'all-clear';
  title: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  status: 'active' | 'resolved' | 'monitoring';
}

const mockAlerts: Alert[] = [];

const typeConfig = {
  tsunami: {
    icon: Waves,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  cyclone: {
    icon: Wind,
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100'
  },
  'all-clear': {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-100'
  }
};

const severityConfig = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800'
};

const statusConfig = {
  active: {
    color: 'text-red-600',
    bg: 'bg-red-100',
    label: 'Active',
    dot: 'bg-red-500 animate-pulse'
  },
  monitoring: {
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    label: 'Monitoring',
    dot: 'bg-yellow-500'
  },
  resolved: {
    color: 'text-green-600',
    bg: 'bg-green-100',
    label: 'Resolved',
    dot: 'bg-green-500'
  }
};

export function AlertsHistory() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Alerts History
        </h3>
        <button className="text-ocean-600 hover:text-ocean-700 text-sm font-medium">
          View All →
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto flex-1">
        {mockAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <AlertTriangle className="w-12 h-12 mb-3 text-gray-300" />
            <p className="text-sm font-medium">No alerts at this time</p>
            <p className="text-xs text-gray-400 mt-1">All systems monitoring normally</p>
          </div>
        ) : (
          mockAlerts.map((alert) => {
            const TypeIcon = typeConfig[alert.type].icon;
            
            return (
              <div
                key={alert.id}
                className="p-3 rounded-lg border border-gray-200/50 hover:bg-gray-50/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className={clsx(
                    'p-2 rounded-lg flex-shrink-0',
                    typeConfig[alert.type].bg
                  )}>
                    <TypeIcon className={clsx(
                      'w-4 h-4',
                      typeConfig[alert.type].color
                    )} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-gray-900 text-sm truncate">
                        {alert.title}
                      </h4>
                      <div className="flex items-center ml-2">
                        <div className={clsx(
                          'w-2 h-2 rounded-full mr-2',
                          statusConfig[alert.status].dot
                        )} />
                        <span className={clsx(
                          'text-xs font-medium',
                          statusConfig[alert.status].color
                        )}>
                          {statusConfig[alert.status].label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{alert.location}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={clsx(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          severityConfig[alert.severity]
                        )}>
                          {alert.severity}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {alert.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200/50 flex-shrink-0">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-red-600">0</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <div>
            <p className="text-lg font-bold text-yellow-600">0</p>
            <p className="text-xs text-gray-500">Monitoring</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-600">0</p>
            <p className="text-xs text-gray-500">Resolved</p>
          </div>
        </div>
      </div>
    </div>
  );
}
