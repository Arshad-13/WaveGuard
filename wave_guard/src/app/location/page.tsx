'use client';

import React, { useState } from 'react';
import LocationMap from '@/components/LocationMap';

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

export default function LocationPage() {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [earthquakeData, setEarthquakeData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = (location: LocationData) => {
    console.log('🎯 [LocationPage] Location selected:', {
      ...location,
      timestamp: new Date().toISOString(),
      source: 'LocationMap component'
    });
    setCurrentLocation(location);
  };

  const fetchEarthquakeData = async () => {
    if (!currentLocation) {
      alert('Please select a location first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/earthquake-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          address: currentLocation.address,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEarthquakeData(data);
        console.log('Earthquake data:', data);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching earthquake data:', error);
      alert('Error fetching earthquake data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌍 Earthquake Location Selector
          </h1>
          <p className="text-lg text-gray-600">
            Select a location to monitor earthquake activity
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <LocationMap
            onLocationSelect={handleLocationSelect}
            height="600px"
            width="100%"
          />
        </div>


        {currentLocation && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  📍 Selected Location Details
                </h2>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-medium">Coordinates:</span> {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}</p>
                  {currentLocation.address && (
                    <p><span className="font-medium">Address:</span> {currentLocation.address}</p>
                  )}
                </div>
              </div>
              
              <button
                onClick={fetchEarthquakeData}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  '🔍 Get Earthquake Data'
                )}
              </button>
            </div>

            {earthquakeData && (
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  🌋 Earthquake Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-700 overflow-auto">
                    {JSON.stringify(earthquakeData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
            <p className="text-gray-600">Click anywhere on the map to select a location for earthquake monitoring.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-lg font-semibold mb-2">GPS Location</h3>
            <p className="text-gray-600">Use your current GPS location or search for any address worldwide.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🌪️</div>
            <h3 className="text-lg font-semibold mb-2">Real-time Data</h3>
            <p className="text-gray-600">Get live earthquake data from USGS for your selected location.</p>
          </div>
        </div>

        {/* API Integration Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🔌 API Integration
          </h3>
          <p className="text-blue-700">
            This page integrates with your Python backend deployed on Render. Make sure to update the 
            <code className="bg-blue-200 px-2 py-1 rounded mx-1">NEXT_PUBLIC_BACKEND_URL</code> 
            environment variable with your actual Render backend URL.
          </p>
        </div>
      </div>
    </div>
  );
}
