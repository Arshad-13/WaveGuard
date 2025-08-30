"""
Ultra-simple WaveGuard ML API for testing
Uses only Python standard library
"""

import pickle
import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global model storage
models = {}

def get_models_path():
    """Find models directory"""
    possible_paths = [
        os.path.join(os.path.dirname(__file__), "..", "src", "models"),
        os.path.join(os.path.dirname(__file__), "models"),
        "models"
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            logger.info(f"Found models directory at: {path}")
            return path
    
    logger.warning("Models directory not found")
    return "models"

def load_models():
    """Load ML models at startup"""
    try:
        models_path = get_models_path()
        logger.info(f"Loading models from: {models_path}")
        
        # Check for model files
        tsunami_path = os.path.join(models_path, "tsunami_predictor_model.pkl")
        cyclone_path = os.path.join(models_path, "cyclone_intensity_predictor_improved.pkl")
        
        if os.path.exists(tsunami_path):
            logger.info("✅ Found tsunami model file")
            models['tsunami'] = "loaded"
        else:
            logger.warning(f"❌ Tsunami model not found at: {tsunami_path}")
        
        if os.path.exists(cyclone_path):
            logger.info("✅ Found cyclone model file")
            models['cyclone'] = "loaded"
        else:
            logger.warning(f"❌ Cyclone model not found at: {cyclone_path}")
                
    except Exception as e:
        logger.error(f"❌ Error loading models: {e}")

class WaveGuardAPIHandler(BaseHTTPRequestHandler):
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/':
            self.send_json_response({
                "message": "WaveGuard ML API - Natural Disaster Prediction Service",
                "version": "1.0.0-simple",
                "models_found": list(models.keys()),
                "status": "operational",
                "note": "This is a simplified version for testing connectivity",
                "endpoints": {
                    "health": "/health",
                    "tsunami": "/predict/tsunami",
                    "cyclone": "/predict/cyclone"
                }
            })
        elif parsed_path.path == '/health':
            self.send_json_response({
                "status": "healthy" if models else "degraded",
                "models_found": len(models),
                "available_models": list(models.keys()),
                "note": "Models detected but ML dependencies not fully installed"
            })
        else:
            self.send_error_response(404, "Endpoint not found")
    
    def do_POST(self):
        """Handle POST requests"""
        parsed_path = urlparse(self.path)
        
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            if parsed_path.path == '/predict/tsunami':
                self.handle_tsunami_prediction(data)
            elif parsed_path.path == '/predict/cyclone':
                self.handle_cyclone_prediction(data)
            else:
                self.send_error_response(404, "Endpoint not found")
                
        except Exception as e:
            logger.error(f"Request processing error: {e}")
            self.send_error_response(400, f"Request processing failed: {str(e)}")
    
    def handle_tsunami_prediction(self, data):
        """Handle tsunami prediction requests"""
        if 'tsunami' not in models:
            self.send_error_response(503, "Tsunami model not available")
            return
        
        try:
            logger.info(f"Received tsunami prediction request: {data}")
            
            # Extract parameters
            magnitude = data.get('magnitude', 0)
            depth = data.get('depth', 0)
            latitude = data.get('latitude', 0)
            longitude = data.get('longitude', 0)
            
            logger.info(f"Extracted parameters: mag={magnitude}, depth={depth}, lat={latitude}, lon={longitude}")
            
            if not all([magnitude, depth, latitude, longitude]):
                error_msg = f"Missing required parameters: magnitude={magnitude}, depth={depth}, latitude={latitude}, longitude={longitude}"
                logger.error(error_msg)
                self.send_error_response(400, "Missing required parameters: magnitude, depth, latitude, longitude")
                return
            
            # Simple mock prediction logic for testing
            # In real implementation, this would use the loaded model
            is_tsunami_risk = magnitude >= 7.0 and depth <= 50
            confidence = min(0.95, max(0.1, (magnitude - 5.0) / 3.0))
            risk_level = "High" if confidence >= 0.7 else "Medium" if confidence >= 0.3 else "Low"
            
            response = {
                "prediction": is_tsunami_risk,
                "confidence": confidence,
                "risk_level": risk_level,
                "model_used": "tsunami_predictor_mock",
                "note": "This is a mock prediction for testing. Install numpy/scikit-learn for real predictions.",
                "input_features": {
                    "magnitude": magnitude,
                    "depth": depth,
                    "latitude": latitude,
                    "longitude": longitude
                }
            }
            
            self.send_json_response(response)
            
        except Exception as e:
            logger.error(f"Tsunami prediction error: {e}")
            self.send_error_response(400, f"Prediction failed: {str(e)}")
    
    def handle_cyclone_prediction(self, data):
        """Handle cyclone prediction requests"""
        if 'cyclone' not in models:
            self.send_error_response(503, "Cyclone model not available")
            return
        
        try:
            features = data.get('features', [])
            if not features:
                self.send_error_response(400, "Missing required parameter: features")
                return
            
            # Simple mock prediction for testing
            mock_intensity = min(5, max(1, sum(features) / len(features) if features else 1))
            confidence = 0.75
            
            response = {
                "prediction": mock_intensity,
                "confidence": confidence,
                "model_used": "cyclone_predictor_mock",
                "note": "This is a mock prediction for testing. Install numpy/scikit-learn for real predictions."
            }
            
            self.send_json_response(response)
            
        except Exception as e:
            logger.error(f"Cyclone prediction error: {e}")
            self.send_error_response(400, f"Prediction failed: {str(e)}")
    
    def send_json_response(self, data, status_code=200):
        """Send JSON response with CORS headers"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        response_json = json.dumps(data, indent=2)
        self.wfile.write(response_json.encode('utf-8'))
    
    def send_error_response(self, status_code, message):
        """Send error response"""
        self.send_json_response({"error": message, "status_code": status_code}, status_code)
    
    def log_message(self, format, *args):
        """Override to use our logger"""
        logger.info(f"{self.address_string()} - {format % args}")

def main():
    """Start the server"""
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "127.0.0.1")
    
    # Load models
    logger.info("🌊 Starting WaveGuard ML API (Simple Version)...")
    load_models()
    logger.info(f"📊 Found {len(models)} model files: {list(models.keys())}")
    
    # Start server
    server_address = (host, port)
    httpd = HTTPServer(server_address, WaveGuardAPIHandler)
    
    logger.info(f"🌊 WaveGuard ML API running on http://{host}:{port}")
    logger.info(f"📚 API endpoints:")
    logger.info(f"   GET  / - API information")
    logger.info(f"   GET  /health - Health check")
    logger.info(f"   POST /predict/tsunami - Tsunami prediction (mock)")
    logger.info(f"   POST /predict/cyclone - Cyclone prediction (mock)")
    logger.info(f"")
    logger.info(f"⚠️  NOTE: This is a simplified version for testing connectivity.")
    logger.info(f"   Install numpy and scikit-learn for real ML predictions.")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        logger.info("🛑 Shutting down server...")
        httpd.shutdown()

if __name__ == "__main__":
    main()
