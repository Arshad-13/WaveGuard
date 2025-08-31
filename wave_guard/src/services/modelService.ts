/**
 * Model Service - Handles ML model predictions and API communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://waveguard-1.onrender.com';

export interface TsunamiPredictionInput {
  magnitude: number;
  depth: number;
  latitude: number;
  longitude: number;
}

export interface TsunamiPredictionResponse {
  status: string;
  tsunami_prediction: {
    will_generate_tsunami: boolean;
    probability: number | null;
    confidence: number | null;
    risk_level: string;
  };
  input_parameters: TsunamiPredictionInput;
  risk_assessment: {
    magnitude_factor: string;
    depth_factor: string;
    geographic_factor: string;
    overall_assessment: string;
    key_factors: string[];
    geological_context: Record<string, unknown>;
  };
  model_info: {
    model_used: string;
    features_engineered: number;
  };
  timestamp: string;
}

export interface CyclonePredictionInput {
  features: number[];
}

export interface ModelStatus {
  status: string;
  models_loaded: number;
  available_models: string[];
}

class ModelService {
  private baseUrl = API_BASE_URL;

  /**
   * Get model service health status
   */
  async getHealthStatus(): Promise<ModelStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error checking model service health:', error);
      throw error;
    }
  }

  /**
   * Get detailed model information
   */
  async getModelInfo() {
    try {
      const response = await fetch(`${this.baseUrl}/models/info`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching model info:', error);
      throw error;
    }
  }

  /**
   * Predict tsunami occurrence from earthquake parameters
   */
  async predictTsunami(input: TsunamiPredictionInput): Promise<TsunamiPredictionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tsunami/predict-simple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status !== 'success') {
        throw new Error(result.message || 'Prediction failed');
      }

      return result;
    } catch (error) {
      console.error('Error predicting tsunami:', error);
      throw error;
    }
  }

  /**
   * Predict cyclone intensity
   */
  async predictCyclone(input: CyclonePredictionInput) {
    try {
      const response = await fetch(`${this.baseUrl}/predict/cyclone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error predicting cyclone:', error);
      throw error;
    }
  }

  /**
   * Test connection to ML service
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error testing ML service connection:', error);
      return false;
    }
  }

  /**
   * Generate sample tsunami prediction for testing
   */
  generateSamplePrediction(): TsunamiPredictionInput {
    return {
      magnitude: 7.2,
      depth: 25.0,
      latitude: 38.0,
      longitude: 142.0
    };
  }

  /**
   * Validate tsunami input parameters
   */
  validateTsunamiInput(input: TsunamiPredictionInput): string[] {
    const errors: string[] = [];
    
    if (input.magnitude < 1.0 || input.magnitude > 10.0) {
      errors.push('Magnitude must be between 1.0 and 10.0');
    }
    
    if (input.depth < 0 || input.depth > 700) {
      errors.push('Depth must be between 0 and 700 km');
    }
    
    if (input.latitude < -90 || input.latitude > 90) {
      errors.push('Latitude must be between -90 and 90 degrees');
    }
    
    if (input.longitude < -180 || input.longitude > 180) {
      errors.push('Longitude must be between -180 and 180 degrees');
    }
    
    return errors;
  }

  /**
   * Format prediction confidence as percentage
   */
  formatConfidence(confidence: number | null): string {
    if (confidence === null) return 'N/A';
    return `${(confidence * 100).toFixed(1)}%`;
  }

  /**
   * Get risk level color for UI
   */
  getRiskLevelColor(riskLevel: string): string {
    const colors = {
      'Low': '#22c55e',      // green
      'Medium': '#f59e0b',   // yellow
      'High': '#ef4444',     // red
      'Very High': '#dc2626', // dark red
      'Extreme': '#991b1b'   // very dark red
    };
    
    return colors[riskLevel as keyof typeof colors] || '#6b7280'; // gray fallback
  }

  /**
   * Get risk level icon for UI
   */
  getRiskLevelIcon(riskLevel: string): string {
    const icons = {
      'Low': '🟢',
      'Medium': '🟡', 
      'High': '🔴',
      'Very High': '⚠️',
      'Extreme': '🚨'
    };
    
    return icons[riskLevel as keyof typeof icons] || '❓';
  }
}

// Export singleton instance
export const modelService = new ModelService();
export default modelService;
