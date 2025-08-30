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

class TsunamiAdvancedInput(BaseModel):
    """Advanced tsunami prediction with full feature control"""
    eq_magnitude: float = Field(..., description="Earthquake magnitude")
    eq_depth: float = Field(..., description="Earthquake depth in km")
    latitude: float = Field(..., description="Latitude")
    longitude: float = Field(..., description="Longitude")
    mag_squared: Optional[float] = Field(None, description="Magnitude squared (auto-calculated)")
    is_major_eq: Optional[int] = Field(None, description="1 if magnitude >= 7.0")
    is_shallow: Optional[int] = Field(None, description="1 if depth <= 70km")
    is_oceanic: Optional[int] = Field(None, description="1 if oceanic location")
    risk_zone_encoded: Optional[int] = Field(0, description="Risk zone category (0-4)")
    mag_category_encoded: Optional[int] = Field(0, description="Magnitude category")
    depth_category_encoded: Optional[int] = Field(0, description="Depth category")

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

@app.post("/predict/tsunami/advanced", response_model=PredictionResponse)
async def predict_tsunami_advanced(
    input_data: TsunamiAdvancedInput,
    model_data: tuple = Depends(get_tsunami_model)
):
    """Advanced tsunami prediction with full feature control"""
    try:
        model, metadata = model_data
        
        # Build feature array with provided or calculated values
        features = [
            input_data.eq_magnitude,
            input_data.eq_depth,
            input_data.latitude,
            input_data.longitude,
            input_data.mag_squared or (input_data.eq_magnitude ** 2),
            input_data.is_major_eq if input_data.is_major_eq is not None else (1 if input_data.eq_magnitude >= 7.0 else 0),
            input_data.is_shallow if input_data.is_shallow is not None else (1 if input_data.eq_depth <= 70 else 0),
            input_data.is_oceanic or 0,
            input_data.risk_zone_encoded,
            input_data.mag_category_encoded,
            input_data.depth_category_encoded
        ]
        
        features_array = np.array(features).reshape(1, -1)
        
        # Scale features
        scaler = metadata['scaler']
        features_scaled = scaler.transform(features_array)
        
        # Make prediction
        prediction = model.predict(features_scaled)
        
        # Get confidence
        confidence = None
        if hasattr(model, 'predict_proba'):
            proba = model.predict_proba(features_scaled)
            confidence = float(proba[0][1]) if len(proba[0]) > 1 else float(np.max(proba))
        
        return PredictionResponse(
            prediction=bool(prediction[0]),
            confidence=confidence,
            risk_level=determine_risk_level(confidence or 0),
            model_used="tsunami_predictor_advanced"
        )
        
    except Exception as e:
        logger.error(f"Advanced tsunami prediction error: {e}")
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

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
