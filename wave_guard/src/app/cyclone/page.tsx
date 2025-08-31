'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { CycloneAssessment } from '@/types/models';
import CycloneAssessmentDisplay from '@/components/CycloneAssessmentDisplay';

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

// Dynamically import map components to avoid SSR issues
const CycloneRiskMap = dynamic(() => import('@/components/CycloneRiskMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">Loading map...</div>
});

export default function CyclonePage() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<CycloneAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocationSelect = (location: LocationData) => {
    console.log('🎯 [CyclonePage] Location selected:', {
      ...location,
      timestamp: new Date().toISOString(),
      source: 'CycloneRiskMap component'
    });
    setSelectedLocation(location);
    setError(null);
  };

  const handleRiskAssessment = (assessment: CycloneAssessment | null) => {
    setRiskAssessment(assessment);
    setLoading(false);
    if (!assessment) {
      setError('Failed to assess cyclone risk');
    }
  };

  // Preset locations for quick testing (cyclone-prone areas)
  const presetLocations = [
    { name: 'Mumbai, India', lat: 19.0760, lng: 72.8777 },
    { name: 'Dhaka, Bangladesh', lat: 23.8103, lng: 90.4125 },
    { name: 'Miami, USA', lat: 25.7617, lng: -80.1918 },
    { name: 'Manila, Philippines', lat: 14.5995, lng: 120.9842 },
    { name: 'Cairns, Australia', lat: -16.9186, lng: 145.7781 },
    { name: 'New Orleans, USA', lat: 29.9511, lng: -90.0715 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌪️ WaveGuard Real-Time Cyclone Risk Assessment
          </h1>
          <p className="text-lg text-gray-600">
            Click anywhere on the map to get real-time cyclone risk assessment based on current weather conditions
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
                  Weather Data Source:
                </label>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">🌤️</span>
                    <div>
                      <div className="font-medium text-blue-800">OpenWeatherMap API</div>
                      <div className="text-sm text-blue-600">Live atmospheric pressure and wind speed data</div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  The system fetches real-time weather data including atmospheric pressure and wind speed, 
                  then uses machine learning to predict cyclone formation risk.
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
                      🌪️ {preset.name}
                    </button>
                  ))}
                </div>
              </div>
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
                🗺️ Interactive Cyclone Risk Map
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Click anywhere to assess cyclone risk • Weather data from OpenWeatherMap
              </p>
            </div>
            <div className="p-4">
              <div className="h-[600px]">
                <CycloneRiskMap
                  selectedLocation={selectedLocation}
                  onLocationSelect={handleLocationSelect}
                  onRiskAssessment={handleRiskAssessment}
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
                🌪️ Risk Assessment
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Live analysis based on current weather conditions
              </p>
            </div>
            <div className="p-4 max-h-[600px] overflow-y-auto">
              <CycloneAssessmentDisplay
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
            ⚙️ How Cyclone Risk Assessment Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🌤️</div>
              <h3 className="font-bold text-gray-700 mb-2">1. Live Weather Data</h3>
              <p className="text-sm text-gray-600">
                Fetches real-time atmospheric pressure and wind speed data from OpenWeatherMap API for the selected location.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-bold text-gray-700 mb-2">2. ML Prediction</h3>
              <p className="text-sm text-gray-600">
                Your trained cyclone prediction model analyzes pressure and wind patterns to determine formation risk.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-2">📏</div>
              <h3 className="font-bold text-gray-700 mb-2">3. Risk Classification</h3>
              <p className="text-sm text-gray-600">
                Provides risk level and predicted wind speed with actionable safety recommendations.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <div className="p-3 bg-purple-50 rounded border border-purple-200">
              <div className="font-bold text-purple-800">🌪️ Extreme Risk</div>
              <div className="text-purple-700">Hurricane/Typhoon conditions likely</div>
            </div>
            <div className="p-3 bg-red-50 rounded border border-red-200">
              <div className="font-bold text-red-800">🚨 High Risk</div>
              <div className="text-red-700">Severe tropical storm expected</div>
            </div>
            <div className="p-3 bg-orange-50 rounded border border-orange-200">
              <div className="font-bold text-orange-800">⚠️ Moderate Risk</div>
              <div className="text-orange-700">Tropical storm conditions</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
              <div className="font-bold text-yellow-800">📋 Low Risk</div>
              <div className="text-yellow-700">Unstable weather patterns</div>
            </div>
            <div className="p-3 bg-green-50 rounded border border-green-200">
              <div className="font-bold text-green-800">✅ No Risk</div>
              <div className="text-green-700">Stable atmospheric conditions</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-lg font-semibold mb-2">Real-Time Weather Data</h3>
            <p className="text-gray-600">Live atmospheric pressure and wind speed updates from OpenWeatherMap&apos;s global network.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">ML-Powered Prediction</h3>
            <p className="text-gray-600">Advanced machine learning model trained on historical cyclone formation patterns.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-lg font-semibold mb-2">Actionable Alerts</h3>
            <p className="text-gray-600">Clear risk levels with specific safety recommendations and monitoring guidance.</p>
          </div>
        </div>

        {/* API Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-3">🔌 Technical Implementation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-700">Main Endpoint:</div>
              <code className="bg-gray-200 px-2 py-1 rounded">POST /assess/cyclone-risk</code>
              <div className="text-gray-600 mt-1">Comprehensive cyclone risk assessment with live weather data</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Data Source:</div>
              <code className="bg-gray-200 px-2 py-1 rounded">OpenWeatherMap Current Weather API</code>
              <div className="text-gray-600 mt-1">Real-time atmospheric pressure and wind speed data</div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-white rounded border">
            <h4 className="font-medium text-gray-800 mb-2">Key Weather Parameters:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>Atmospheric Pressure:</strong> Critical indicator for cyclone formation (low pressure systems)</li>
              <li><strong>Wind Speed:</strong> Current wind conditions and patterns affecting development</li>
              <li><strong>Additional Factors:</strong> Temperature, humidity, and visibility for comprehensive analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
