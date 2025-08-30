'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { modelService } from '@/lib/modelService';
import { CycloneAssessment, CycloneRiskInput } from '@/types/models';

// Fix marker icon issues with Leaflet in Next.js
const fixLeafletIcons = () => {
  if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }
};

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

interface CycloneRiskMapProps {
  selectedLocation: LocationData | null;
  onLocationSelect: (location: LocationData) => void;
  onRiskAssessment?: (assessment: CycloneAssessment | null) => void;
  height?: string;
  width?: string;
  autoAssess?: boolean;
}

// Risk zone colors for cyclones
const getRiskColor = (riskLevel: string): string => {
  switch (riskLevel) {
    case 'Extreme Risk':
      return '#8b5cf6'; // Purple
    case 'High Risk':
      return '#ef4444'; // Red
    case 'Moderate Risk':
      return '#f97316'; // Orange
    case 'Low Risk':
      return '#eab308'; // Yellow
    case 'No Risk':
    default:
      return '#22c55e'; // Green
  }
};

const getRiskRadius = (riskLevel: string): number => {
  switch (riskLevel) {
    case 'Extreme Risk':
      return 150000; // 150km
    case 'High Risk':
      return 100000; // 100km
    case 'Moderate Risk':
      return 75000; // 75km
    case 'Low Risk':
      return 50000; // 50km
    case 'No Risk':
    default:
      return 25000; // 25km
  }
};

// Wind speed to circle radius mapping
const getWindRadius = (windSpeed: number): number => {
  return Math.max(windSpeed * 1000, 10000); // Scale wind speed to meters, minimum 10km
};

// Map click handler component
const MapClickHandler: React.FC<{ 
  onLocationSelect: (location: LocationData) => void;
  onAssessRisk?: (lat: number, lng: number) => void;
  autoAssess?: boolean;
}> = ({ onLocationSelect, onAssessRisk, autoAssess }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      const locationData = {
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6)),
      };
      onLocationSelect(locationData);
      
      // Auto-assess risk if enabled
      if (autoAssess && onAssessRisk) {
        onAssessRisk(lat, lng);
      }
    },
  });
  return null;
};

const CycloneRiskMap: React.FC<CycloneRiskMapProps> = ({ 
  selectedLocation, 
  onLocationSelect,
  onRiskAssessment,
  height = '500px',
  width = '100%',
  autoAssess = true
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<CycloneAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fix Leaflet marker icons on component mount
  useEffect(() => {
    fixLeafletIcons();
  }, []);
  
  // Update the map view when the selected location changes
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      mapRef.current.setView(
        [selectedLocation.lat, selectedLocation.lng],
        10
      );
    }
  }, [selectedLocation]);

  // Function to assess cyclone risk
  const assessCycloneRisk = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const input: CycloneRiskInput = {
        latitude: lat,
        longitude: lng
      };

      const assessment = await modelService.assessCycloneRisk(input);
      setRiskAssessment(assessment);
      
      if (onRiskAssessment) {
        onRiskAssessment(assessment);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assess cyclone risk';
      setError(errorMessage);
      console.error('Cyclone risk assessment error:', err);
      
      if (onRiskAssessment) {
        onRiskAssessment(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Get status message based on risk assessment
  const getStatusMessage = () => {
    if (loading) return 'Analyzing cyclone risk...';
    if (error) return `Error: ${error}`;
    if (!riskAssessment) return 'Click on map to assess cyclone risk';
    
    const { cyclone_prediction, weather_data } = riskAssessment;
    
    if (!cyclone_prediction.prediction) {
      return `${cyclone_prediction.risk_level} - Current conditions stable`;
    }
    
    return `${cyclone_prediction.risk_level} - Predicted wind: ${cyclone_prediction.predicted_wind_speed.toFixed(1)} m/s`;
  };

  // Get status color based on risk level
  const getStatusColor = () => {
    if (!riskAssessment) return 'text-gray-600';
    
    switch (riskAssessment.cyclone_prediction.risk_level) {
      case 'Extreme Risk':
        return 'text-purple-600';
      case 'High Risk':
        return 'text-red-600';
      case 'Moderate Risk':
        return 'text-orange-600';
      case 'Low Risk':
        return 'text-yellow-600';
      case 'No Risk':
      default:
        return 'text-green-600';
    }
  };

  return (
    <div style={{ height, width }}>
      {/* Status bar */}
      <div className="mb-2 p-2 bg-gray-100 rounded">
        <div className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusMessage()}
        </div>
        {riskAssessment && (
          <div className="text-xs text-gray-600 mt-1">
            Pressure: {riskAssessment.weather_data.pressure} hPa | Wind: {riskAssessment.weather_data.wind_speed} m/s | Confidence: {Math.round(riskAssessment.cyclone_prediction.confidence * 100)}%
          </div>
        )}
      </div>

      <MapContainer
        center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [25.0, 90.0]} // Default to Bay of Bengal
        zoom={selectedLocation ? 10 : 6}
        style={{ height: 'calc(100% - 60px)', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Risk zone circle */}
        {selectedLocation && riskAssessment && (
          <Circle
            center={[selectedLocation.lat, selectedLocation.lng]}
            radius={getRiskRadius(riskAssessment.cyclone_prediction.risk_level)}
            color={getRiskColor(riskAssessment.cyclone_prediction.risk_level)}
            fillColor={getRiskColor(riskAssessment.cyclone_prediction.risk_level)}
            fillOpacity={0.1}
            weight={2}
          />
        )}

        {/* Wind speed visualization circle */}
        {selectedLocation && riskAssessment && riskAssessment.cyclone_prediction.prediction && (
          <Circle
            center={[selectedLocation.lat, selectedLocation.lng]}
            radius={getWindRadius(riskAssessment.cyclone_prediction.predicted_wind_speed)}
            color="#3b82f6"
            fillColor="#3b82f6"
            fillOpacity={0.05}
            weight={1}
            dashArray="5, 5"
          />
        )}
        
        {/* User location marker */}
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              <div className="text-sm max-w-xs">
                <div className="font-bold mb-2">🌪️ Cyclone Risk Assessment</div>
                <div>
                  <strong>Coordinates:</strong><br />
                  Lat: {selectedLocation.lat.toFixed(6)}<br />
                  Lng: {selectedLocation.lng.toFixed(6)}
                </div>
                
                {riskAssessment && (
                  <div className="mt-3 border-t pt-2">
                    <div className={`font-bold ${getStatusColor()}`}>
                      {getRiskIcon(riskAssessment.cyclone_prediction.risk_level)} {riskAssessment.cyclone_prediction.risk_level}
                    </div>
                    <div className="mt-1">
                      <strong>Cyclone Risk:</strong> {riskAssessment.cyclone_prediction.prediction ? 'YES' : 'NO'}
                    </div>
                    {riskAssessment.cyclone_prediction.prediction && (
                      <div>
                        <strong>Predicted Wind:</strong> {riskAssessment.cyclone_prediction.predicted_wind_speed.toFixed(1)} m/s<br />
                        <strong>Confidence:</strong> {Math.round(riskAssessment.cyclone_prediction.confidence * 100)}%
                      </div>
                    )}
                    <div className="mt-2">
                      <strong>Weather:</strong><br />
                      Pressure: {riskAssessment.weather_data.pressure} hPa<br />
                      Wind: {riskAssessment.weather_data.wind_speed} m/s
                    </div>
                  </div>
                )}
                
                {selectedLocation.address && (
                  <div className="mt-2">
                    <strong>Address:</strong><br />
                    {selectedLocation.address}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}
        
        <MapClickHandler 
          onLocationSelect={onLocationSelect}
          onAssessRisk={assessCycloneRisk}
          autoAssess={autoAssess}
        />
      </MapContainer>
    </div>
  );
};

// Helper function to get risk icon (moved outside component to avoid recreation)
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

export default CycloneRiskMap;
