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

  // Get alert styling based on status
  const getAlertStyling = (status: string) => {
    switch (status) {
      case 'High Alert':
        return {
          containerClass: 'bg-red-50 border-red-500',
          titleClass: 'text-red-800',
          icon: '🚨'
        };
      case 'Elevated Alert':
        return {
          containerClass: 'bg-orange-50 border-orange-500',
          titleClass: 'text-orange-800',
          icon: '⚠️'
        };
      case 'Advisory':
        return {
          containerClass: 'bg-yellow-50 border-yellow-500',
          titleClass: 'text-yellow-800',
          icon: '📋'
        };
      case 'All Clear':
      default:
        return {
          containerClass: 'bg-green-50 border-green-500',
          titleClass: 'text-green-800',
          icon: '✅'
        };
    }
  };

  const styling = getAlertStyling(assessment.overall_status);

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
          {styling.icon} {assessment.overall_status}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm">
              <strong>Location:</strong> {assessment.user_location.latitude.toFixed(4)}, {assessment.user_location.longitude.toFixed(4)}
            </div>
            <div className="text-sm mt-1">
              <strong>Risk Level:</strong> {assessment.highest_risk.risk_zone}
            </div>
            {assessment.earthquake_count > 0 && (
              <div className="text-sm mt-1">
                <strong>Earthquakes Analyzed:</strong> {assessment.earthquake_count}
              </div>
            )}
          </div>
          
          <div>
            <div className="text-sm">
              <strong>Data Source:</strong> {assessment.feed_info.source}
            </div>
            <div className="text-sm mt-1">
              <strong>Feed Type:</strong> {assessment.feed_info.feed_type.replace(/_/g, ' ').toUpperCase()}
            </div>
            <div className="text-sm mt-1">
              <strong>Last Updated:</strong> {formatTime(assessment.timestamp)}
            </div>
          </div>
        </div>

        {assessment.highest_risk.distance_km > 0 && (
          <div className="mt-3 text-sm">
            <strong>Closest Threat:</strong> {assessment.highest_risk.distance_km}km away<br />
            <span className="text-gray-600">{assessment.highest_risk.reasoning}</span>
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

      {/* Earthquake details */}
      {assessment.earthquake_count > 0 && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <h3 className="text-md font-bold text-gray-800 mb-2">
            🌍 Recent Earthquakes ({assessment.earthquake_count})
          </h3>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {assessment.earthquakes_analyzed.slice(0, 5).map((eq, index) => (
              <div key={eq.earthquake.id} className="border-l-4 border-gray-300 pl-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      Magnitude {eq.earthquake.magnitude} - {eq.earthquake.place}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Depth: {eq.earthquake.depth}km | Distance: {eq.user_risk.distance_km}km
                    </div>
                  </div>
                  
                  <div className="ml-4 text-right">
                    <div className={`text-xs font-bold ${eq.tsunami_prediction ? 'text-red-600' : 'text-green-600'}`}>
                      {eq.tsunami_prediction ? '🌊 TSUNAMI RISK' : '✅ NO TSUNAMI'}
                    </div>
                    {eq.tsunami_prediction && (
                      <div className="text-xs text-gray-600">
                        {Math.round(eq.tsunami_probability * 100)}% probability
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-1">
                  <span 
                    className={`inline-block px-2 py-1 rounded text-xs font-medium`}
                    style={{
                      backgroundColor: getRiskBackgroundColor(eq.user_risk.risk_zone),
                      color: getRiskTextColor(eq.user_risk.risk_zone)
                    }}
                  >
                    {eq.user_risk.risk_zone}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {assessment.earthquake_count > 5 && (
            <div className="text-xs text-gray-500 mt-2">
              Showing 5 of {assessment.earthquake_count} earthquakes
            </div>
          )}
        </div>
      )}

      {/* No earthquakes message */}
      {assessment.earthquake_count === 0 && (
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
