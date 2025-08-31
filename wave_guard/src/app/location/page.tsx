'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { UserRiskAssessment } from '@/types/models';
import RiskAssessmentDisplay from '@/components/RiskAssessmentDisplay';

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

// Dynamically import map components to avoid SSR issues
const TsunamiRiskMap = dynamic(() => import('@/components/TsunamiRiskMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">Loading map...</div>
});

export default function LocationPage() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<UserRiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<'past_hour_m45' | 'past_day_m45' | 'past_hour_m25' | 'past_day_all' | 'past_week_m45' | 'past_month_m45'>('past_day_m45');

  const handleLocationSelect = (location: LocationData) => {
    console.log('🎯 [LocationPage] Location selected:', {
      ...location,
      timestamp: new Date().toISOString(),
      source: 'TsunamiRiskMap component'
    });
    setSelectedLocation(location);
    setError(null);
  };

  const handleRiskAssessment = (assessment: UserRiskAssessment | null) => {
    setRiskAssessment(assessment);
    setLoading(false);
    if (!assessment) {
      setError('Failed to assess tsunami risk');
    }
  };

  // Preset locations for quick testing (tsunami-prone areas)
  const presetLocations = [
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456 },
    { name: 'Lima, Peru', lat: -12.0464, lng: -77.0428 },
    { name: 'San Francisco, USA', lat: 37.7749, lng: -122.4194 },
    { name: 'Valparaíso, Chile', lat: -33.0472, lng: -71.6127 },
    { name: 'Banda Aceh, Indonesia', lat: 5.5483, lng: 95.3238 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌊 WaveGuard Real-Time Tsunami Risk Assessment
          </h1>
          <p className="text-lg text-gray-600">
            Click anywhere on the map to get real-time tsunami risk assessment based on live USGS earthquake data
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🔧 Assessment Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Information about the system */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Earthquake Data Source:
                </label>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">🌍</span>
                    <div>
                      <div className="font-medium text-blue-800">USGS Earthquake API</div>
                      <div className="text-sm text-blue-600">Live earthquake data from global seismic sensors</div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  The system fetches real-time earthquake data from USGS feeds, then uses machine learning 
                  to predict tsunami potential based on magnitude, depth, and location.
                </p>
              </div>

              {/* Preset locations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Test Locations:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {presetLocations.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleLocationSelect(preset)}
                      className="px-3 py-2 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors text-left"
                    >
                      🌊 {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Feed type selector */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Earthquake Data Feed:
              </label>
              <select
                value={feedType}
                onChange={(e) => setFeedType(e.target.value as 'past_hour_m45' | 'past_day_m45' | 'past_hour_m25' | 'past_day_all' | 'past_week_m45' | 'past_month_m45')}
                className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="past_hour_m45">🕐 Past Hour - Magnitude 4.5+</option>
                <option value="past_day_m45">📅 Past Day - Magnitude 4.5+</option>
                <option value="past_hour_m25">🕐 Past Hour - Magnitude 2.5+</option>
                <option value="past_day_all">📅 Past Day - All Earthquakes</option>
                <option value="past_week_m45">📊 Past Week - Magnitude 4.5+</option>
                <option value="past_month_m45">🗓️ Past Month - Magnitude 4.5+</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {feedType === 'past_hour_m45' && 'Often shows "no earthquakes" scenario for testing'}
                {feedType === 'past_day_all' && 'Shows the most earthquake data for comprehensive analysis'}
                {feedType === 'past_day_m45' && 'Balanced feed showing significant earthquakes'}
              </p>
            </div>

            {selectedLocation && (
              <div className="mt-4 p-3 bg-gray-50 rounded border">
                <div className="text-sm">
                  <strong>🎯 Current Location:</strong> {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                  {selectedLocation.address && <span> - {selectedLocation.address}</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Map - Takes up 2/3 of the space */}
          <div className="xl:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">
                🗺️ Interactive Tsunami Risk Map
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Click anywhere to assess tsunami risk • Real earthquakes shown as markers
              </p>
            </div>
            <div className="p-4">
              <div className="h-[600px]">
                <TsunamiRiskMap
                  selectedLocation={selectedLocation}
                  onLocationSelect={handleLocationSelect}
                  onRiskAssessment={handleRiskAssessment}
                  feedType={feedType}
                  height="100%"
                  autoAssess={true}
                />
              </div>
            </div>
          </div>

          {/* Risk Assessment Display - Takes up 1/3 of the space */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">
                📊 Risk Assessment
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Live analysis based on USGS earthquake data
              </p>
            </div>
            <div className="p-4 max-h-[600px] overflow-y-auto">
              <RiskAssessmentDisplay
                assessment={riskAssessment}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            ⚙️ How Real-Time Assessment Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🌍</div>
              <h3 className="font-bold text-gray-700 mb-2">1. Live USGS Data</h3>
              <p className="text-sm text-gray-600">
                Fetches real-time earthquake data from USGS feeds covering different time ranges and magnitudes.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-bold text-gray-700 mb-2">2. ML Prediction</h3>
              <p className="text-sm text-gray-600">
                Your trained tsunami prediction model analyzes each earthquake for tsunami potential.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">📏</div>
              <h3 className="font-bold text-gray-700 mb-2">3. Distance-Based Risk</h3>
              <p className="text-sm text-gray-600">
                Calculates your risk level based on distance from tsunami-generating earthquakes.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-red-50 rounded border border-red-200">
              <div className="font-bold text-red-800">🚨 High Risk</div>
              <div className="text-red-700">≤100km from tsunami earthquake</div>
            </div>
            <div className="p-3 bg-orange-50 rounded border border-orange-200">
              <div className="font-bold text-orange-800">⚠️ Medium Risk</div>
              <div className="text-orange-700">≤500km with moderate threat</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
              <div className="font-bold text-yellow-800">📋 Low Risk</div>
              <div className="text-yellow-700">≤1000km with low threat</div>
            </div>
            <div className="p-3 bg-green-50 rounded border border-green-200">
              <div className="font-bold text-green-800">✅ No Risk</div>
              <div className="text-green-700">Far from threats or no earthquakes</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-lg font-semibold mb-2">Real-Time Data</h3>
            <p className="text-gray-600">Live earthquake feeds updated automatically from USGS sensors worldwide.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Precision Assessment</h3>
            <p className="text-gray-600">Location-specific risk analysis based on actual distance from earthquake epicenters.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-lg font-semibold mb-2">Actionable Insights</h3>
            <p className="text-gray-600">Clear risk levels and specific recommendations based on current threat assessment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
