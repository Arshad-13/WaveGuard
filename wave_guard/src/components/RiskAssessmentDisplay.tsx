'use client';

import React from 'react';
import { UserRiskAssessment } from '@/types/models';

interface RiskAssessmentDisplayProps {
  assessment: UserRiskAssessment | null;
  loading?: boolean;
  error?: string | null;
}

const RiskAssessmentDisplay: React.FC<RiskAssessmentDisplayProps> = ({
  assessment,
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-blue-800">Assessing tsunami risk...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-red-800">
          <strong>⚠️ Error:</strong> {error}
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-gray-600">
          📍 Click on the map to assess tsunami risk for any location
        </div>
      </div>
    );
  }

  // Get alert styling based on risk level
  const getAlertStyling = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return {
          containerClass: 'bg-red-50 border-red-500',
          titleClass: 'text-red-800',
          icon: '🚨',
          label: 'High Risk'
        };
      case 'medium':
        return {
          containerClass: 'bg-orange-50 border-orange-500',
          titleClass: 'text-orange-800',
          icon: '⚠️',
          label: 'Medium Risk'
        };
      case 'low':
        return {
          containerClass: 'bg-yellow-50 border-yellow-500',
          titleClass: 'text-yellow-800',
          icon: '📋',
          label: 'Low Risk'
        };
      case 'no_risk':
      default:
        return {
          containerClass: 'bg-green-50 border-green-500',
          titleClass: 'text-green-800',
          icon: '✅',
          label: 'No Risk'
        };
    }
  };

  const styling = getAlertStyling(assessment.riskLevel);

  // Format timestamp
  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="space-y-4">
      {/* Main status card */}
      <div className={`p-4 border-2 rounded-lg ${styling.containerClass}`}>
        <div className={`text-lg font-bold ${styling.titleClass} mb-2`}>
          {styling.icon} {styling.label}
        </div>
        
        <div className="text-sm mb-3 text-gray-700">
          {assessment.description}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm">
              <strong>Data Source:</strong> {assessment.feed_info.source}
            </div>
            <div className="text-sm mt-1">
              <strong>Feed Type:</strong> {assessment.feed_info.feed_type.replace(/_/g, ' ').toUpperCase()}
            </div>
            {assessment.feed_info.total_earthquakes_in_feed && (
              <div className="text-sm mt-1">
                <strong>Total Earthquakes:</strong> {assessment.feed_info.total_earthquakes_in_feed}
              </div>
            )}
          </div>
          
          <div>
            <div className="text-sm">
              <strong>Last Updated:</strong> {formatTime(assessment.timestamp)}
            </div>
            <div className="text-sm mt-1">
              <strong>Feed Last Updated:</strong> {formatTime(assessment.feed_info.last_updated)}
            </div>
          </div>
        </div>

        {assessment.nearestEarthquake && (
          <div className="mt-3 text-sm">
            <strong>Nearest Earthquake:</strong> Magnitude {assessment.nearestEarthquake.magnitude} - {assessment.nearestEarthquake.distance}km away<br />
            <span className="text-gray-600">{assessment.nearestEarthquake.location} at {assessment.nearestEarthquake.time}</span>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-md font-bold text-gray-800 mb-2">📋 Recommendations</h3>
        <ul className="space-y-1">
          {assessment.recommendations.map((rec, index) => (
            <li key={index} className="text-sm text-gray-700">
              • {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Nearest earthquake details */}
      {assessment.nearestEarthquake && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-md font-bold text-gray-800 mb-2">
            🌍 Nearest Earthquake
          </h3>
          
          <div className="border-l-4 border-gray-300 pl-3">
            <div className="text-sm font-medium">
              Magnitude {assessment.nearestEarthquake.magnitude} - {assessment.nearestEarthquake.location}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Distance: {assessment.nearestEarthquake.distance}km | Time: {assessment.nearestEarthquake.time}
            </div>
          </div>
        </div>
      )}

      {/* No earthquakes message */}
      {!assessment.nearestEarthquake && assessment.riskLevel === 'no_risk' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-green-800">
            <div className="text-md font-bold mb-2">✅ All Clear</div>
            <div className="text-sm">
              No recent earthquakes detected in the {assessment.feed_info.feed_type.replace(/_/g, ' ')} timeframe.
              This location appears to have low seismic activity.
            </div>
          </div>
        </div>
      )}

      {/* Technical details (collapsible) */}
      <details className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <summary className="cursor-pointer text-sm font-medium text-gray-700">
          🔧 Technical Details
        </summary>
        <div className="mt-2 text-xs text-gray-600 space-y-1">
          <div><strong>Feed Info:</strong></div>
          <div>• Source: {assessment.feed_info.source}</div>
          <div>• Feed Type: {assessment.feed_info.feed_type}</div>
          <div>• Total Earthquakes in Feed: {assessment.feed_info.total_earthquakes_in_feed || 'N/A'}</div>
          <div>• Assessment Timestamp: {assessment.timestamp}</div>
          <div>• Feed Last Updated: {formatTime(assessment.feed_info.last_updated)}</div>
          {assessment.nearestEarthquake && (
            <div>• Nearest Earthquake: Magnitude {assessment.nearestEarthquake.magnitude} at {assessment.nearestEarthquake.distance}km</div>
          )}
        </div>
      </details>
    </div>
  );
};

// Helper functions for risk styling
const getRiskBackgroundColor = (riskZone: string): string => {
  switch (riskZone) {
    case 'High Risk':
      return '#fee2e2';
    case 'Medium Risk':
      return '#fed7aa';
    case 'Low Risk':
      return '#fef3c7';
    case 'No Risk':
    default:
      return '#dcfce7';
  }
};

const getRiskTextColor = (riskZone: string): string => {
  switch (riskZone) {
    case 'High Risk':
      return '#991b1b';
    case 'Medium Risk':
      return '#c2410c';
    case 'Low Risk':
      return '#a16207';
    case 'No Risk':
    default:
      return '#166534';
  }
};

export default RiskAssessmentDisplay;
