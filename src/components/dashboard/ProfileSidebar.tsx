'use client';

import { Shield, AlertTriangle, CheckCircle, MapPin, Award, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';
import Link from 'next/link';

export function ProfileSidebar() {
  const { user, userProfile, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 h-fit shadow-xl">
        <div className="text-center animate-pulse">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt when not authenticated
  if (!user || !userProfile) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 h-fit shadow-xl">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="font-bold text-lg text-gray-900 mb-2">
            Join WaveGuard
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Sign in to access your profile, reports, and coastal monitoring dashboard.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link
            href="/auth?mode=signin"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Link>
          <Link
            href="/auth?mode=signup"
            className="w-full border border-blue-200 text-blue-600 hover:bg-blue-50 py-3 px-4 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create Account
          </Link>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200/50">
          <div className="text-center text-xs text-gray-500">
            🌊 Protect coastal communities with AI-powered monitoring
          </div>
        </div>
      </div>
    );
  }

  // Show authenticated user profile
  const displayName = userProfile.first_name && userProfile.last_name 
    ? `${userProfile.first_name} ${userProfile.last_name}`
    : userProfile.first_name || userProfile.last_name || user.displayName || 'User';
  
  const avatarUrl = userProfile.avatar_url || user.photoURL || '/images/user/user-01.png';
  const joinDate = userProfile.created_at 
    ? new Date(userProfile.created_at.toString()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  // Mock stats for now - in a real app these would come from user activity data
  const mockStats = {
    reportsSubmitted: Math.floor(Math.random() * 50) + 10,
    alertsReceived: Math.floor(Math.random() * 200) + 50,
    verificationScore: Math.floor(Math.random() * 20) + 80,
    communityRank: userProfile.role === 'admin' ? 'Administrator' : 'Active Member'
  };
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 h-fit shadow-xl">
      {/* Profile Header */}
      <div className="text-center mb-6">
        <div className="relative inline-block mb-4">
          <Image
            src={avatarUrl}
            alt={displayName}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full border-4 border-blue-200 object-cover"
          />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        </div>
        
        <h2 className="font-bold text-lg text-gray-900">
          {displayName}
        </h2>
        <p className="text-sm text-blue-600 mb-1 capitalize">
          {userProfile.role || 'User'}
        </p>
        {userProfile.address && (
          <div className="flex items-center justify-center text-xs text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            {userProfile.address}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="space-y-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {mockStats.reportsSubmitted}
              </p>
              <p className="text-sm text-gray-600">Reports Submitted</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {mockStats.alertsReceived}
              </p>
              <p className="text-sm text-gray-600">Alerts Received</p>
            </div>
            <Shield className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {mockStats.verificationScore}%
              </p>
              <p className="text-sm text-gray-600">Verification Score</p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Community Status */}
      <div className="border-t border-gray-200/50 pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Community Status
          </span>
          <Award className="w-4 h-4 text-yellow-500" />
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3">
          <p className="font-semibold text-yellow-700">
            {mockStats.communityRank}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Member since {joinDate}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 space-y-2">
        <Link
          href="/report"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors block text-center"
        >
          Submit New Report
        </Link>
        <Link
          href="/settings"
          className="w-full border border-gray-200 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg text-sm font-medium transition-colors block text-center"
        >
          View Profile Settings
        </Link>
      </div>

      {/* Last Activity */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Welcome back, {userProfile.first_name || 'User'}!
      </div>
    </div>
  );
}
