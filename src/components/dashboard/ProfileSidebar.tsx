import { User, Shield, AlertTriangle, CheckCircle, MapPin, Award } from 'lucide-react';

const userData = {
  name: 'Dr. Sarah Chen',
  role: 'Marine Safety Coordinator',
  location: 'California Coast',
  avatar: '/images/user/user-01.png', // Using existing avatar
  joinDate: 'March 2023',
  stats: {
    reportsSubmitted: 47,
    alertsReceived: 234,
    verificationScore: 98,
    communityRank: 'Gold Member'
  }
};

export function ProfileSidebar() {
  return (
    <div className="bg-white/70 dark:bg-dark-2/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-dark-3/50 p-6 h-fit">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="relative inline-block mb-4">
          <img
            src={userData.avatar}
            alt={userData.name}
            className="w-20 h-20 rounded-full border-4 border-ocean-200 dark:border-ocean-800 object-cover"
          />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-dark-2 flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        </div>
        
        <h2 className="font-bold text-lg text-gray-900 dark:text-white">
          {userData.name}
        </h2>
        <p className="text-sm text-ocean-600 dark:text-ocean-400 mb-1">
          {userData.role}
        </p>
        <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
          <MapPin className="w-3 h-3 mr-1" />
          {userData.location}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="space-y-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {userData.stats.reportsSubmitted}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Reports Submitted</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {userData.stats.alertsReceived}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Alerts Received</p>
            </div>
            <Shield className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {userData.stats.verificationScore}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Verification Score</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Community Status */}
      <div className="border-t border-gray-200/50 dark:border-dark-3/50 pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Community Status
          </span>
          <Award className="w-4 h-4 text-yellow-500" />
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-3">
          <p className="font-semibold text-yellow-700 dark:text-yellow-400">
            {userData.stats.communityRank}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            Top contributor since {userData.joinDate}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 space-y-2">
        <button className="w-full bg-ocean-500 hover:bg-ocean-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
          Submit New Report
        </button>
        <button className="w-full border border-gray-200 dark:border-dark-4 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-4 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
          View Profile Settings
        </button>
      </div>

      {/* Last Activity */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        Last active: 2 minutes ago
      </div>
    </div>
  );
}
