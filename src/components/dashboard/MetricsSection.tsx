'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Waves, Wind, AlertTriangle, Shield, TrendingUp, TrendingDown } from 'lucide-react';

const threatData = [
  { month: 'Jan', tsunami: 4, cyclone: 2, total: 6 },
  { month: 'Feb', tsunami: 2, cyclone: 8, total: 10 },
  { month: 'Mar', tsunami: 6, cyclone: 3, total: 9 },
  { month: 'Apr', tsunami: 1, cyclone: 12, total: 13 },
  { month: 'May', tsunami: 8, cyclone: 5, total: 13 },
  { month: 'Jun', tsunami: 3, cyclone: 15, total: 18 }
];

const alertsOverTime = [
  { time: '00:00', alerts: 12 },
  { time: '04:00', alerts: 8 },
  { time: '08:00', alerts: 25 },
  { time: '12:00', alerts: 35 },
  { time: '16:00', alerts: 28 },
  { time: '20:00', alerts: 18 }
];

const threatDistribution = [
  { name: 'Tsunami', value: 35, color: '#0891b2' },
  { name: 'Cyclone', value: 45, color: '#7c3aed' },
  { name: 'Coastal Erosion', value: 12, color: '#f59e0b' },
  { name: 'Pollution', value: 8, color: '#ef4444' }
];

const statsCards = [
  {
    title: 'Active Threats',
    value: '3',
    change: '-2',
    changeType: 'decrease',
    icon: AlertTriangle,
    color: 'red'
  },
  {
    title: 'System Health',
    value: '99.8%',
    change: '+0.2%',
    changeType: 'increase',
    icon: Shield,
    color: 'green'
  },
  {
    title: 'Alerts Today',
    value: '127',
    change: '+15',
    changeType: 'increase',
    icon: Waves,
    color: 'blue'
  },
  {
    title: 'Response Time',
    value: '2.3s',
    change: '-0.5s',
    changeType: 'decrease',
    icon: TrendingUp,
    color: 'purple'
  }
];

export function MetricsSection() {
  return (
    <div className="h-full space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          const TrendIcon = card.changeType === 'increase' ? TrendingUp : TrendingDown;
          
          return (
            <div
              key={index}
              className="bg-white/70 dark:bg-dark-2/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-dark-3/50 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-${card.color}-100 dark:bg-${card.color}-900/30`}>
                  <Icon className={`w-5 h-5 text-${card.color}-600 dark:text-${card.color}-400`} />
                </div>
                <div className={`flex items-center text-sm ${
                  card.changeType === 'increase' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  <TrendIcon className="w-3 h-3 mr-1" />
                  {card.change}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {card.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Threat Trends Chart */}
        <div className="lg:col-span-2 bg-white/70 dark:bg-dark-2/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-dark-3/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Threat Detection Trends
            </h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Tsunami</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded mr-2" />
                <span className="text-gray-600 dark:text-gray-300">Cyclone</span>
              </div>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={threatData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="tsunami" fill="#0891b2" radius={[2, 2, 0, 0]} />
                <Bar dataKey="cyclone" fill="#7c3aed" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Distribution */}
        <div className="bg-white/70 dark:bg-dark-2/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-dark-3/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Threat Distribution
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={80}
                  dataKey="value"
                  className="outline-none"
                >
                  {threatDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {threatDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded mr-2" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Timeline */}
        <div className="lg:col-span-3 bg-white/70 dark:bg-dark-2/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-dark-3/50 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            24-Hour Alert Activity
          </h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={alertsOverTime}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="time" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="alerts" 
                  stroke="#0891b2" 
                  strokeWidth={3}
                  dot={{ fill: '#0891b2', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#0891b2' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
