'use client';

import React, { useEffect, useState } from 'react';

interface DiagnosticResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

const GoogleMapsDebugger: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: DiagnosticResult[] = [];

    // Test 1: Environment Variables
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    results.push({
      test: 'API Key Environment Variable',
      status: apiKey ? 'pass' : 'fail',
      message: apiKey ? 'API key is defined' : 'API key is missing',
      details: {
        hasKey: !!apiKey,
        keyLength: apiKey?.length || 0,
        keyStart: apiKey ? apiKey.substring(0, 10) + '...' : 'undefined',
        environment: process.env.NODE_ENV
      }
    });

    // Test 2: API Key Format
    if (apiKey) {
      const isValidFormat = apiKey.startsWith('AIza') && apiKey.length === 39;
      results.push({
        test: 'API Key Format',
        status: isValidFormat ? 'pass' : 'fail',
        message: isValidFormat ? 'API key format is valid' : 'API key format is invalid',
        details: {
          startsWithAIza: apiKey.startsWith('AIza'),
          correctLength: apiKey.length === 39,
          actualLength: apiKey.length
        }
      });
    }

    // Test 3: Network Connectivity
    try {
      const response = await fetch('https://maps.googleapis.com/maps/api/js?key=' + apiKey, {
        method: 'HEAD',
        mode: 'no-cors'
      });
      results.push({
        test: 'Network Connectivity',
        status: 'pass',
        message: 'Can reach Google Maps API',
      });
    } catch (error) {
      results.push({
        test: 'Network Connectivity',
        status: 'fail',
        message: 'Cannot reach Google Maps API',
        details: { error: error.message }
      });
    }

    // Test 4: Browser Support
    const hasGeolocation = 'geolocation' in navigator;
    const hasLocalStorage = typeof Storage !== 'undefined';
    results.push({
      test: 'Browser Support',
      status: hasGeolocation && hasLocalStorage ? 'pass' : 'warning',
      message: `Geolocation: ${hasGeolocation ? 'Supported' : 'Not supported'}, Storage: ${hasLocalStorage ? 'Supported' : 'Not supported'}`,
      details: {
        geolocation: hasGeolocation,
        localStorage: hasLocalStorage,
        userAgent: navigator.userAgent
      }
    });

    // Test 5: Domain/Origin Check
    const currentOrigin = window.location.origin;
    results.push({
      test: 'Current Origin',
      status: 'pass',
      message: `Running on: ${currentOrigin}`,
      details: {
        origin: currentOrigin,
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        port: window.location.port
      }
    });

    // Test 6: Google Maps Script Loading
    try {
      const { Loader } = await import('@googlemaps/js-api-loader');
      const loader = new Loader({
        apiKey: apiKey!,
        version: 'weekly',
        libraries: ['places']
      });
      
      await loader.load();
      
      results.push({
        test: 'Google Maps Script Loading',
        status: typeof google !== 'undefined' && google.maps ? 'pass' : 'fail',
        message: typeof google !== 'undefined' && google.maps ? 'Google Maps API loaded successfully' : 'Google Maps API failed to load',
        details: {
          googleDefined: typeof google !== 'undefined',
          googleMapsDefined: typeof google !== 'undefined' && !!google.maps,
          version: typeof google !== 'undefined' && google.maps ? google.maps.version : 'unknown'
        }
      });
    } catch (error) {
      results.push({
        test: 'Google Maps Script Loading',
        status: 'fail',
        message: 'Failed to load Google Maps API',
        details: { error: error.message }
      });
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return '✅';
      case 'fail':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return 'text-green-700 bg-green-100';
      case 'fail':
        return 'text-red-700 bg-red-100';
      case 'warning':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            🔧 Google Maps API Diagnostics
          </h2>
          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg font-medium ${
              isRunning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRunning ? 'Running...' : 'Run Diagnostics'}
          </button>
        </div>

        <div className="space-y-4">
          {diagnostics.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold flex items-center">
                  <span className="mr-2">{getStatusIcon(result.status)}</span>
                  {result.test}
                </h3>
              </div>
              
              <p className="text-sm mb-2">{result.message}</p>
              
              {result.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-medium">
                    View Details
                  </summary>
                  <pre className="mt-2 p-2 bg-black bg-opacity-10 rounded text-xs overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>

        {diagnostics.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Common Solutions:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>API Key Issues:</strong> Check Google Cloud Console, enable Maps JavaScript API and Places API</li>
              <li>• <strong>Domain Restrictions:</strong> Add your domain to API key restrictions</li>
              <li>• <strong>Billing:</strong> Ensure billing is enabled for your Google Cloud project</li>
              <li>• <strong>Quota Exceeded:</strong> Check your API usage and limits</li>
              <li>• <strong>Ad Blockers:</strong> Disable ad blockers that might block Google APIs</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleMapsDebugger;
