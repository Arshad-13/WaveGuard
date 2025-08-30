'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { modelService } from '@/lib/modelService';
import { UserRiskAssessment, UserLocationInput } from '@/types/models';

// Fix marker icon issues with Leaflet in Next.js
const fixLeafletIcons = () => {
  if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
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

interface TsunamiRiskMapProps {
  selectedLocation: LocationData | null;
  onLocationSelect: (location: LocationData) => void;
  onRiskAssessment?: (assessment: UserRiskAssessment | null) => void;
  height?: string;
  width?: string;
  feedType?: 'past_hour_m45' | 'past_day_m45' | 'past_hour_m25' | 'past_day_all' | 'past_week_m45' | 'past_month_m45';
  autoAssess?: boolean;
}

// Risk zone colors
const getRiskColor = (riskZone: string): string => {
  switch (riskZone) {
    case 'High Risk':
      return '#ff0000';
    case 'Medium Risk':
      return '#ff8800';
    case 'Low Risk':
      return '#ffff00';
    case 'No Risk':
    default:
      return '#00ff00';
  }
};

const getRiskRadius = (riskZone: string): number => {
  switch (riskZone) {
    case 'High Risk':
      return 50000; // 50km
    case 'Medium Risk':
      return 100000; // 100km
    case 'Low Risk':
      return 200000; // 200km
    case 'No Risk':
    default:
      return 25000; // 25km
  }
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

const TsunamiRiskMap: React.FC<TsunamiRiskMapProps> = ({ 
  selectedLocation, 
  onLocationSelect,
  onRiskAssessment,
  height = '500px',
  width = '100%',
  feedType = 'past_day_m45',
  autoAssess = true
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<UserRiskAssessment | null>(null);
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

  // Function to assess tsunami risk
  const assessTsunamiRisk = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const input: UserLocationInput = {
        latitude: lat,
        longitude: lng,
        feed_type: feedType
      };

      const assessment = await modelService.assessTsunamiRisk(input);
      setRiskAssessment(assessment);
      
      if (onRiskAssessment) {
        onRiskAssessment(assessment);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assess tsunami risk';
      setError(errorMessage);
      console.error('Tsunami risk assessment error:', err);
      
      if (onRiskAssessment) {
        onRiskAssessment(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Get status message based on risk assessment
  const getStatusMessage = () => {
    if (loading) return 'Assessing tsunami risk...';
    if (error) return `Error: ${error}`;
    if (!riskAssessment) return 'Click on map to assess tsunami risk';
    
    const { overall_status, earthquake_count, highest_risk } = riskAssessment;
    
    if (earthquake_count === 0) {
      return `${overall_status} - No recent earthquakes detected`;
    }
    
    return `${overall_status} - ${highest_risk.risk_zone} (${earthquake_count} earthquakes analyzed)`;
  };

  // Get status color based on overall status
  const getStatusColor = () => {
    if (!riskAssessment) return 'text-gray-600';
    
    switch (riskAssessment.overall_status) {
      case 'High Alert':
        return 'text-red-600';
      case 'Elevated Alert':
        return 'text-orange-600';
      case 'Advisory':
        return 'text-yellow-600';
      case 'All Clear':
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
        {riskAssessment && riskAssessment.earthquake_count > 0 && (
          <div className="text-xs text-gray-600 mt-1">
            Highest risk: {riskAssessment.highest_risk.distance_km}km away - {riskAssessment.highest_risk.reasoning}
          </div>
        )}
      </div>

      <MapContainer
        center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [35.6762, 139.6503]} // Default to Tokyo
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
            radius={getRiskRadius(riskAssessment.highest_risk.risk_zone)}
            color={getRiskColor(riskAssessment.highest_risk.risk_zone)}
            fillColor={getRiskColor(riskAssessment.highest_risk.risk_zone)}
            fillOpacity={0.1}
            weight={2}
          />
        )}
        
        {/* User location marker */}
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              <div className="text-sm max-w-xs">
                <div className="font-bold mb-2">📍 Selected Location</div>
                <div>
                  <strong>Coordinates:</strong><br />
                  Lat: {selectedLocation.lat.toFixed(6)}<br />
                  Lng: {selectedLocation.lng.toFixed(6)}
                </div>
                
                {riskAssessment && (
                  <div className="mt-3 border-t pt-2">
                    <div className={`font-bold ${getStatusColor()}`}>
                      🌊 {riskAssessment.overall_status}
                    </div>
                    <div className="mt-1">
                      <strong>Risk Level:</strong> {riskAssessment.highest_risk.risk_zone}
                    </div>
                    {riskAssessment.earthquake_count > 0 ? (
                      <div>
                        <strong>Earthquakes Found:</strong> {riskAssessment.earthquake_count}<br />
                        <strong>Distance to Closest:</strong> {riskAssessment.highest_risk.distance_km}km
                      </div>
                    ) : (
                      <div className="text-green-600">
                        ✅ No recent significant earthquakes
                      </div>
                    )}
                    <div className="mt-2">
                      <strong>Recommendations:</strong>
                      <ul className="text-xs mt-1">
                        {riskAssessment.recommendations.slice(0, 2).map((rec, idx) => (
                          <li key={idx}>• {rec}</li>
                        ))}
                      </ul>
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

        {/* Earthquake markers */}
        {riskAssessment && riskAssessment.earthquakes_analyzed.map((eq) => (
          <Marker 
            key={eq.earthquake.id}
            position={[eq.earthquake.latitude, eq.earthquake.longitude]}
            icon={new L.Icon({
              iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
              iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
              shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
              iconSize: [15, 24],
              iconAnchor: [7, 24],
              popupAnchor: [1, -24],
              className: eq.tsunami_prediction ? 'earthquake-tsunami' : 'earthquake-normal'
            })}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-bold">🔴 Magnitude {eq.earthquake.magnitude} Earthquake</div>
                <div className="mt-1">
                  <strong>Location:</strong> {eq.earthquake.place}<br />
                  <strong>Depth:</strong> {eq.earthquake.depth}km<br />
                  <strong>Distance from you:</strong> {eq.user_risk.distance_km}km
                </div>
                <div className="mt-2 border-t pt-2">
                  <div className={`font-bold ${eq.tsunami_prediction ? 'text-red-600' : 'text-green-600'}`}>
                    🌊 Tsunami Risk: {eq.tsunami_prediction ? 'YES' : 'NO'}
                  </div>
                  {eq.tsunami_prediction && (
                    <div>
                      <strong>Probability:</strong> {Math.round(eq.tsunami_probability * 100)}%
                    </div>
                  )}
                  <div className={`mt-1 font-medium`} style={{color: getRiskColor(eq.user_risk.risk_zone)}}>
                    Your Risk: {eq.user_risk.risk_zone}
                  </div>
                  <div className="text-xs text-gray-600">
                    {eq.user_risk.reasoning}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <MapClickHandler 
          onLocationSelect={onLocationSelect}
          onAssessRisk={assessTsunamiRisk}
          autoAssess={autoAssess}
        />
      </MapContainer>
    </div>
  );
};

export default TsunamiRiskMap;
