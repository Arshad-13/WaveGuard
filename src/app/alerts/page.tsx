'use client';

import { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Waves, 
  Wind, 
  CheckCircle,
  Filter,
  Search,
  MapPin,
  Clock,
  ChevronDown,
  Zap,
  Activity,
  TrendingUp,
  Settings,
  Download,
  RefreshCw,
  Eye,
  Calendar
} from 'lucide-react';
import { clsx } from 'clsx';

interface Alert {
  id: string;
  type: 'tsunami' | 'cyclone' | 'warning' | 'all-clear' | 'storm-surge' | 'flood';
  title: string;
  description: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  status: 'active' | 'resolved' | 'monitoring';
  affectedAreas: string[];
  estimatedImpact: string;
  recommendedActions: string[];
  source: string;
  confidence: number;
}

// Initial empty alerts - will be populated from API/database
const mockAlerts: Alert[] = [];

const typeConfig = {
  tsunami: {
    icon: Waves,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    bgDark: 'bg-blue-50',
    label: 'Tsunami'
  },
  cyclone: {
    icon: Wind,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
    bgDark: 'bg-purple-50',
    label: 'Cyclone'
  },
  'storm-surge': {
    icon: TrendingUp,
    color: 'text-cyan-600',
    bg: 'bg-cyan-100',
    bgDark: 'bg-cyan-50',
    label: 'Storm Surge'
  },
  flood: {
    icon: Activity,
    color: 'text-indigo-600',
    bg: 'bg-indigo-100',
    bgDark: 'bg-indigo-50',
    label: 'Flood'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    bgDark: 'bg-yellow-50',
    label: 'Warning'
  },
  'all-clear': {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-100',
    bgDark: 'bg-green-50',
    label: 'All Clear'
  }
};

const severityConfig = {
  low: { 
    bg: 'bg-green-100 text-green-800',
    border: 'border-green-200',
    label: 'Low'
  },
  medium: { 
    bg: 'bg-yellow-100 text-yellow-800',
    border: 'border-yellow-200',
    label: 'Medium'
  },
  high: { 
    bg: 'bg-orange-100 text-orange-800',
    border: 'border-orange-200',
    label: 'High'
  },
  critical: { 
    bg: 'bg-red-100 text-red-800',
    border: 'border-red-200',
    label: 'Critical'
  }
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

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>(mockAlerts);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter alerts based on search and filters
  useEffect(() => {
    let filtered = alerts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(alert => alert.status === statusFilter);
    }

    // Severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(alert => alert.severity === severityFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(alert => alert.type === typeFilter);
    }

    setFilteredAlerts(filtered);
  }, [alerts, searchTerm, statusFilter, severityFilter, typeFilter]);

  const getAlertStats = () => {
    const active = alerts.filter(a => a.status === 'active').length;
    const monitoring = alerts.filter(a => a.status === 'monitoring').length;
    const resolved = alerts.filter(a => a.status === 'resolved').length;
    const critical = alerts.filter(a => a.severity === 'critical').length;
    
    return { active, monitoring, resolved, critical };
  };

  const stats = getAlertStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Bell className="w-8 h-8 mr-3 text-ocean-600" />
                Alert Center
              </h1>
              <p className="text-gray-600 mt-2">
                Monitor and manage coastal threat alerts in real-time
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="flex items-center px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
              <button className="flex items-center px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                  <p className="text-2xl font-bold text-red-600">{stats.active}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monitoring</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.monitoring}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Eye className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical</p>
                  <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search alerts..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="monitoring">Monitoring</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
              >
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
              >
                <option value="all">All Types</option>
                <option value="tsunami">Tsunami</option>
                <option value="cyclone">Cyclone</option>
                <option value="storm-surge">Storm Surge</option>
                <option value="flood">Flood</option>
                <option value="warning">Warning</option>
                <option value="all-clear">All Clear</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </div>
        </div>

        {/* Alerts List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAlerts.map((alert) => {
            const TypeIcon = typeConfig[alert.type].icon;
            
            return (
              <div
                key={alert.id}
                className={clsx(
                  'bg-white/90 backdrop-blur-sm rounded-xl border-l-4 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]',
                  alert.severity === 'critical' ? 'border-l-red-500' :
                  alert.severity === 'high' ? 'border-l-orange-500' :
                  alert.severity === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
                )}
                onClick={() => setSelectedAlert(alert)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={clsx(
                      'p-2 rounded-lg',
                      typeConfig[alert.type].bg
                    )}>
                      <TypeIcon className={clsx(
                        'w-5 h-5',
                        typeConfig[alert.type].color
                      )} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {alert.title}
                      </h3>
                      <div className="flex items-center mt-1">
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
                  </div>
                  
                  <div className={clsx(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    severityConfig[alert.severity].bg
                  )}>
                    {severityConfig[alert.severity].label}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  {alert.location}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {alert.description}
                </p>

                {/* Affected Areas */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-600 mb-2">Affected Areas:</p>
                  <div className="flex flex-wrap gap-1">
                    {alert.affectedAreas.slice(0, 3).map((area) => (
                      <span 
                        key={area}
                        className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
                      >
                        {area}
                      </span>
                    ))}
                    {alert.affectedAreas.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                        +{alert.affectedAreas.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {alert.timestamp}
                  </div>
                  <div className="flex items-center">
                    Confidence: {alert.confidence}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {searchTerm || statusFilter !== 'all' || severityFilter !== 'all' || typeFilter !== 'all'
                ? 'No alerts match your filters'
                : 'All Clear - No Active Alerts'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' || severityFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your search criteria or filters to see more results.'
                : 'The coastal monitoring systems are operating normally. No threats detected at this time.'}
            </p>
            {(searchTerm || statusFilter !== 'all' || severityFilter !== 'all' || typeFilter !== 'all') && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setSeverityFilter('all');
                  setTypeFilter('all');
                }}
                className="px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
            {!(searchTerm || statusFilter !== 'all' || severityFilter !== 'all' || typeFilter !== 'all') && (
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Tsunami Sensors: Active</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Weather Monitoring: Online</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>AI Analysis: Running</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={clsx(
                    'p-3 rounded-lg',
                    typeConfig[selectedAlert.type].bg
                  )}>
                    {(() => {
                      const TypeIcon = typeConfig[selectedAlert.type].icon;
                      return <TypeIcon className={clsx(
                        'w-6 h-6',
                        typeConfig[selectedAlert.type].color
                      )} />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedAlert.title}
                    </h2>
                    <div className="flex items-center mt-2">
                      <div className={clsx(
                        'w-3 h-3 rounded-full mr-2',
                        statusConfig[selectedAlert.status].dot
                      )} />
                      <span className={clsx(
                        'text-sm font-medium mr-4',
                        statusConfig[selectedAlert.status].color
                      )}>
                        {statusConfig[selectedAlert.status].label}
                      </span>
                      <span className={clsx(
                        'px-3 py-1 rounded-full text-sm font-medium',
                        severityConfig[selectedAlert.severity].bg
                      )}>
                        {severityConfig[selectedAlert.severity].label} Severity
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedAlert.description}</p>
                </div>

                {/* Location and Impact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {selectedAlert.location}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Estimated Impact</h3>
                    <p className="text-gray-700">{selectedAlert.estimatedImpact}</p>
                  </div>
                </div>

                {/* Affected Areas */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Affected Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAlert.affectedAreas.map((area) => (
                      <span 
                        key={area}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-lg"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Actions */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Recommended Actions</h3>
                  <ul className="space-y-2">
                    {selectedAlert.recommendedActions.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Meta Information */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Source:</span>
                    <span className="font-medium text-gray-900">{selectedAlert.source}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Confidence Level:</span>
                    <span className="font-medium text-gray-900">{selectedAlert.confidence}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium text-gray-900">{selectedAlert.timestamp}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-ocean-600 text-white hover:bg-ocean-700 rounded-lg transition-colors">
                  Share Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
