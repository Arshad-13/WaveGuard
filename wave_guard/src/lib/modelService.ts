import { 
  CyclonePredictionInput, 
  TsunamiPredictionInput, 
  PredictionResponse, 
  ModelStatus,
  EarthquakeDataRequest,
  EarthquakeDataResponse,
  TsunamiAnalysisResponse,
  LocationInput,
  UserRiskAssessment
} from '@/types/models';

const API_BASE_URL = process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:8000';

class ModelService {
  private async fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased timeout for complex predictions

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('ML API is not running. Please start the Python backend.');
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout. ML API may be slow or unavailable.');
      }
      throw error;
    }
  }

  async getModelStatus(): Promise<ModelStatus> {
    return this.fetchAPI<ModelStatus>('/health');
  }

  async predictCycloneIntensity(input: CyclonePredictionInput): Promise<PredictionResponse> {
    return this.fetchAPI<PredictionResponse>('/predict/cyclone', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async predictTsunami(input: TsunamiPredictionInput): Promise<PredictionResponse> {
    return this.fetchAPI<PredictionResponse>('/predict/tsunami', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async getEarthquakeData(request: EarthquakeDataRequest): Promise<EarthquakeDataResponse> {
    return this.fetchAPI<EarthquakeDataResponse>('/api/earthquake-data', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async analyzeTsunamiRisk(request: EarthquakeDataRequest): Promise<TsunamiAnalysisResponse> {
    return this.fetchAPI<TsunamiAnalysisResponse>('/api/tsunami/analyze-location', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // New USGS integration methods
  async assessTsunamiRisk(input: LocationInput): Promise<UserRiskAssessment> {
    return this.fetchAPI<UserRiskAssessment>('/assess/tsunami-risk', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async getUSGSEarthquakeData(feedType: string): Promise<EarthquakeDataResponse> {
    return this.fetchAPI<EarthquakeDataResponse>(`/earthquakes/${feedType}`);
  }
  async checkConnection(): Promise<boolean> {
    try {
      await this.fetchAPI('/');
      return true;
    } catch {
      return false;
    }
  }
}

export const modelService = new ModelService();
