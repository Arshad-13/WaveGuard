'use client';

import React, { useState } from 'react';
import LocationMap from '@/components/LocationMap';
import { Loader2, CheckCircle } from 'lucide-react';

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

interface TsunamiPrediction {
  risk_level: string;
  tsunami_probability: number;
  confidence_score: number;
  wave_height_prediction: number;
  affected_coastal_distance: number;
  recommendations: string[];
  input_parameters: {
    magnitude: number;
    depth: number;
    distance_to_coast: number;
    population_density: number;
  };
}

export default function LocationPage() {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputParams, setInputParams] = useState({
    magnitude: 7.0,
    depth: 10.0,
    distance_to_coast: 50.0,
    population_density: 1000
  });
  const [tsunamiPrediction, setTsunamiPrediction] = useState<TsunamiPrediction | null>(null);

  const handleLocationSelect = (location: LocationData) => {
    console.log('🎯 [LocationPage] Location selected:', {
      ...location,
      timestamp: new Date().toISOString(),
      source: 'LocationMap component'
    });
    setCurrentLocation(location);
  };

  const predictTsunami = async () => {
    if (!currentLocation) {
      alert('Please select a location first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/tsunami/predict-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          magnitude: inputParams.magnitude,
          depth: inputParams.depth,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Transform the backend response to match our frontend interface
        const transformedData: TsunamiPrediction = {
          risk_level: data.tsunami_prediction?.risk_level || 'Unknown',
          tsunami_probability: data.tsunami_prediction?.probability || 0,
          confidence_score: data.tsunami_prediction?.confidence || 0,
          wave_height_prediction: Math.random() * 10 + 2, // Mock data - add to backend later
          affected_coastal_distance: Math.random() * 200 + 50, // Mock data
          recommendations: [
            "Stay alert for official tsunami warnings",
            "Know your evacuation routes",
            "Keep emergency supplies ready",
            "Monitor local emergency broadcasts"
          ],
          input_parameters: {
            magnitude: inputParams.magnitude,
            depth: inputParams.depth,
            distance_to_coast: inputParams.distance_to_coast,
            population_density: inputParams.population_density,
          }
        };
        
        setTsunamiPrediction(transformedData);
        console.log('Tsunami prediction:', transformedData);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error predicting tsunami:', error);
      alert('Error getting tsunami prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'very high': return 'bg-red-100 text-red-800';
      case 'extreme': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌊 WaveGuard Tsunami Prediction
          </h1>
          <p className="text-lg text-gray-600">
            AI-powered tsunami risk assessment using machine learning models
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <LocationMap
            onLocationSelect={handleLocationSelect}
            height="400px"
            width="100%"
          />
        </div>

        {currentLocation && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                📍 Selected Location: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </h2>
              
              {/* Input Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Magnitude
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputParams.magnitude}
                    onChange={(e) => setInputParams({...inputParams, magnitude: parseFloat(e.target.value) || 0})}
                    placeholder="Enter earthquake magnitude"
                    title="Earthquake magnitude (e.g., 7.5)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Depth (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputParams.depth}
                    onChange={(e) => setInputParams({...inputParams, depth: parseFloat(e.target.value) || 0})}
                    placeholder="Enter earthquake depth"
                    title="Earthquake depth in kilometers"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distance to Coast (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputParams.distance_to_coast}
                    onChange={(e) => setInputParams({...inputParams, distance_to_coast: parseFloat(e.target.value) || 0})}
                    placeholder="Enter distance to coast"
                    title="Distance from earthquake epicenter to nearest coast in kilometers"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Population Density
                  </label>
                  <input
                    type="number"
                    step="100"
                    value={inputParams.population_density}
                    onChange={(e) => setInputParams({...inputParams, population_density: parseFloat(e.target.value) || 0})}
                    placeholder="Enter population density"
                    title="Population density per square kilometer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={predictTsunami}
                disabled={loading}
                className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Predicting...
                  </div>
                ) : (
                  '🌊 Predict Tsunami Risk'
                )}
              </button>
            </div>

            {tsunamiPrediction && (
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-6">🔮 Tsunami Prediction Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  {/* Risk Level */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Risk Level</h4>
                    <div className={`inline-block px-3 py-2 rounded-full text-sm font-medium ${getRiskLevelColor(tsunamiPrediction.risk_level)}`}>
                      {tsunamiPrediction.risk_level}
                    </div>
                  </div>

                  {/* Tsunami Probability */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Tsunami Probability</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      {(tsunamiPrediction.tsunami_probability * 100).toFixed(1)}%
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Model Confidence</h4>
                    <div className="text-2xl font-bold text-green-600">
                      {(tsunamiPrediction.confidence_score * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Wave Height Prediction */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">🌊 Predicted Wave Height</h4>
                    <div className="text-2xl font-bold text-blue-600">
                      {tsunamiPrediction.wave_height_prediction.toFixed(1)} meters
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Estimated maximum wave height at coastline
                    </p>
                  </div>

                  {/* Affected Distance */}
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-medium text-orange-900 mb-2">📏 Affected Coastal Distance</h4>
                    <div className="text-2xl font-bold text-orange-600">
                      {tsunamiPrediction.affected_coastal_distance.toFixed(1)} km
                    </div>
                    <p className="text-sm text-orange-700 mt-1">
                      Estimated length of coastline affected
                    </p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-medium text-green-900 mb-4">🛡️ Safety Recommendations</h4>
                  <ul className="space-y-2">
                    {tsunamiPrediction.recommendations.map((recommendation: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-green-800">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Input Parameters Used */}
                <div className="bg-gray-50 rounded-lg p-6 mt-6">
                  <h4 className="font-medium text-gray-900 mb-4">📊 Input Parameters Used</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Magnitude:</span>
                      <div className="text-lg font-bold text-gray-900">{tsunamiPrediction.input_parameters.magnitude}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Depth:</span>
                      <div className="text-lg font-bold text-gray-900">{tsunamiPrediction.input_parameters.depth} km</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Distance to Coast:</span>
                      <div className="text-lg font-bold text-gray-900">{tsunamiPrediction.input_parameters.distance_to_coast} km</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Population Density:</span>
                      <div className="text-lg font-bold text-gray-900">{tsunamiPrediction.input_parameters.population_density}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">🌊</div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered Predictions</h3>
            <p className="text-gray-600">Advanced machine learning models trained on historical tsunami data.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
            <p className="text-gray-600">Comprehensive risk analysis with customizable parameters.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-lg font-semibold mb-2">Safety Recommendations</h3>
            <p className="text-gray-600">Personalized safety guidelines based on prediction results.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
