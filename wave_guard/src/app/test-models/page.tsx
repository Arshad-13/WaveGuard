'use client';

import { useState } from 'react';
import { useModels } from '@/hooks/useModels';
import { PredictionResponse } from '@/types/models';

export default function ModelTestPage() {
  const { isConnected, modelStatus, loading, error, predictTsunami, checkConnection } = useModels();
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const testTsunamiPrediction = async () => {
    const testData = {
      magnitude: 7.5,
      depth: 25.0,
      latitude: 38.0,
      longitude: 142.0
    };

    console.log('Sending tsunami prediction request:', testData);
    const prediction = await predictTsunami(testData);
    console.log('Received prediction response:', prediction);
    setResult(prediction);
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">WaveGuard ML API Test</h1>
      
      {/* Connection Status */}
      <div className="mb-8 p-4 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
          isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
        
        {modelStatus && (
          <div className="mt-4">
            <p><strong>Models loaded:</strong> {modelStatus.models_loaded}</p>
            <p><strong>Available models:</strong> {modelStatus.available_models.join(', ')}</p>
          </div>
        )}
        
        <button 
          onClick={checkConnection}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Connection
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h3 className="font-semibold">Error:</h3>
          <p>{error}</p>
          {error.includes('ML API is not running') && (
            <div className="mt-2">
              <p className="text-sm">To start the ML API:</p>
              <ol className="text-sm list-decimal list-inside mt-1">
                <li>Open a terminal in the project root</li>
                <li>Run: <code className="bg-gray-200 px-1 rounded">pnpm ml-setup:win</code> (first time only)</li>
                <li>Run: <code className="bg-gray-200 px-1 rounded">pnpm ml-api</code></li>
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Test Tsunami Prediction */}
      <div className="mb-8 p-4 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Test Tsunami Prediction</h2>
        <p className="text-gray-600 mb-4">
          Test data: Magnitude 7.5, Depth 25km, Location: 38°N, 142°E
        </p>
        
        <button 
          onClick={testTsunamiPrediction}
          disabled={!isConnected || loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {loading ? 'Predicting...' : 'Test Tsunami Prediction'}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Prediction Result:</h3>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Setup Instructions */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
        <div className="space-y-2 text-sm">
          <p><strong>1. Install Python</strong> (if not already installed)</p>
          <p><strong>2. Setup Python environment:</strong></p>
          <code className="block bg-white p-2 rounded border">
            cd python-backend<br/>
            python -m venv venv<br/>
            venv\Scripts\activate.bat<br/>
            pip install -r requirements.txt
          </code>
          <p><strong>3. Start the ML API:</strong></p>
          <code className="block bg-white p-2 rounded border">
            python main.py
          </code>
          <p><strong>4. Refresh this page to test the connection</strong></p>
        </div>
      </div>
    </div>
  );
}
