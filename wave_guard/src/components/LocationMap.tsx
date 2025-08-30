'use client';

import React, { useState, useCallback } from 'react';

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationMapProps {
  onLocationSelect: (location: LocationData) => void;
  height?: string;
  width?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ 
  onLocationSelect, 
  height = '500px', 
  width = '100%' 
}) => {
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [manualLat, setManualLat] = useState<string>('');
  const [manualLng, setManualLng] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle manual coordinate input
  const handleManualCoordinates = useCallback(() => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      setLocationStatus('Please enter valid latitude and longitude values');
      setTimeout(() => setLocationStatus(''), 3000);
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setLocationStatus('Latitude must be between -90 and 90, longitude between -180 and 180');
      setTimeout(() => setLocationStatus(''), 3000);
      return;
    }

    const locationData = {
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6)),
    };

    setSelectedLocation(locationData);
    onLocationSelect(locationData);
    setLocationStatus('Manual coordinates set!');
    setTimeout(() => setLocationStatus(''), 3000);
  }, [manualLat, manualLng, onLocationSelect]);

  // Handle search location
  const handleSearchLocation = useCallback(() => {
    if (!searchQuery.trim()) {
      setLocationStatus('Please enter a search query');
      setTimeout(() => setLocationStatus(''), 3000);
      return;
    }

    // For demo purposes, we'll show the search query
    // In a real implementation, you'd use a geocoding service
    setLocationStatus(`Searching for: ${searchQuery}`);
    setTimeout(() => setLocationStatus('Use the manual coordinates or current location instead'), 5000);
  }, [searchQuery]);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    setLocationStatus('Getting your location...');
    
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by this browser');
      setTimeout(() => setLocationStatus(''), 3000);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        const locationData = {
          lat: parseFloat(lat.toFixed(6)),
          lng: parseFloat(lng.toFixed(6)),
        };
        
        setSelectedLocation(locationData);
        onLocationSelect(locationData);
        setManualLat(lat.toFixed(6));
        setManualLng(lng.toFixed(6));
        
        setLocationStatus('Current location found!');
        setTimeout(() => setLocationStatus(''), 3000);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location: ';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location unavailable';
            break;
          case error.TIMEOUT:
            errorMessage += 'Request timeout';
            break;
          default:
            errorMessage += 'Unknown error';
            break;
        }
        
        setLocationStatus(errorMessage);
        setTimeout(() => setLocationStatus(''), 5000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [onLocationSelect]);

  // Send location to backend
  const sendLocationToBackend = useCallback(async () => {
    if (!selectedLocation) {
      alert('Please select a location first');
      return;
    }

    try {
      setLocationStatus('Sending location to backend...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedLocation),
      });

      if (response.ok) {
        const result = await response.json();
        setLocationStatus('Location sent successfully!');
        console.log('Backend response:', result);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending location to backend:', error);
      setLocationStatus('Error sending location to backend');
    }
    
    setTimeout(() => setLocationStatus(''), 3000);
  }, [selectedLocation]);

  // Generate map URLs for selected location
  const generateMapUrl = (location: LocationData) => {
    const { lat, lng } = location;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
    
    if (apiKey) {
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=15`;
    } else {
      return `https://www.google.com/maps?q=${lat},${lng}&t=m&z=15&output=embed&iwloc=near`;
    }
  };

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="mb-4 space-y-4">
        {/* Search Box */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search for a location (e.g., New York, Paris)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearchLocation}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            🔍 Search
          </button>
        </div>

        {/* Manual Coordinates Input */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            type="number"
            placeholder="Latitude (e.g., 40.7128)"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
            step="any"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Longitude (e.g., -74.0060)"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
            step="any"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleManualCoordinates}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            📍 Set Location
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={getCurrentLocation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            📍 Get Current Location
          </button>
          
          <button
            onClick={sendLocationToBackend}
            disabled={!selectedLocation}
            className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              selectedLocation
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            🚀 Send to Backend
          </button>
        </div>

        {/* Status Message */}
        {locationStatus && (
          <div className={`p-3 rounded-lg ${
            locationStatus.includes('Error') || locationStatus.includes('Unable')
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {locationStatus}
          </div>
        )}

        {/* Selected Location Info */}
        {selectedLocation && (
          <div className="p-3 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Selected Location:</h3>
            <p><strong>Latitude:</strong> {selectedLocation.lat.toFixed(6)}</p>
            <p><strong>Longitude:</strong> {selectedLocation.lng.toFixed(6)}</p>
            {selectedLocation.address && (
              <p><strong>Address:</strong> {selectedLocation.address}</p>
            )}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="rounded-lg border border-gray-300 shadow-lg overflow-hidden">
        {selectedLocation ? (
          <iframe
            src={generateMapUrl(selectedLocation)}
            width={width}
            height={height}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Selected Location Map"
          ></iframe>
        ) : (
          <div 
            style={{ height, width }}
            className="flex items-center justify-center bg-gray-100 text-gray-500"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p>Select a location to view the map</p>
              <p className="text-sm mt-2">Use GPS, manual coordinates, or search</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Instructions:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Use the search box to find a location by name (currently for display only)</li>
          <li>Enter latitude and longitude manually and click "Set Location"</li>
          <li>Click "Get Current Location" to use your GPS coordinates</li>
          <li>The map will display your selected location with a marker</li>
          <li>Click "Send to Backend" to submit the coordinates to your server</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationMap;
