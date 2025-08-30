"""
WaveGuard ML API - Main Backend Server for Next.js Application
Provides tsunami and cyclone prediction endpoints for frontend integration.
"""

import pickle
import numpy as np
import os
import logging
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uvicorn
import requests
import math
import random

# Load environment variables
load_dotenv('.env.model')
load_dotenv()  # Load .env file for API keys

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="WaveGuard ML API",
    description="Machine Learning API for natural disaster prediction",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["*"]  # Configure based on your deployment
)

# CORS middleware for Next.js frontend
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Global model storage
models = {}
model_metadata = {}

# USGS API endpoints
USGS_FEEDS = {
    'past_hour_m45': 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_hour.geojson',
    'past_day_m45': 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson',
    'past_hour_m25': 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_hour.geojson',
    'past_day_all': 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson',
    'past_week_m45': 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson',
    'past_month_m45': 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson'
}

# OpenWeatherMap API configuration
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5"
OPENWEATHER_ONECALL_URL = "https://api.openweathermap.org/data/3.0/onecall"

def fetch_usgs_earthquake_data(feed_type: str = 'past_day_m45') -> Dict[str, Any]:
    """Fetch earthquake data from USGS feed APIs"""
    try:
        if feed_type not in USGS_FEEDS:
            raise ValueError(f"Invalid feed type. Available: {list(USGS_FEEDS.keys())}")
        
        url = USGS_FEEDS[feed_type]
        logger.info(f"Fetching earthquake data from: {url}")
        
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Extract earthquake features
        earthquakes = []
        for feature in data.get('features', []):
            props = feature.get('properties', {})
            geom = feature.get('geometry', {})
            coords = geom.get('coordinates', [0, 0, 0])
            
            earthquake = {
                'id': feature.get('id'),
                'magnitude': props.get('mag'),
                'depth': coords[2] if len(coords) > 2 else 0,
                'latitude': coords[1],
                'longitude': coords[0],
                'place': props.get('place'),
                'time': props.get('time'),
                'tsunami_flag': props.get('tsunami', 0)
            }
            earthquakes.append(earthquake)
        
        return {
            'status': 'success',
            'count': len(earthquakes),
            'earthquakes': earthquakes,
            'metadata': data.get('metadata', {}),
            'feed_type': feed_type
        }
        
    except requests.RequestException as e:
        logger.error(f"USGS API request failed: {e}")
        return {
            'status': 'error',
            'message': f"Failed to fetch earthquake data: {str(e)}",
            'count': 0,
            'earthquakes': []
        }
    except Exception as e:
        logger.error(f"Error processing earthquake data: {e}")
        return {
            'status': 'error',
            'message': f"Error processing data: {str(e)}",
            'count': 0,
            'earthquakes': []
        }

def fetch_openweather_current(lat: float, lon: float) -> Dict[str, Any]:
    """Fetch current weather data from OpenWeatherMap API"""
    try:
        if not OPENWEATHER_API_KEY:
            raise ValueError("OpenWeatherMap API key not configured")
        
        url = f"{OPENWEATHER_BASE_URL}/weather"
        params = {
            'lat': lat,
            'lon': lon,
            'appid': OPENWEATHER_API_KEY,
            'units': 'metric'  # Celsius, m/s, etc.
        }
        
        logger.info(f"Fetching current weather for ({lat}, {lon})")
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        return {
            'status': 'success',
            'weather': {
                'temperature': data['main']['temp'],
                'humidity': data['main']['humidity'],
                'pressure': data['main']['pressure'],
                'wind_speed': data.get('wind', {}).get('speed', 0),
                'wind_direction': data.get('wind', {}).get('deg', 0),
                'visibility': data.get('visibility', 10000) / 1000,  # Convert to km
                'precipitation': data.get('rain', {}).get('1h', 0),  # mm in last hour
                'clouds': data.get('clouds', {}).get('all', 0),
                'description': data['weather'][0]['description'],
                'location': data['name'],
                'country': data['sys']['country']
            },
            'coordinates': {'lat': lat, 'lon': lon},
            'timestamp': datetime.now().isoformat()
        }
        
    except requests.RequestException as e:
        logger.error(f"OpenWeatherMap API request failed: {e}")
        return {
            'status': 'error',
            'message': f"Failed to fetch weather data: {str(e)}"
        }
    except Exception as e:
        logger.error(f"Error processing weather data: {e}")
        return {
            'status': 'error',
            'message': f"Error processing weather data: {str(e)}"
        }

def fetch_openweather_forecast(lat: float, lon: float, days: int = 5) -> Dict[str, Any]:
    """Fetch weather forecast from OpenWeatherMap API"""
    try:
        if not OPENWEATHER_API_KEY:
            raise ValueError("OpenWeatherMap API key not configured")
        
        # Use the 5-day forecast API
        url = f"{OPENWEATHER_BASE_URL}/forecast"
        params = {
            'lat': lat,
            'lon': lon,
            'appid': OPENWEATHER_API_KEY,
            'units': 'metric',
            'cnt': min(days * 8, 40)  # 8 forecasts per day (3-hour intervals), max 40
        }
        
        logger.info(f"Fetching {days}-day forecast for ({lat}, {lon})")
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        # Process forecast data
        forecasts = []
        daily_rainfall = {}
        
        for item in data['list']:
            forecast_time = datetime.fromtimestamp(item['dt'])
            day_key = forecast_time.strftime('%Y-%m-%d')
            
            # Extract rainfall data
            rainfall = item.get('rain', {}).get('3h', 0)  # mm in 3 hours
            
            if day_key not in daily_rainfall:
                daily_rainfall[day_key] = 0
            daily_rainfall[day_key] += rainfall
            
            forecast_item = {
                'datetime': forecast_time.isoformat(),
                'temperature': item['main']['temp'],
                'humidity': item['main']['humidity'],
                'pressure': item['main']['pressure'],
                'wind_speed': item.get('wind', {}).get('speed', 0),
                'rainfall_3h': rainfall,
                'description': item['weather'][0]['description']
            }
            forecasts.append(forecast_item)
        
        return {
            'status': 'success',
            'location': {
                'name': data['city']['name'],
                'country': data['city']['country'],
                'coordinates': data['city']['coord']
            },
            'forecasts': forecasts,
            'daily_rainfall': daily_rainfall,
            'total_forecast_rainfall': sum(daily_rainfall.values()),
            'timestamp': datetime.now().isoformat()
        }
        
    except requests.RequestException as e:
        logger.error(f"OpenWeatherMap forecast request failed: {e}")
        return {
            'status': 'error',
            'message': f"Failed to fetch forecast data: {str(e)}"
        }
    except Exception as e:
        logger.error(f"Error processing forecast data: {e}")
        return {
            'status': 'error',
            'message': f"Error processing forecast data: {str(e)}"
        }

def get_historical_rainfall_estimates(lat: float, lon: float, current_month: int, current_year: int) -> List[float]:
    """Get estimated historical rainfall data for the flood model
    
    Since OpenWeatherMap doesn't provide comprehensive historical data for free,
    this function provides estimates based on geographic patterns and current conditions.
    For production use, consider upgrading to a paid weather API with historical data.
    """
    # Base rainfall patterns by latitude (simplified climatology)
    abs_lat = abs(lat)
    
    # Tropical regions (high rainfall)
    if abs_lat < 23.5:
        base_monthly = [180, 160, 200, 220, 250, 280, 300, 290, 270, 240, 200, 190]
    # Subtropical regions (moderate rainfall with seasonal variation)
    elif abs_lat < 40:
        base_monthly = [80, 70, 90, 110, 130, 120, 100, 90, 85, 95, 85, 80]
    # Temperate regions (lower rainfall, seasonal)
    else:
        base_monthly = [50, 45, 60, 70, 80, 85, 90, 85, 75, 65, 55, 50]
    
    # Adjust based on longitude (continental vs oceanic influences)
    oceanic_factor = 1.2 if abs(lon) > 20 else 0.8  # Simplified oceanic influence
    
    # Apply random variation to simulate real-world variability
    monthly_rainfall = []
    for i, base_rain in enumerate(base_monthly):
        # Add seasonal and random variation
        variation = random.uniform(0.7, 1.3)
        adjusted_rain = base_rain * oceanic_factor * variation
        monthly_rainfall.append(round(adjusted_rain, 1))
    
    return monthly_rainfall

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great circle distance between two points in kilometers"""
    # Convert latitude and longitude from degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of earth in kilometers
    r = 6371
    
    return c * r

def classify_user_risk_zone(earthquake_lat: float, earthquake_lon: float, 
                           user_lat: float, user_lon: float, 
                           tsunami_predicted: bool, tsunami_probability: float) -> Dict[str, Any]:
    """Classify user risk zone based on distance from earthquake epicenter"""
    
    # Calculate distance between earthquake and user
    distance_km = haversine_distance(earthquake_lat, earthquake_lon, user_lat, user_lon)
    
    # If no tsunami is predicted, risk is minimal regardless of distance
    if not tsunami_predicted or tsunami_probability < 0.3:
        return {
            'risk_zone': 'No Risk',
            'distance_km': round(distance_km, 2),
            'reasoning': 'No tsunami predicted for this earthquake'
        }
    
    # Risk zones based on distance and tsunami probability
    if distance_km <= 100:  # Within 100km
        if tsunami_probability >= 0.7:
            risk_zone = 'High Risk'
        else:
            risk_zone = 'Medium Risk'
    elif distance_km <= 500:  # 100-500km
        if tsunami_probability >= 0.8:
            risk_zone = 'Medium Risk'
        else:
            risk_zone = 'Low Risk'
    elif distance_km <= 1000:  # 500-1000km
        if tsunami_probability >= 0.8:
            risk_zone = 'Low Risk'
        else:
            risk_zone = 'No Risk'
    else:  # > 1000km
        risk_zone = 'No Risk'
    
    return {
        'risk_zone': risk_zone,
        'distance_km': round(distance_km, 2),
        'reasoning': f'Distance: {round(distance_km, 2)}km, Tsunami probability: {round(tsunami_probability * 100, 1)}%'
    }

def get_models_path():
    """Dynamically find models directory"""
    # Try multiple possible locations for models
    possible_paths = [
        os.path.join(os.path.dirname(__file__), "models"),           # ./models
        os.path.join(os.path.dirname(__file__), "..", "src", "models"),  # ../src/models
        os.path.join(os.path.dirname(__file__), "..", "models"),     # ../models
        "models",                                                     # Current working directory
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            logger.info(f"Found models directory at: {path}")
            return path
    
    logger.warning("Models directory not found in any expected location")
    return "models"  # Default fallback

def load_models():
    """Load ML models at startup"""
    try:
        models_path = get_models_path()
        logger.info(f"Loading models from: {models_path}")
        
        # Load tsunami predictor
        tsunami_path = os.path.join(models_path, "tsunami_predictor_model.pkl")
        if os.path.exists(tsunami_path):
            with open(tsunami_path, 'rb') as f:
                tsunami_data = pickle.load(f)
                models['tsunami'] = tsunami_data['model']
                model_metadata['tsunami'] = {
                    'scaler': tsunami_data['scaler'],
                    'feature_columns': tsunami_data['feature_columns'],
                    'label_encoders': tsunami_data.get('label_encoders', {}),
                    'model_name': tsunami_data.get('model_name', 'Tsunami Predictor'),
                    'performance': tsunami_data.get('performance_metrics', {})
                }
                logger.info("✅ Tsunami predictor loaded successfully")
        else:
            logger.warning(f"Tsunami model not found at: {tsunami_path}")
        
        # Load cyclone predictor (with error handling)
        cyclone_path = os.path.join(models_path, "cyclone_intensity_predictor_improved.pkl")
        if os.path.exists(cyclone_path):
            try:
                with open(cyclone_path, 'rb') as f:
                    cyclone_data = pickle.load(f)
                    models['cyclone'] = cyclone_data
                    logger.info("✅ Cyclone intensity predictor loaded")
            except Exception as e:
                logger.warning(f"⚠️ Cyclone model format issue: {e}")
        else:
            logger.warning(f"Cyclone model not found at: {cyclone_path}")
        
        # Load flood predictor
        flood_path = os.path.join(models_path, "best_flood_prediction_lr_model.pkl")
        if os.path.exists(flood_path):
            try:
                with open(flood_path, 'rb') as f:
                    flood_model = pickle.load(f)
                    models['flood'] = flood_model
                    model_metadata['flood'] = {
                        'model_name': 'Flood Prediction Model',
                        'model_type': 'Logistic Regression',
                        'feature_columns': ['YEAR', 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                                          'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
                        'features_description': 'Year and monthly rainfall data (mm)',
                        'target': 'Flood occurrence probability'
                    }
                    logger.info("✅ Flood predictor loaded successfully")
            except Exception as e:
                logger.warning(f"⚠️ Flood model loading error: {e}")
        else:
            logger.warning(f"Flood model not found at: {flood_path}")
                
    except Exception as e:
        logger.error(f"❌ Error loading models: {e}")

# Pydantic models for API
class TsunamiInput(BaseModel):
    """Simple tsunami prediction input"""
    magnitude: float = Field(..., ge=1.0, le=10.0, description="Earthquake magnitude (1.0-10.0)")
    depth: float = Field(..., ge=0.0, le=700.0, description="Earthquake depth in km (0-700)")
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude in degrees")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude in degrees")

# class TsunamiAdvancedInput(BaseModel):
#     """Advanced tsunami prediction with full feature control"""
#     eq_magnitude: float = Field(..., description="Earthquake magnitude")
#     eq_depth: float = Field(..., description="Earthquake depth in km")
#     latitude: float = Field(..., description="Latitude")
#     longitude: float = Field(..., description="Longitude")
#     mag_squared: Optional[float] = Field(None, description="Magnitude squared (auto-calculated)")
#     is_major_eq: Optional[int] = Field(None, description="1 if magnitude >= 7.0")
#     is_shallow: Optional[int] = Field(None, description="1 if depth <= 70km")
#     is_oceanic: Optional[int] = Field(None, description="1 if oceanic location")
#     risk_zone_encoded: Optional[int] = Field(0, description="Risk zone category (0-4)")
#     mag_category_encoded: Optional[int] = Field(0, description="Magnitude category")
#     depth_category_encoded: Optional[int] = Field(0, description="Depth category")

class CycloneInput(BaseModel):
    """Cyclone prediction input"""
    features: List[float] = Field(..., description="Feature array for cyclone prediction")

class PredictionResponse(BaseModel):
    """Standard prediction response"""
    prediction: Any
    confidence: Optional[float] = None
    risk_level: Optional[str] = None
    model_used: str
    input_features: Optional[Dict] = None
    timestamp: Optional[str] = None

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    models_loaded: int
    available_models: List[str]
    uptime: Optional[str] = None

class UserLocationInput(BaseModel):
    """User location input for risk assessment"""
    latitude: float = Field(..., ge=-90.0, le=90.0, description="User latitude in degrees")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="User longitude in degrees")
    feed_type: Optional[str] = Field('past_day_m45', description="USGS feed type to check")

class CycloneRiskInput(BaseModel):
    """Cyclone risk assessment input"""
    latitude: float = Field(..., ge=-90.0, le=90.0, description="User latitude in degrees")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="User longitude in degrees")
    address: Optional[str] = Field(None, description="Optional address for the location")

class WeatherData(BaseModel):
    """Weather data for cyclone assessment"""
    pressure: float = Field(..., description="Atmospheric pressure in hPa")
    wind_speed: float = Field(..., description="Wind speed in m/s")
    wind_direction: float = Field(..., description="Wind direction in degrees")
    temperature: float = Field(..., description="Temperature in Celsius")
    humidity: float = Field(..., description="Humidity percentage")
    visibility: float = Field(..., description="Visibility in km")

class CyclonePredictionResult(BaseModel):
    """Cyclone prediction result"""
    prediction: bool = Field(..., description="Whether cyclone formation is predicted")
    risk_level: str = Field(..., description="Risk level assessment")
    confidence: float = Field(..., description="Prediction confidence (0-1)")
    predicted_wind_speed: float = Field(..., description="Predicted wind speed in m/s")
    risk_factors: Dict[str, str] = Field(..., description="Risk factor analysis")

class CycloneAssessment(BaseModel):
    """Complete cyclone risk assessment response"""
    location: Dict[str, Any] = Field(..., description="Location information")
    weather_data: WeatherData = Field(..., description="Current weather conditions")
    cyclone_prediction: CyclonePredictionResult = Field(..., description="Cyclone prediction results")
    recommendations: List[str] = Field(..., description="Safety recommendations")
    monitoring_advice: List[str] = Field(..., description="Monitoring guidance")
    data_source: str = Field(..., description="Data source information")
    timestamp: str = Field(..., description="Assessment timestamp")

class EarthquakeData(BaseModel):
    """Individual earthquake data structure"""
    id: str
    magnitude: float
    depth: float
    latitude: float
    longitude: float
    place: str
    time: int
    tsunami_flag: int

class UserRiskAssessment(BaseModel):
    """User risk assessment response"""
    user_location: Dict[str, float]
    earthquake_count: int
    earthquakes_analyzed: List[Dict[str, Any]]
    highest_risk: Dict[str, Any]
    overall_status: str
    recommendations: List[str]
    feed_info: Dict[str, Any]
    timestamp: str

class FloodRiskInput(BaseModel):
    """Flood risk assessment input"""
    latitude: float = Field(..., ge=-90.0, le=90.0, description="User latitude in degrees")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="User longitude in degrees")
    address: Optional[str] = Field(None, description="Optional address for the location")
    year: Optional[int] = Field(None, description="Target year for prediction (defaults to current year)")
    use_forecast: Optional[bool] = Field(True, description="Whether to use weather forecast data")

class FloodPredictionInput(BaseModel):
    """Direct flood prediction input with manual rainfall data"""
    year: int = Field(..., ge=1900, le=2100, description="Year for prediction")
    monthly_rainfall: List[float] = Field(..., min_length=12, max_length=12, 
                                        description="Monthly rainfall data in mm [Jan, Feb, ..., Dec]")

class RainfallData(BaseModel):
    """Rainfall data structure"""
    monthly_totals: List[float] = Field(..., description="Monthly rainfall totals in mm")
    annual_total: float = Field(..., description="Total annual rainfall in mm")
    wettest_month: Dict[str, Any] = Field(..., description="Information about wettest month")
    driest_month: Dict[str, Any] = Field(..., description="Information about driest month")
    seasonal_pattern: str = Field(..., description="Seasonal rainfall pattern description")

class FloodPredictionResult(BaseModel):
    """Flood prediction result"""
    flood_probability: float = Field(..., description="Probability of flood occurrence (0-1)")
    prediction: bool = Field(..., description="Binary flood prediction")
    risk_level: str = Field(..., description="Risk level assessment")
    confidence: float = Field(..., description="Model confidence in prediction")
    contributing_factors: Dict[str, Any] = Field(..., description="Factors contributing to flood risk")

class FloodAssessment(BaseModel):
    """Complete flood risk assessment response"""
    location: Dict[str, Any] = Field(..., description="Location information")
    current_weather: Optional[Dict[str, Any]] = Field(None, description="Current weather conditions")
    forecast_data: Optional[Dict[str, Any]] = Field(None, description="Weather forecast data")
    rainfall_analysis: RainfallData = Field(..., description="Rainfall data analysis")
    flood_prediction: FloodPredictionResult = Field(..., description="Flood prediction results")
    recommendations: List[str] = Field(..., description="Safety recommendations")
    monitoring_advice: List[str] = Field(..., description="Monitoring guidance")
    data_source: str = Field(..., description="Data source information")
    timestamp: str = Field(..., description="Assessment timestamp")

# Utility functions
def engineer_tsunami_features(input_data: TsunamiInput) -> List[float]:
    """Convert simple earthquake parameters to full feature set"""
    
    # Basic features
    eq_magnitude = input_data.magnitude
    eq_depth = input_data.depth
    latitude = input_data.latitude
    longitude = input_data.longitude
    
    # Engineered features
    mag_squared = eq_magnitude ** 2
    is_major_eq = 1 if eq_magnitude >= 7.0 else 0
    is_shallow = 1 if eq_depth <= 70 else 0
    
    # Oceanic detection (simplified geographic heuristic)
    def is_oceanic_location(lat, lon):
        # Major continental boundaries (simplified)
        continental_regions = [
            (25, 70, -160, -50),   # North America
            (35, 75, -10, 180),    # Europe/Asia
            (-35, 35, -20, 55),    # Africa
            (-45, -10, 110, 155),  # Australia
            (-55, 15, -85, -30),   # South America
        ]
        
        for min_lat, max_lat, min_lon, max_lon in continental_regions:
            if min_lat <= lat <= max_lat and min_lon <= lon <= max_lon:
                return 0  # Continental
        return 1  # Oceanic
    
    is_oceanic_flag = is_oceanic_location(latitude, longitude)
    
    # Simplified categorical encodings
    risk_zone_encoded = min(4, max(0, int(eq_magnitude - 4)))  # 0-4 scale
    mag_category_encoded = min(4, max(0, int(eq_magnitude - 4)))
    depth_category_encoded = 0 if eq_depth <= 70 else 1
    
    return [
        eq_magnitude,
        eq_depth,
        latitude,
        longitude,
        mag_squared,
        is_major_eq,
        is_shallow,
        is_oceanic_flag,
        risk_zone_encoded,
        mag_category_encoded,
        depth_category_encoded
    ]

def determine_risk_level(confidence: float) -> str:
    """Determine risk level from prediction confidence"""
    if confidence >= 0.7:
        return "High"
    elif confidence >= 0.3:
        return "Medium"
    else:
        return "Low"

def generate_simulated_weather_data(lat: float, lon: float) -> WeatherData:
    """Generate realistic weather data based on location (simulation for demo)"""
    
    # Base weather on geographic location for realism
    # Tropical regions (closer to equator) tend to have:
    # - Lower pressure
    # - Higher humidity
    # - Higher temperatures
    
    abs_lat = abs(lat)
    
    # Temperature varies by latitude
    if abs_lat < 23.5:  # Tropical
        base_temp = random.uniform(26, 32)
        base_humidity = random.uniform(70, 90)
        base_pressure = random.uniform(1008, 1015)
    elif abs_lat < 40:  # Subtropical
        base_temp = random.uniform(20, 28)
        base_humidity = random.uniform(50, 75)
        base_pressure = random.uniform(1010, 1018)
    else:  # Temperate
        base_temp = random.uniform(10, 22)
        base_humidity = random.uniform(40, 70)
        base_pressure = random.uniform(1012, 1020)
    
    # Coastal areas tend to have higher wind speeds
    is_coastal = abs_lat < 60 and abs(lon) > 0  # Simplified coastal detection
    base_wind = random.uniform(5, 15) if is_coastal else random.uniform(2, 8)
    
    return WeatherData(
        pressure=round(base_pressure, 1),
        wind_speed=round(base_wind, 1),
        wind_direction=round(random.uniform(0, 360), 0),
        temperature=round(base_temp, 1),
        humidity=round(base_humidity, 1),
        visibility=round(random.uniform(8, 25), 1)
    )

def assess_cyclone_risk_from_weather(weather: WeatherData, lat: float, lon: float) -> CyclonePredictionResult:
    """Assess cyclone risk based on weather conditions and location"""
    
    # Cyclone formation conditions:
    # 1. Low pressure (< 1010 hPa is concerning)
    # 2. High wind speeds (> 20 m/s indicates strong system)
    # 3. Tropical/subtropical location (cyclones form in warm waters)
    # 4. High humidity (> 80% supports storm development)
    
    abs_lat = abs(lat)
    
    # Geographic risk factors
    if abs_lat > 30:
        geographic_risk = 0.1  # Very low cyclone risk in temperate zones
    elif abs_lat > 23.5:
        geographic_risk = 0.4  # Moderate risk in subtropical zones
    else:
        geographic_risk = 0.8  # High risk in tropical zones
    
    # Pressure risk factor
    if weather.pressure < 1000:
        pressure_risk = 0.9
        pressure_factor = "Extremely low pressure - high cyclone potential"
    elif weather.pressure < 1005:
        pressure_risk = 0.7
        pressure_factor = "Very low pressure - elevated cyclone risk"
    elif weather.pressure < 1010:
        pressure_risk = 0.4
        pressure_factor = "Low pressure - moderate cyclone risk"
    else:
        pressure_risk = 0.1
        pressure_factor = "Normal pressure - low cyclone risk"
    
    # Wind risk factor
    if weather.wind_speed > 25:
        wind_risk = 0.8
        wind_factor = "Very high winds - active storm system"
    elif weather.wind_speed > 15:
        wind_risk = 0.5
        wind_factor = "High winds - developing weather system"
    elif weather.wind_speed > 10:
        wind_risk = 0.3
        wind_factor = "Moderate winds - some storm activity"
    else:
        wind_risk = 0.1
        wind_factor = "Light winds - calm conditions"
    
    # Humidity factor (high humidity supports cyclone development)
    humidity_factor = min(1.0, weather.humidity / 100)
    
    # Combined risk assessment
    combined_risk = (
        geographic_risk * 0.3 +
        pressure_risk * 0.4 +
        wind_risk * 0.2 +
        humidity_factor * 0.1
    )
    
    # Predict wind speed based on pressure and current conditions
    if weather.pressure < 1000:
        predicted_wind = weather.wind_speed * 1.5 + random.uniform(10, 20)
    elif weather.pressure < 1005:
        predicted_wind = weather.wind_speed * 1.3 + random.uniform(5, 15)
    else:
        predicted_wind = weather.wind_speed * 1.1 + random.uniform(0, 5)
    
    predicted_wind = max(predicted_wind, weather.wind_speed)  # Can't be less than current
    
    # Determine risk level and prediction
    if combined_risk >= 0.7:
        risk_level = "Extreme Risk"
        prediction = True
    elif combined_risk >= 0.5:
        risk_level = "High Risk"
        prediction = True
    elif combined_risk >= 0.3:
        risk_level = "Moderate Risk"
        prediction = combined_risk > 0.4  # Some chance of cyclone
    elif combined_risk >= 0.15:
        risk_level = "Low Risk"
        prediction = False
    else:
        risk_level = "No Risk"
        prediction = False
    
    return CyclonePredictionResult(
        prediction=prediction,
        risk_level=risk_level,
        confidence=round(combined_risk, 3),
        predicted_wind_speed=round(predicted_wind, 1),
        risk_factors={
            "pressure_factor": pressure_factor,
            "wind_factor": wind_factor,
            "combined_assessment": f"Geographic risk: {geographic_risk:.1f}, Combined risk score: {combined_risk:.3f}"
        }
    )

def generate_cyclone_recommendations(prediction: CyclonePredictionResult, weather: WeatherData) -> tuple:
    """Generate safety recommendations and monitoring advice based on cyclone risk"""
    
    recommendations = []
    monitoring_advice = []
    
    if prediction.risk_level == "Extreme Risk":
        recommendations = [
            "🚨 EXTREME CYCLONE RISK - Take immediate protective action",
            "Evacuate to a sturdy shelter or move inland immediately",
            "Secure all outdoor items and board up windows",
            "Stock up on emergency supplies (water, food, batteries)",
            "Stay indoors and avoid travel",
            "Monitor emergency broadcasts continuously"
        ]
        monitoring_advice = [
            "Monitor local emergency services alerts",
            "Keep weather radio or app updated",
            "Track storm path and intensity changes",
            "Have evacuation route planned"
        ]
    elif prediction.risk_level == "High Risk":
        recommendations = [
            "⚠️ HIGH CYCLONE RISK - Prepare for severe weather",
            "Secure loose outdoor items",
            "Check emergency supplies and communication devices",
            "Avoid unnecessary travel",
            "Stay away from coastal areas and elevated locations",
            "Monitor weather conditions closely"
        ]
        monitoring_advice = [
            "Check weather updates every 2-3 hours",
            "Monitor wind speed and pressure changes",
            "Watch for official evacuation orders",
            "Keep emergency contacts ready"
        ]
    elif prediction.risk_level == "Moderate Risk":
        recommendations = [
            "⚠️ MODERATE CYCLONE RISK - Stay alert",
            "Monitor weather conditions regularly",
            "Prepare emergency kit just in case",
            "Avoid outdoor activities if weather worsens",
            "Stay informed about weather developments"
        ]
        monitoring_advice = [
            "Check weather updates every 6 hours",
            "Watch for rapid pressure drops",
            "Monitor wind speed increases",
            "Stay tuned to local weather alerts"
        ]
    elif prediction.risk_level == "Low Risk":
        recommendations = [
            "Low cyclone risk - Normal precautions sufficient",
            "Continue regular activities with weather awareness",
            "Have basic emergency supplies available",
            "Stay informed about weather changes"
        ]
        monitoring_advice = [
            "Check weather updates daily",
            "Be aware of changing conditions",
            "Monitor for any advisories"
        ]
    else:  # No Risk
        recommendations = [
            "✅ No cyclone risk detected",
            "Normal weather activities can continue",
            "Maintain general weather awareness",
            "Enjoy outdoor activities as planned"
        ]
        monitoring_advice = [
            "Regular weather check sufficient",
            "No special monitoring required",
            "Stay generally informed about weather"
        ]
    
    return recommendations, monitoring_advice

def prepare_flood_features(year: int, monthly_rainfall: List[float]) -> np.ndarray:
    """Prepare features for flood prediction model
    
    The flood model expects: [YEAR, JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC]
    """
    if len(monthly_rainfall) != 12:
        raise ValueError("Monthly rainfall data must contain exactly 12 values (Jan-Dec)")
    
    # Combine year with monthly rainfall data
    features = [year] + monthly_rainfall
    return np.array(features).reshape(1, -1)

def analyze_rainfall_patterns(monthly_rainfall: List[float]) -> RainfallData:
    """Analyze rainfall patterns and provide insights"""
    month_names = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December']
    
    annual_total = sum(monthly_rainfall)
    
    # Find wettest and driest months
    max_rainfall = max(monthly_rainfall)
    min_rainfall = min(monthly_rainfall)
    wettest_month_idx = monthly_rainfall.index(max_rainfall)
    driest_month_idx = monthly_rainfall.index(min_rainfall)
    
    # Determine seasonal pattern
    q1_avg = sum(monthly_rainfall[0:3]) / 3  # Jan-Mar
    q2_avg = sum(monthly_rainfall[3:6]) / 3  # Apr-Jun
    q3_avg = sum(monthly_rainfall[6:9]) / 3  # Jul-Sep
    q4_avg = sum(monthly_rainfall[9:12]) / 3  # Oct-Dec
    
    seasonal_totals = [q1_avg, q2_avg, q3_avg, q4_avg]
    peak_season_idx = seasonal_totals.index(max(seasonal_totals))
    
    seasonal_patterns = [
        "Winter-dominant (Q1: Jan-Mar)",
        "Spring-dominant (Q2: Apr-Jun)", 
        "Summer-dominant (Q3: Jul-Sep)",
        "Autumn-dominant (Q4: Oct-Dec)"
    ]
    
    return RainfallData(
        monthly_totals=monthly_rainfall,
        annual_total=round(annual_total, 1),
        wettest_month={
            "month": month_names[wettest_month_idx],
            "month_number": wettest_month_idx + 1,
            "rainfall_mm": round(max_rainfall, 1)
        },
        driest_month={
            "month": month_names[driest_month_idx],
            "month_number": driest_month_idx + 1,
            "rainfall_mm": round(min_rainfall, 1)
        },
        seasonal_pattern=seasonal_patterns[peak_season_idx]
    )

def assess_flood_risk_factors(year: int, monthly_rainfall: List[float], 
                             flood_probability: float) -> Dict[str, Any]:
    """Analyze factors contributing to flood risk"""
    annual_total = sum(monthly_rainfall)
    max_monthly = max(monthly_rainfall)
    avg_monthly = annual_total / 12
    
    # Risk factor analysis
    factors = {
        "annual_rainfall_total": f"{annual_total:.1f}mm ({'High' if annual_total > 1200 else 'Moderate' if annual_total > 600 else 'Low'} total)",
        "peak_monthly_rainfall": f"{max_monthly:.1f}mm ({'Extreme' if max_monthly > 300 else 'High' if max_monthly > 150 else 'Moderate'} peak)",
        "rainfall_consistency": f"Average: {avg_monthly:.1f}mm/month",
        "year_factor": f"Year {year} analysis",
        "flood_probability_category": (
            "Very High" if flood_probability > 0.8 else
            "High" if flood_probability > 0.6 else
            "Moderate" if flood_probability > 0.4 else
            "Low" if flood_probability > 0.2 else
            "Very Low"
        )
    }
    
    # Seasonal risk assessment
    seasonal_risks = []
    if max_monthly > 250:
        seasonal_risks.append("Extreme precipitation events detected")
    if annual_total > 1500:
        seasonal_risks.append("Very high annual rainfall volume")
    if any(rain > 200 for rain in monthly_rainfall[:3]):  # Q1
        seasonal_risks.append("High winter/early spring rainfall")
    if any(rain > 200 for rain in monthly_rainfall[5:8]):  # Q3
        seasonal_risks.append("High summer monsoon activity")
    
    factors["seasonal_risk_indicators"] = seasonal_risks if seasonal_risks else ["No extreme seasonal patterns detected"]
    
    return factors

def generate_flood_recommendations(prediction_result: FloodPredictionResult, 
                                 rainfall_data: RainfallData) -> tuple:
    """Generate safety recommendations and monitoring advice for flood risk"""
    
    recommendations = []
    monitoring_advice = []
    
    if prediction_result.risk_level == "High":
        recommendations = [
            "🚨 HIGH FLOOD RISK - Take immediate precautions",
            "Avoid low-lying areas and flood-prone zones",
            "Prepare emergency evacuation plan",
            "Stock emergency supplies (water, food, flashlight, battery radio)",
            "Move vehicles to higher ground",
            "Monitor local emergency services alerts",
            "Avoid driving through flooded roads"
        ]
        monitoring_advice = [
            "Monitor weather alerts continuously",
            "Track river/stream levels in your area",
            "Watch for flash flood warnings",
            "Keep emergency contacts readily available",
            "Monitor rainfall accumulation hourly"
        ]
    elif prediction_result.risk_level == "Medium":
        recommendations = [
            "⚠️ MODERATE FLOOD RISK - Stay prepared",
            "Avoid unnecessary travel to low-lying areas",
            "Keep emergency kit accessible",
            "Monitor weather conditions closely",
            "Be aware of evacuation routes",
            "Secure outdoor items that could be damaged"
        ]
        monitoring_advice = [
            "Check weather updates every 3-6 hours",
            "Monitor local flood warnings",
            "Watch for rapid rainfall accumulation",
            "Stay informed about river/creek levels"
        ]
    else:  # Low risk
        recommendations = [
            "Low flood risk detected",
            "Normal activities can continue with awareness",
            "Maintain general weather awareness",
            "Keep basic emergency supplies available"
        ]
        monitoring_advice = [
            "Check weather updates daily",
            "Be aware of changing weather patterns",
            "Stay informed about any flood advisories"
        ]
    
    # Add seasonal-specific advice
    if rainfall_data.wettest_month["rainfall_mm"] > 200:
        recommendations.append(f"Special attention during {rainfall_data.wettest_month['month']} (peak rainfall month)")
    
    return recommendations, monitoring_advice

# Dependency for model availability
async def get_tsunami_model():
    if 'tsunami' not in models:
        raise HTTPException(status_code=503, detail="Tsunami model not available")
    return models['tsunami'], model_metadata['tsunami']

async def get_cyclone_model():
    if 'cyclone' not in models:
        raise HTTPException(status_code=503, detail="Cyclone model not available")
    return models['cyclone']

async def get_flood_model():
    if 'flood' not in models:
        raise HTTPException(status_code=503, detail="Flood model not available")
    return models['flood']

# API Routes
@app.get("/", response_model=Dict[str, Any])
async def root():
    """API root endpoint with basic information"""
    return {
        "message": "WaveGuard ML API - Natural Disaster Prediction Service",
        "version": "1.0.0",
        "models_loaded": list(models.keys()),
        "status": "operational",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint for monitoring"""
    return HealthResponse(
        status="healthy" if models else "degraded",
        models_loaded=len(models),
        available_models=list(models.keys())
    )

@app.get("/models/info")
async def get_model_info():
    """Get detailed information about loaded models"""
    info = {}
    
    if 'tsunami' in models:
        tsunami_meta = model_metadata.get('tsunami', {})
        info['tsunami'] = {
            "model_name": tsunami_meta.get('model_name', 'Tsunami Predictor'),
            "features_required": tsunami_meta.get('feature_columns', []),
            "num_features": len(tsunami_meta.get('feature_columns', [])),
            "performance_metrics": tsunami_meta.get('performance', {}),
            "endpoints": ["/predict/tsunami", "/predict/tsunami/advanced"],
            "example_input": {
                "magnitude": 7.5,
                "depth": 25.0,
                "latitude": 38.0,
                "longitude": 142.0
            }
        }
    
    if 'cyclone' in models:
        info['cyclone'] = {
            "model_name": "Cyclone Intensity Predictor",
            "status": "loaded",
            "endpoints": ["/predict/cyclone"],
            "note": "Feature requirements under analysis"
        }
    
    return {"models": info, "total_loaded": len(models)}

@app.post("/predict/tsunami", response_model=PredictionResponse)
async def predict_tsunami(
    input_data: TsunamiInput,
    model_data: tuple = Depends(get_tsunami_model)
):
    """Predict tsunami occurrence from basic earthquake parameters"""
    try:
        model, metadata = model_data
        
        # Engineer features from simple input
        features = engineer_tsunami_features(input_data)
        features_array = np.array(features).reshape(1, -1)
        
        # Scale features using saved scaler
        scaler = metadata['scaler']
        features_scaled = scaler.transform(features_array)
        
        # Make prediction
        prediction = model.predict(features_scaled)
        
        # Get prediction probabilities
        confidence = None
        tsunami_probability = None
        
        if hasattr(model, 'predict_proba'):
            proba = model.predict_proba(features_scaled)
            confidence = float(np.max(proba))
            tsunami_probability = float(proba[0][1]) if len(proba[0]) > 1 else confidence
        
        # Determine risk level
        risk_level = determine_risk_level(tsunami_probability or confidence or 0)
        
        return PredictionResponse(
            prediction=bool(prediction[0]),
            confidence=tsunami_probability or confidence,
            risk_level=risk_level,
            model_used="tsunami_predictor",
            input_features={
                "magnitude": input_data.magnitude,
                "depth": input_data.depth,
                "latitude": input_data.latitude,
                "longitude": input_data.longitude,
                "engineered_features_count": len(features)
            },
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Tsunami prediction error: {e}")
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

# @app.post("/predict/tsunami/advanced", response_model=PredictionResponse)
# async def predict_tsunami_advanced(
#     input_data: TsunamiAdvancedInput,
#     model_data: tuple = Depends(get_tsunami_model)
# ):
#     """Advanced tsunami prediction with full feature control"""
#     try:
#         model, metadata = model_data
        
#         # Build feature array with provided or calculated values
#         features = [
#             input_data.eq_magnitude,
#             input_data.eq_depth,
#             input_data.latitude,
#             input_data.longitude,
#             input_data.mag_squared or (input_data.eq_magnitude ** 2),
#             input_data.is_major_eq if input_data.is_major_eq is not None else (1 if input_data.eq_magnitude >= 7.0 else 0),
#             input_data.is_shallow if input_data.is_shallow is not None else (1 if input_data.eq_depth <= 70 else 0),
#             input_data.is_oceanic or 0,
#             input_data.risk_zone_encoded,
#             input_data.mag_category_encoded,
#             input_data.depth_category_encoded
#         ]
        
#         features_array = np.array(features).reshape(1, -1)
        
#         # Scale features
#         scaler = metadata['scaler']
#         features_scaled = scaler.transform(features_array)
        
#         # Make prediction
#         prediction = model.predict(features_scaled)
        
#         # Get confidence
#         confidence = None
#         if hasattr(model, 'predict_proba'):
#             proba = model.predict_proba(features_scaled)
#             confidence = float(proba[0][1]) if len(proba[0]) > 1 else float(np.max(proba))
        
#         return PredictionResponse(
#             prediction=bool(prediction[0]),
#             confidence=confidence,
#             risk_level=determine_risk_level(confidence or 0),
#             model_used="tsunami_predictor_advanced"
#         )
        
#     except Exception as e:
#         logger.error(f"Advanced tsunami prediction error: {e}")
#         raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

@app.post("/predict/cyclone", response_model=PredictionResponse)
async def predict_cyclone(
    input_data: CycloneInput,
    model = Depends(get_cyclone_model)
):
    """Predict cyclone intensity"""
    try:
        # Convert input to numpy array
        features = np.array(input_data.features).reshape(1, -1)
        
        # Make prediction
        prediction = model.predict(features)
        
        # Get confidence if available
        confidence = None
        if hasattr(model, 'predict_proba'):
            proba = model.predict_proba(features)
            confidence = float(np.max(proba))
        
        return PredictionResponse(
            prediction=prediction.tolist()[0],
            confidence=confidence,
            model_used="cyclone_intensity_predictor"
        )
        
    except Exception as e:
        logger.error(f"Cyclone prediction error: {e}")
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

@app.post("/assess/tsunami-risk", response_model=UserRiskAssessment)
async def assess_tsunami_risk(
    user_input: UserLocationInput,
    model_data: tuple = Depends(get_tsunami_model)
):
    """Assess tsunami risk for user location based on recent earthquakes"""
    try:
        model, metadata = model_data
        
        # Fetch recent earthquake data from USGS
        earthquake_data = fetch_usgs_earthquake_data(user_input.feed_type) # type: ignore
        
        if earthquake_data['status'] == 'error':
            raise HTTPException(status_code=503, detail=f"USGS API error: {earthquake_data['message']}")
        
        earthquakes = earthquake_data['earthquakes']
        
        # Handle case when no earthquakes are found
        if earthquake_data['count'] == 0:
            return UserRiskAssessment(
                user_location={
                    "latitude": user_input.latitude,
                    "longitude": user_input.longitude
                },
                earthquake_count=0,
                earthquakes_analyzed=[],
                highest_risk={
                    "risk_zone": "No Risk",
                    "distance_km": 0,
                    "reasoning": "No recent earthquakes found in the selected timeframe"
                },
                overall_status="All Clear",
                recommendations=[
                    "No recent significant earthquakes detected",
                    "Continue normal activities",
                    "Stay informed about earthquake alerts"
                ],
                feed_info={
                    "feed_type": user_input.feed_type,
                    "source": "USGS",
                    "last_updated": datetime.now().isoformat()
                },
                timestamp=datetime.now().isoformat()
            )
        
        # Analyze each earthquake for tsunami risk
        analyzed_earthquakes = []
        max_risk_level = "No Risk"
        max_risk_earthquake = None
        
        for eq in earthquakes:
            # Skip earthquakes with invalid data
            if not all([eq['magnitude'], eq['latitude'], eq['longitude']]):
                continue
                
            # Create TsunamiInput for this earthquake
            eq_input = TsunamiInput(
                magnitude=eq['magnitude'],
                depth=abs(eq['depth']),  # Ensure positive depth
                latitude=eq['latitude'],
                longitude=eq['longitude']
            )
            
            # Engineer features and make prediction
            features = engineer_tsunami_features(eq_input)
            features_array = np.array(features).reshape(1, -1)
            features_scaled = metadata['scaler'].transform(features_array)
            
            # Get tsunami prediction
            tsunami_prediction = model.predict(features_scaled)[0]
            tsunami_probability = 0.0
            
            if hasattr(model, 'predict_proba'):
                proba = model.predict_proba(features_scaled)
                tsunami_probability = float(proba[0][1]) if len(proba[0]) > 1 else float(np.max(proba))
            
            # Calculate user risk zone
            risk_assessment = classify_user_risk_zone(
                eq['latitude'], eq['longitude'],
                user_input.latitude, user_input.longitude,
                bool(tsunami_prediction), tsunami_probability
            )
            
            # Track the highest risk earthquake
            risk_levels = {"No Risk": 0, "Low Risk": 1, "Medium Risk": 2, "High Risk": 3}
            if risk_levels.get(risk_assessment['risk_zone'], 0) > risk_levels.get(max_risk_level, 0):
                max_risk_level = risk_assessment['risk_zone']
                max_risk_earthquake = {
                    **risk_assessment,
                    'earthquake': {
                        'id': eq['id'],
                        'magnitude': eq['magnitude'],
                        'depth': eq['depth'],
                        'latitude': eq['latitude'],
                        'longitude': eq['longitude'],
                        'place': eq['place'],
                        'tsunami_prediction': bool(tsunami_prediction),
                        'tsunami_probability': tsunami_probability
                    }
                }
            
            # Add to analyzed earthquakes
            analyzed_earthquakes.append({
                'earthquake': {
                    'id': eq['id'],
                    'magnitude': eq['magnitude'],
                    'depth': eq['depth'],
                    'latitude': eq['latitude'],
                    'longitude': eq['longitude'],
                    'place': eq['place']
                },
                'tsunami_prediction': bool(tsunami_prediction),
                'tsunami_probability': round(tsunami_probability, 3),
                'user_risk': risk_assessment
            })
        
        # Determine overall status
        if max_risk_level == "High Risk":
            overall_status = "High Alert"
            recommendations = [
                "⚠️ HIGH TSUNAMI RISK detected nearby",
                "Move to higher ground immediately",
                "Stay away from coastal areas",
                "Monitor emergency broadcasts",
                "Have emergency supplies ready"
            ]
        elif max_risk_level == "Medium Risk":
            overall_status = "Elevated Alert"
            recommendations = [
                "⚠️ MODERATE TSUNAMI RISK detected",
                "Stay alert and avoid beaches",
                "Monitor official tsunami warnings",
                "Be prepared to evacuate if advised",
                "Keep emergency kit accessible"
            ]
        elif max_risk_level == "Low Risk":
            overall_status = "Advisory"
            recommendations = [
                "Low tsunami risk detected",
                "Stay informed about updates",
                "Normal activities can continue",
                "Be aware of tsunami evacuation routes"
            ]
        else:
            overall_status = "All Clear"
            recommendations = [
                "No significant tsunami risk detected",
                "Continue normal activities",
                "Stay informed about earthquake alerts"
            ]
        
        return UserRiskAssessment(
            user_location={
                "latitude": user_input.latitude,
                "longitude": user_input.longitude
            },
            earthquake_count=len(analyzed_earthquakes),
            earthquakes_analyzed=analyzed_earthquakes,
            highest_risk=max_risk_earthquake or {
                "risk_zone": "No Risk",
                "distance_km": 0,
                "reasoning": "No earthquakes with tsunami potential found"
            },
            overall_status=overall_status,
            recommendations=recommendations,
            feed_info={
                "feed_type": user_input.feed_type,
                "source": "USGS",
                "total_earthquakes_in_feed": earthquake_data['count'],
                "last_updated": datetime.now().isoformat()
            },
            timestamp=datetime.now().isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Risk assessment error: {e}")
        raise HTTPException(status_code=500, detail=f"Risk assessment failed: {str(e)}")

@app.post("/assess/cyclone-risk", response_model=CycloneAssessment)
async def assess_cyclone_risk(input_data: CycloneRiskInput):
    """Assess cyclone risk for a given location based on weather conditions"""
    try:
        logger.info(f"Assessing cyclone risk for location: {input_data.latitude}, {input_data.longitude}")
        
        # Generate simulated weather data for the location
        weather_data = generate_simulated_weather_data(input_data.latitude, input_data.longitude)
        
        # Assess cyclone risk based on weather conditions
        cyclone_prediction = assess_cyclone_risk_from_weather(weather_data, input_data.latitude, input_data.longitude)
        
        # Generate recommendations and monitoring advice
        recommendations, monitoring_advice = generate_cyclone_recommendations(cyclone_prediction, weather_data)
        
        # Create the assessment response
        assessment = CycloneAssessment(
            location={
                "latitude": input_data.latitude,
                "longitude": input_data.longitude,
                "address": input_data.address
            },
            weather_data=weather_data,
            cyclone_prediction=cyclone_prediction,
            recommendations=recommendations,
            monitoring_advice=monitoring_advice,
            data_source="Simulated Weather Data + Geographic Analysis",
            timestamp=datetime.now().isoformat()
        )
        
        logger.info(f"Cyclone assessment completed: {cyclone_prediction.risk_level} (confidence: {cyclone_prediction.confidence})")
        return assessment
        
    except Exception as e:
        logger.error(f"Cyclone risk assessment error: {e}")
        raise HTTPException(status_code=500, detail=f"Cyclone risk assessment failed: {str(e)}")

@app.get("/earthquakes/{feed_type}")
async def get_earthquake_feed(feed_type: str):
    """Get recent earthquake data from USGS feeds"""
    if feed_type not in USGS_FEEDS:
        raise HTTPException(status_code=400, detail=f"Invalid feed type. Available: {list(USGS_FEEDS.keys())}")
    
    earthquake_data = fetch_usgs_earthquake_data(feed_type)
    
    if earthquake_data['status'] == 'error':
        raise HTTPException(status_code=503, detail=earthquake_data['message'])
    
    return earthquake_data

@app.post("/predict/flood", response_model=PredictionResponse)
async def predict_flood(
    input_data: FloodPredictionInput,
    model = Depends(get_flood_model)
):
    """Predict flood occurrence from rainfall data"""
    try:
        # Prepare features for the model
        features = prepare_flood_features(input_data.year, input_data.monthly_rainfall)
        
        # Make prediction
        prediction = model.predict(features)
        
        # Get prediction probabilities
        confidence = None
        flood_probability = None
        
        if hasattr(model, 'predict_proba'):
            proba = model.predict_proba(features)
            confidence = float(np.max(proba))
            flood_probability = float(proba[0][1]) if len(proba[0]) > 1 else confidence
        
        # Determine risk level
        risk_level = determine_risk_level(flood_probability or confidence or 0)
        
        return PredictionResponse(
            prediction=bool(prediction[0]),
            confidence=flood_probability or confidence,
            risk_level=risk_level,
            model_used="flood_predictor",
            input_features={
                "year": input_data.year,
                "monthly_rainfall": input_data.monthly_rainfall,
                "annual_total": sum(input_data.monthly_rainfall)
            },
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Flood prediction error: {e}")
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

@app.post("/assess/flood-risk", response_model=FloodAssessment)
async def assess_flood_risk(
    input_data: FloodRiskInput,
    model = Depends(get_flood_model)
):
    """Assess flood risk for a given location using weather data and ML prediction"""
    try:
        logger.info(f"Assessing flood risk for location: {input_data.latitude}, {input_data.longitude}")
        
        # Get current year if not provided
        current_year = input_data.year or datetime.now().year
        current_month = datetime.now().month
        
        # Fetch current weather data if OpenWeatherMap API is available
        current_weather = None
        forecast_data = None
        data_sources = []
        
        if OPENWEATHER_API_KEY and input_data.use_forecast:
            # Fetch current weather
            current_weather_result = fetch_openweather_current(input_data.latitude, input_data.longitude)
            if current_weather_result['status'] == 'success':
                current_weather = current_weather_result
                data_sources.append("OpenWeatherMap Current Weather")
            
            # Fetch forecast data
            forecast_result = fetch_openweather_forecast(input_data.latitude, input_data.longitude)
            if forecast_result['status'] == 'success':
                forecast_data = forecast_result
                data_sources.append("OpenWeatherMap 5-day Forecast")
        
        # Get rainfall estimates for the model
        # For now, use historical estimates based on geography
        # In production, you'd integrate with a comprehensive weather data provider
        monthly_rainfall = get_historical_rainfall_estimates(
            input_data.latitude, input_data.longitude, current_month, current_year
        )
        
        # If we have forecast data, adjust current month's rainfall estimate
        if forecast_data and forecast_data['status'] == 'success':
            current_month_idx = current_month - 1  # 0-indexed
            forecast_rainfall = forecast_data.get('total_forecast_rainfall', 0)
            
            # Extrapolate 5-day forecast to monthly estimate
            # This is a rough approximation - in production, use more sophisticated methods
            if forecast_rainfall > 0:
                estimated_monthly = (forecast_rainfall / 5) * 30  # Scale 5 days to 30 days
                monthly_rainfall[current_month_idx] = max(monthly_rainfall[current_month_idx], estimated_monthly)
        
        # Analyze rainfall patterns
        rainfall_analysis = analyze_rainfall_patterns(monthly_rainfall)
        
        # Prepare features and make flood prediction
        features = prepare_flood_features(current_year, monthly_rainfall)
        prediction = model.predict(features)
        
        # Get prediction probabilities
        flood_probability = 0.5  # Default
        model_confidence = 0.5  # Default
        
        if hasattr(model, 'predict_proba'):
            proba = model.predict_proba(features)
            model_confidence = float(np.max(proba))
            flood_probability = float(proba[0][1]) if len(proba[0]) > 1 else model_confidence
        
        # Assess risk factors
        risk_factors = assess_flood_risk_factors(current_year, monthly_rainfall, flood_probability)
        
        # Create flood prediction result
        flood_prediction_result = FloodPredictionResult(
            flood_probability=round(flood_probability, 3),
            prediction=bool(prediction[0]),
            risk_level=determine_risk_level(flood_probability),
            confidence=round(model_confidence, 3),
            contributing_factors=risk_factors
        )
        
        # Generate recommendations
        recommendations, monitoring_advice = generate_flood_recommendations(
            flood_prediction_result, rainfall_analysis
        )
        
        # Prepare data source information
        if not data_sources:
            data_sources.append("Geographic Rainfall Estimates")
        
        # Create comprehensive assessment
        assessment = FloodAssessment(
            location={
                "latitude": input_data.latitude,
                "longitude": input_data.longitude,
                "address": input_data.address
            },
            current_weather=current_weather,
            forecast_data=forecast_data,
            rainfall_analysis=rainfall_analysis,
            flood_prediction=flood_prediction_result,
            recommendations=recommendations,
            monitoring_advice=monitoring_advice,
            data_source=" + ".join(data_sources),
            timestamp=datetime.now().isoformat()
        )
        
        logger.info(f"Flood assessment completed: {flood_prediction_result.risk_level} (probability: {flood_probability:.3f})")
        return assessment
        
    except Exception as e:
        logger.error(f"Flood risk assessment error: {e}")
        raise HTTPException(status_code=500, detail=f"Flood risk assessment failed: {str(e)}")

@app.get("/weather/current/{lat}/{lon}")
async def get_current_weather(lat: float, lon: float):
    """Get current weather data for a location"""
    weather_data = fetch_openweather_current(lat, lon)
    
    if weather_data['status'] == 'error':
        raise HTTPException(status_code=503, detail=weather_data['message'])
    
    return weather_data

@app.get("/weather/forecast/{lat}/{lon}")
async def get_weather_forecast(lat: float, lon: float, days: int = 5):
    """Get weather forecast for a location"""
    if days < 1 or days > 5:
        raise HTTPException(status_code=400, detail="Days must be between 1 and 5")
    
    forecast_data = fetch_openweather_forecast(lat, lon, days)
    
    if forecast_data['status'] == 'error':
        raise HTTPException(status_code=503, detail=forecast_data['message'])
    
    return forecast_data

# Startup event
@app.on_event("startup")
async def startup_event():
    """Load models when the application starts"""
    logger.info("🌊 Starting WaveGuard ML API...")
    load_models()
    logger.info(f"📊 Loaded {len(models)} models: {list(models.keys())}")

# Main execution
if __name__ == "__main__":
    # Configuration for both development and production
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    reload = os.environ.get("ENVIRONMENT", "development") == "development"
    
    logger.info(f"🌊 Starting WaveGuard ML API on {host}:{port}")
    logger.info(f"🔄 Reload mode: {reload}")
    logger.info(f"📚 API documentation: http://{host}:{port}/docs")
    
    uvicorn.run(
        "main:app",  # Use string format for reload to work
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )
