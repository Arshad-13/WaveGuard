'use client';

import React from 'react';
import { CycloneAssessment } from '@/types/models';

interface CycloneAssessmentDisplayProps {
  assessment: CycloneAssessment | null;
  loading: boolean;
  error: string | null;
}

const getRiskColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'Extreme Risk':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'High Risk':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'Moderate Risk':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'Low Risk':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'No Risk':
    default:
      return 'text-green-600 bg-green-50 border-green-200';
  }
};

const getRiskIcon = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'Extreme Risk':
      return '🌪️';
    case 'High Risk':
      return '🚨';
    case 'Moderate Risk':
      return '⚠️';
    case 'Low Risk':
      return '📋';
    case 'No Risk':
    default:
      return '✅';
  }
};

const getWindSpeedCategory = (windSpeed: number): string => {
  if (windSpeed >= 74) return 'Hurricane Force (74+ m/s)';
  if (windSpeed >= 32.7) return 'Hurricane/Typhoon (32.7-73.9 m/s)';
  if (windSpeed >= 24.5) return 'Severe Tropical Storm (24.5-32.6 m/s)';
  if (windSpeed >= 17.2) return 'Tropical Storm (17.2-24.4 m/s)';
  if (windSpeed >= 10.8) return 'Strong Breeze (10.8-17.1 m/s)';
  return 'Normal Conditions (< 10.8 m/s)';
};

const CycloneAssessmentDisplay: React.FC<CycloneAssessmentDisplayProps> = ({
  assessment,
  loading,
  error
}) => {
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-gray-600">Analyzing cyclone risk...</div>
        <div className="text-sm text-gray-500 mt-1">Fetching weather data and running prediction model</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-red-600 text-xl mr-3">❌</div>
            <div>
              <div className="font-bold text-red-800">Assessment Failed</div>
              <div className="text-red-700 text-sm mt-1">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="text-4xl mb-3">🌪️</div>
        <div className="font-medium">No Assessment Available</div>
        <div className="text-sm mt-1">Click on the map to assess cyclone risk for a location</div>
      </div>
    );
  }

  const { weather_data, cyclone_prediction, recommendations, monitoring_advice } = assessment;
  const riskColorClass = getRiskColor(cyclone_prediction.risk_level);
  const riskIcon = getRiskIcon(cyclone_prediction.risk_level);

  return (
    <div className="space-y-6">
      {/* Main Risk Assessment */}
      <div className={`p-4 rounded-lg border ${riskColorClass}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{riskIcon}</span>
            <div>
              <div className="font-bold text-lg">
                {cyclone_prediction.prediction ? 'Cyclone Risk Detected' : 'No Cyclone Risk'}
              </div>
              <div className="text-sm opacity-80">
                Risk Level: {cyclone_prediction.risk_level}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80">Confidence</div>
            <div className="font-bold">{Math.round(cyclone_prediction.confidence * 100)}%</div>
          </div>
        </div>

        {cyclone_prediction.prediction && (
          <div className="mt-3 p-3 bg-white/50 rounded border">
            <div className="font-medium mb-2">🌬️ Predicted Wind Speed</div>
            <div className="text-lg font-bold">
              {cyclone_prediction.predicted_wind_speed.toFixed(1)} m/s
            </div>
            <div className="text-sm opacity-80">
              {getWindSpeedCategory(cyclone_prediction.predicted_wind_speed)}
            </div>
          </div>
        )}
      </div>

      {/* Weather Data */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">🌤️</span>
          Current Weather Conditions
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700">Atmospheric Pressure</div>
            <div className="text-lg font-bold text-blue-600">{weather_data.pressure} hPa</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Wind Speed</div>
            <div className="text-lg font-bold text-blue-600">{weather_data.wind_speed} m/s</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Wind Direction</div>
            <div className="text-lg font-bold text-blue-600">{weather_data.wind_direction}°</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Temperature</div>
            <div className="text-lg font-bold text-blue-600">{weather_data.temperature}°C</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Humidity</div>
            <div className="text-lg font-bold text-blue-600">{weather_data.humidity}%</div>
          </div>
          <div>
            <div className="font-medium text-gray-700">Visibility</div>
            <div className="text-lg font-bold text-blue-600">{weather_data.visibility} km</div>
          </div>
        </div>
      </div>

      {/* Risk Factors Analysis */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">🔍</span>
          Risk Factor Analysis
        </h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-gray-50 rounded">
            <div className="font-medium text-gray-700 mb-1">Pressure Factor</div>
            <div className="text-gray-600">{cyclone_prediction.risk_factors.pressure_factor}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="font-medium text-gray-700 mb-1">Wind Factor</div>
            <div className="text-gray-600">{cyclone_prediction.risk_factors.wind_factor}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded">
            <div className="font-medium text-gray-700 mb-1">Combined Assessment</div>
            <div className="text-gray-600">{cyclone_prediction.risk_factors.combined_assessment}</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">💡</span>
            Safety Recommendations
          </h3>
          <ul className="space-y-2 text-sm">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Monitoring Advice */}
      {monitoring_advice.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">📡</span>
            Monitoring Guidance
          </h3>
          <ul className="space-y-2 text-sm">
            {monitoring_advice.map((advice, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-orange-600 mt-1">•</span>
                <span className="text-gray-700">{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Data Source Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">📊</span>
          Assessment Details
        </h3>
        <div className="text-sm space-y-2">
          <div>
            <span className="font-medium text-gray-700">Data Source:</span>
            <span className="ml-2 text-gray-600">{assessment.data_source}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Assessment Time:</span>
            <span className="ml-2 text-gray-600">
              {new Date(assessment.timestamp).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Location:</span>
            <span className="ml-2 text-gray-600">
              {assessment.location.latitude.toFixed(4)}, {assessment.location.longitude.toFixed(4)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycloneAssessmentDisplay;
