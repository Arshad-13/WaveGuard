'use client';

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix marker icon issues with Leaflet in Next.js - moved to a separate function
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

interface LeafletMapProps {
  selectedLocation: LocationData | null;
  onLocationSelect: (location: LocationData) => void;
  height?: string;
  width?: string;
}

// Map click handler component
const MapClickHandler: React.FC<{ onLocationSelect: (location: LocationData) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      const locationData = {
        lat: parseFloat(lat.toFixed(6)),
        lng: parseFloat(lng.toFixed(6)),
      };
      onLocationSelect(locationData);
    },
  });
  return null;
};

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  selectedLocation, 
  onLocationSelect,
  height = '500px',
  width = '100%' 
}) => {
  const mapRef = useRef<L.Map | null>(null);
  
  // Fix Leaflet marker icons on component mount
  useEffect(() => {
    fixLeafletIcons();
  }, []);
  
  // Update the map view when the selected location changes
  useEffect(() => {
    if (selectedLocation && mapRef.current) {
      mapRef.current.setView(
        [selectedLocation.lat, selectedLocation.lng],
        15
      );
    }
  }, [selectedLocation]);

  return (
    <MapContainer
      center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [37.7749, -122.4194]}
      zoom={selectedLocation ? 15 : 10}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {selectedLocation && (
        <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
          <Popup>
            <div className="text-sm">
              <strong>Selected Location</strong><br />
              Lat: {selectedLocation.lat.toFixed(6)}<br />
              Lng: {selectedLocation.lng.toFixed(6)}
              {selectedLocation.address && (
                <><br />Address: {selectedLocation.address}</>
              )}
            </div>
          </Popup>
        </Marker>
      )}
      
      <MapClickHandler onLocationSelect={onLocationSelect} />
    </MapContainer>
  );
};

export default LeafletMap;
