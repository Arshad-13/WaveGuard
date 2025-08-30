// Types for model predictions
export interface CyclonePredictionInput {
  features: number[];
}

export interface TsunamiPredictionInput {
  magnitude: number;
  depth: number;
  latitude: number;
  longitude: number;
}

export interface PredictionResponse {
  prediction: any;
  confidence?: number;
  risk_level?: string;
  model_used: string;
  input_features?: any;
  timestamp?: string;
  note?: string;
}

export interface ModelStatus {
  status: string;
  models_loaded: number;
  available_models: string[];
  note?: string;
}
