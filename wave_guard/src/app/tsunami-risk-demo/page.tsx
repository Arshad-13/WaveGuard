'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { UserRiskAssessment } from '@/types/models';
import RiskAssessmentDisplay from '@/components/RiskAssessmentDisplay';

// Dynamically import map components to avoid SSR issues
const TsunamiRiskMap = dynamic(() => import('@/components/TsunamiRiskMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">Loading map...</div>
});

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

export default function TsunamiRiskDemoPage() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<UserRiskAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<'past_hour_m45' | 'past_day_m45' | 'past_hour_m25' | 'past_day_all' | 'past_week_m45' | 'past_month_m45'>('past_day_m45');

  const handleLocationSelect = (location: LocationData) => {
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

  // Preset locations for quick testing
  const presetLocations = [
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'San Francisco, USA', lat: 37.7749, lng: -122.4194 },
    { name: 'Manila, Philippines', lat: 14.5995, lng: 120.9842 },
    { name: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456 },
    { name: 'Valparaíso, Chile', lat: -33.0472, lng: -71.6127 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌊 Tsunami Risk Assessment Demo
          </h1>
          <p className="text-gray-600">
            Click anywhere on the map to get real-time tsunami risk assessment based on recent USGS earthquake data
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-md font-bold text-gray-800 mb-3">🔧 Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Feed type selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Earthquake Data Feed:
                </label>
                <select
                  value={feedType}
                  onChange={(e) => setFeedType(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="past_hour_m45">Past Hour - Magnitude 4.5+</option>
                  <option value="past_day_m45">Past Day - Magnitude 4.5+</option>
                  <option value="past_hour_m25">Past Hour - Magnitude 2.5+</option>
                  <option value="past_day_all">Past Day - All Earthquakes</option>
                  <option value="past_week_m45">Past Week - Magnitude 4.5+</option>
                  <option value="past_month_m45">Past Month - Magnitude 4.5+</option>
                </select>
              </div>

              {/* Preset locations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Test Locations:
                </label>
                <div className="flex flex-wrap gap-2">
                  {presetLocations.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleLocationSelect(preset)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Map */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              🗺️ Interactive Risk Assessment Map
            </h2>
            <div className="h-96">
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

          {/* Risk Assessment Display */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📊 Risk Assessment Results
            </h2>
            <RiskAssessmentDisplay
              assessment={riskAssessment}
              loading={loading}
              error={error}
            />
          </div>
        </div>

        {/* How it works */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            ⚙️ How This Demo Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-700 mb-2">🔄 Real-time Integration</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Fetches live earthquake data from USGS</li>
                <li>• Uses your trained tsunami prediction model</li>
                <li>• Calculates distance-based risk zones</li>
                <li>• Updates automatically when you click new locations</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-700 mb-2">🎯 Risk Assessment</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <span className="text-red-600">High Risk:</span> ≤100km with tsunami prediction</li>
                <li>• <span className="text-orange-600">Medium Risk:</span> ≤500km with moderate threat</li>
                <li>• <span className="text-yellow-600">Low Risk:</span> ≤1000km with low threat</li>
                <li>• <span className="text-green-600">No Risk:</span> Far from threats or no earthquakes</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 Testing Tip:</strong> Try the "Past Hour - Magnitude 4.5+" feed to see the "no earthquake" scenario, 
              or use "Past Day - All Earthquakes" to see more earthquake data and risk assessments.
            </p>
          </div>
        </div>

        {/* API Endpoints Info */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            🔌 API Integration
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-700 mb-2">Main Endpoint</h3>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                POST /assess/tsunami-risk
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Send latitude, longitude, and feed_type to get comprehensive risk assessment
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-700 mb-2">Raw USGS Data</h3>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                GET /earthquakes/{feed_type}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Get raw earthquake data from USGS feeds
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
