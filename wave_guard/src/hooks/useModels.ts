'use client';

import { useState, useEffect } from 'react';
import { modelService } from '@/lib/modelService';
import { 
  CyclonePredictionInput, 
  TsunamiPredictionInput, 
  PredictionResponse, 
  ModelStatus 
} from '@/types/models';

export function useModels() {
  const [isConnected, setIsConnected] = useState(false);
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const connected = await modelService.checkConnection();
      setIsConnected(connected);
      
      if (connected) {
        const status = await modelService.getModelStatus();
        setModelStatus(status);
      }
    } catch (err) {
      setIsConnected(false);
      setError('Failed to connect to ML API');
    }
  };

  const predictCyclone = async (input: CyclonePredictionInput): Promise<PredictionResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await modelService.predictCycloneIntensity(input);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cyclone prediction failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const predictTsunami = async (input: TsunamiPredictionInput): Promise<PredictionResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await modelService.predictTsunami(input);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tsunami prediction failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    isConnected,
    modelStatus,
    loading,
    error,
    predictCyclone,
    predictTsunami,
    checkConnection,
  };
}
