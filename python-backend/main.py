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

# Load environment variables
load_dotenv('.env.model')

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

# Dependency for model availability
async def get_tsunami_model():
    if 'tsunami' not in models:
        raise HTTPException(status_code=503, detail="Tsunami model not available")
    return models['tsunami'], model_metadata['tsunami']

async def get_cyclone_model():
    if 'cyclone' not in models:
        raise HTTPException(status_code=503, detail="Cyclone model not available")
    return models['cyclone']

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
        earthquake_data = fetch_usgs_earthquake_data(user_input.feed_type)
        
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

@app.get("/earthquakes/{feed_type}")
async def get_earthquake_feed(feed_type: str):
    """Get recent earthquake data from USGS feeds"""
    if feed_type not in USGS_FEEDS:
        raise HTTPException(status_code=400, detail=f"Invalid feed type. Available: {list(USGS_FEEDS.keys())}")
    
    earthquake_data = fetch_usgs_earthquake_data(feed_type)
    
    if earthquake_data['status'] == 'error':
        raise HTTPException(status_code=503, detail=earthquake_data['message'])
    
    return earthquake_data

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
