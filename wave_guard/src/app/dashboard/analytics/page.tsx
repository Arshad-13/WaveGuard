'use client';

import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, Shield, Waves, Eye } from 'lucide-react';
import Link from 'next/link';
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
  Cell,
  AreaChart,
  Area
} from 'recharts';

const monthlyData = [
  { month: 'Jan', threats: 15, resolved: 12, active: 3 },
  { month: 'Feb', threats: 22, resolved: 18, active: 4 },
  { month: 'Mar', threats: 28, resolved: 24, active: 4 },
  { month: 'Apr', threats: 19, resolved: 16, active: 3 },
  { month: 'May', threats: 34, resolved: 29, active: 5 },
  { month: 'Jun', threats: 41, resolved: 35, active: 6 }
];

const threatTypeData = [
  { name: 'Tsunami', value: 35, color: '#0891b2', incidents: 42 },
  { name: 'Cyclone', value: 28, color: '#7c3aed', incidents: 33 },
  { name: 'Coastal Erosion', value: 20, color: '#f59e0b', incidents: 24 },
  { name: 'Pollution', value: 17, color: '#ef4444', incidents: 20 }
];

const responseTimeData = [
  { time: '00-04h', avgResponse: 2.3 },
  { time: '04-08h', avgResponse: 1.8 },
  { time: '08-12h', avgResponse: 1.2 },
  { time: '12-16h', avgResponse: 0.9 },
  { time: '16-20h', avgResponse: 1.4 },
  { time: '20-24h', avgResponse: 2.1 }
];

const regionalData = [
  { region: 'Pacific Coast', threats: 45, severity: 'High', color: 'bg-red-500' },
  { region: 'Gulf Coast', threats: 38, severity: 'Medium', color: 'bg-yellow-500' },
  { region: 'Atlantic Coast', threats: 32, severity: 'Medium', color: 'bg-yellow-500' },
  { region: 'Great Lakes', threats: 18, severity: 'Low', color: 'bg-green-500' }
];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-sky-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-ocean-600 hover:text-ocean-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-ocean-600 to-cyan-600 bg-clip-text text-transparent mb-3">
              📊 Coastal Analytics Center
            </h1>
            <p className="text-lg text-ocean-600 font-medium">
              Advanced insights and trends for coastal threat management
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center text-green-600">
                <TrendingDown className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">-12%</span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">187</p>
              <p className="text-sm text-gray-600">Total Threats (6 months)</p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+8%</span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">89.3%</p>
              <p className="text-sm text-gray-600">Resolution Rate</p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Waves className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+15%</span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">1.4s</p>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex items-center text-red-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">+23%</span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">21</p>
              <p className="text-sm text-gray-600">Active Monitoring</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Trends */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Monthly Threat Trends
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="threats" 
                    stackId="1"
                    stroke="#0891b2" 
                    fill="#0891b2" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="resolved" 
                    stackId="2"
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Threat Distribution */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Threat Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={threatTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {threatTypeData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {threatTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.incidents}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional Analysis and Response Times */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Regional Analysis */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Regional Threat Analysis
            </h3>
            <div className="space-y-4">
              {regionalData.map((region, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${region.color}`} />
                    <div>
                      <h4 className="font-semibold text-gray-900">{region.region}</h4>
                      <p className="text-sm text-gray-600">Severity: {region.severity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{region.threats}</p>
                    <p className="text-sm text-gray-600">threats</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Times */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Response Time Analysis
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="avgResponse" 
                    fill="#7c3aed" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Average response time across different time periods
              </p>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-gradient-to-r from-ocean-500 to-cyan-500 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-4">📋 Recommended Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">🎯 Focus on Pacific Coast</h4>
              <p className="text-sm text-ocean-100">
                Highest threat concentration requires immediate attention and resource allocation.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">⚡ Improve Response Times</h4>
              <p className="text-sm text-ocean-100">
                Late-night response times show room for improvement. Consider 24/7 monitoring.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold mb-2">📈 Scaling Success</h4>
              <p className="text-sm text-ocean-100">
                89% resolution rate is excellent. Apply successful strategies to other regions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
