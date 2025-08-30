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

// Types for earthquake and tsunami analysis
export interface LocationInput {
  lat: number;
  lng: number;
  address?: string;
}

export interface EarthquakeDataRequest {
  latitude: number;
  longitude: number;
  address?: string;
  radius_km?: number;
  time_period?: string;
}

export interface EarthquakeFeature {
  id: string;
  magnitude?: number;
  place: string;
  time: string;
  longitude?: number;
  latitude?: number;
  depth?: number;
  magType: string;
  tsunami: number;
  url: string;
  distance_km?: number;
}

export interface EarthquakeDataResponse {
  location: LocationInput;
  search_radius_km: number;
  time_period: string;
  earthquakes_found: number;
  nearby_earthquakes: EarthquakeFeature[];
  risk_analysis: {
    risk_level: string;
    risk_score: number;
    max_magnitude: number;
    avg_magnitude: number;
    total_earthquakes: number;
    shallow_earthquakes: number;
    tsunami_alerts: number;
    analysis: string;
    recommendations: string[];
    tsunami_predictions?: TsunamiPredictionResult[];
  };
  data_source: string;
  timestamp: string;
}

export interface TsunamiPredictionResult {
  earthquake_id: string;
  earthquake_data: {
    magnitude: number;
    depth: number;
    location: string;
    place: string;
    time: string;
    distance_km?: number;
  };
  tsunami_prediction: {
    prediction: boolean;
    probability?: number;
    confidence?: number;
    risk_level: string;
    model_assessment: TsunamiRiskAssessment;
  };
}

export interface TsunamiRiskAssessment {
  magnitude_factor: string;
  depth_factor: string;
  geographic_factor: string;
  overall_assessment: string;
  key_factors: string[];
  geological_context: GeologicalFeatures;
}

export interface GeologicalFeatures {
  is_oceanic: boolean;
  coastal_proximity_km: number;
  estimated_depth_km: number;
  nearest_risk_zone: string;
  distance_to_risk_zone_km?: number;
  geological_risk_factor: number;
  seismic_zone: string;
  tectonic_activity_level: string;
}

export interface TsunamiAnalysisResponse {
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  geological_context: GeologicalFeatures;
  recent_earthquake_analysis: {
    earthquakes_found: number;
    risk_analysis: any;
    search_radius_km: number;
    time_period: string;
  };
  scenario_analysis: {
    scenarios_analyzed: number;
    predictions: ScenarioPrediction[];
  };
  overall_tsunami_threat: ThreatAssessment;
  recommendations: SafetyRecommendations;
  data_sources: string[];
  timestamp: string;
}

export interface ScenarioPrediction {
  scenario: string;
  magnitude: number;
  depth: number;
  tsunami_prediction: boolean;
  tsunami_probability?: number;
  confidence?: number;
  risk_level: string;
  scenario_probability: number;
}

export interface ThreatAssessment {
  threat_level: string;
  alert_status: string;
  threat_score: number;
  contributing_factors: string[];
  assessment_summary: string;
}

export interface SafetyRecommendations {
  immediate_actions: string[];
  preparedness: string[];
  monitoring: string[];
  evacuation: string[];
}

// New types for USGS integration and enhanced risk assessment
export interface UserLocationInput {
  latitude: number;
  longitude: number;
  feed_type?: 'past_hour_m45' | 'past_day_m45' | 'past_hour_m25' | 'past_day_all' | 'past_week_m45' | 'past_month_m45';
}

export interface EarthquakeData {
  id: string;
  magnitude: number;
  depth: number;
  latitude: number;
  longitude: number;
  place: string;
  time: number;
  tsunami_flag: number;
}

export interface UserRiskZone {
  risk_zone: 'High Risk' | 'Medium Risk' | 'Low Risk' | 'No Risk';
  distance_km: number;
  reasoning: string;
}

export interface EarthquakeAnalysis {
  earthquake: {
    id: string;
    magnitude: number;
    depth: number;
    latitude: number;
    longitude: number;
    place: string;
  };
  tsunami_prediction: boolean;
  tsunami_probability: number;
  user_risk: UserRiskZone;
}

export interface HighestRiskInfo {
  risk_zone: string;
  distance_km: number;
  reasoning: string;
  earthquake?: {
    id: string;
    magnitude: number;
    depth: number;
    latitude: number;
    longitude: number;
    place: string;
    tsunami_prediction: boolean;
    tsunami_probability: number;
  };
}

export interface UserRiskAssessment {
  user_location: {
    latitude: number;
    longitude: number;
  };
  earthquake_count: number;
  earthquakes_analyzed: EarthquakeAnalysis[];
  highest_risk: HighestRiskInfo;
  overall_status: 'All Clear' | 'Advisory' | 'Elevated Alert' | 'High Alert';
  recommendations: string[];
  feed_info: {
    feed_type: string;
    source: string;
    total_earthquakes_in_feed?: number;
    last_updated: string;
  };
  timestamp: string;
}

export interface USGSEarthquakeResponse {
  status: string;
  count: number;
  earthquakes: EarthquakeData[];
  metadata: any;
  feed_type: string;
  message?: string;
}

// Cyclone prediction types
export interface WeatherData {
  pressure: number; // hPa
  wind_speed: number; // m/s
  wind_direction: number; // degrees
  temperature: number; // Celsius
  humidity: number; // percentage
  visibility: number; // km
}

export interface CycloneRiskInput {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface CyclonePredictionResult {
  prediction: boolean;
  risk_level: 'No Risk' | 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Extreme Risk';
  confidence: number;
  predicted_wind_speed: number;
  risk_factors: {
    pressure_factor: string;
    wind_factor: string;
    combined_assessment: string;
  };
}

export interface CycloneAssessment {
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  weather_data: WeatherData;
  cyclone_prediction: CyclonePredictionResult;
  recommendations: string[];
  monitoring_advice: string[];
  data_source: string;
  timestamp: string;
}
