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

const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    type: 'tsunami',
    title: 'Tsunami Warning',
    location: 'Pacific Coast',
    severity: 'high',
    timestamp: '30 mins ago',
    status: 'active'
  },
  {
    id: 'ALT-002',
    type: 'cyclone',
    title: 'Tropical Storm Watch',
    location: 'Gulf Coast',
    severity: 'medium',
    timestamp: '2 hours ago',
    status: 'monitoring'
  },
  {
    id: 'ALT-003',
    type: 'all-clear',
    title: 'Hurricane All Clear',
    location: 'Florida Keys',
    severity: 'low',
    timestamp: '4 hours ago',
    status: 'resolved'
  },
  {
    id: 'ALT-004',
    type: 'warning',
    title: 'High Tide Alert',
    location: 'Boston Harbor',
    severity: 'low',
    timestamp: '6 hours ago',
    status: 'resolved'
  },
  {
    id: 'ALT-005',
    type: 'cyclone',
    title: 'Category 2 Hurricane',
    location: 'Louisiana Coast',
    severity: 'critical',
    timestamp: '8 hours ago',
    status: 'monitoring'
  }
];

const typeConfig = {
  tsunami: {
    icon: Waves,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30'
  },
  cyclone: {
    icon: Wind,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/30'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30'
  },
  'all-clear': {
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/30'
  }
};

const severityConfig = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
};

const statusConfig = {
  active: {
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
    label: 'Active',
    dot: 'bg-red-500 animate-pulse'
  },
  monitoring: {
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    label: 'Monitoring',
    dot: 'bg-yellow-500'
  },
  resolved: {
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/30',
    label: 'Resolved',
    dot: 'bg-green-500'
  }
};

export function AlertsHistory() {
  return (
    <div className="bg-white/70 dark:bg-dark-2/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-dark-3/50 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Alerts History
        </h3>
        <button className="text-ocean-600 hover:text-ocean-700 dark:text-ocean-400 dark:hover:text-ocean-300 text-sm font-medium">
          View All →
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-64">
        {mockAlerts.map((alert) => {
          const TypeIcon = typeConfig[alert.type].icon;
          
          return (
            <div
              key={alert.id}
              className="p-3 rounded-lg border border-gray-200/50 dark:border-dark-4/50 hover:bg-gray-50/50 dark:hover:bg-dark-3/50 transition-colors cursor-pointer"
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
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
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

                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
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
                    <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {alert.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-dark-3/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">2</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
          </div>
          <div>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">3</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Monitoring</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">42</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Resolved</p>
          </div>
        </div>
      </div>
    </div>
  );
}
