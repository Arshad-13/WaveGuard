#!/usr/bin/env python3
"""
WaveGuard Flood Alert Monitor
=============================
This script runs every hour to:
1. Fetch weather data from OpenWeatherMap API
2. Use the trained flood prediction model to assess flood risk
3. Send alerts to the website when flood probability exceeds 64%
4. Log all activities for monitoring and debugging

Usage:
    python flood_alert_monitor.py --lat <latitude> --lon <longitude>
    python flood_alert_monitor.py --config config.json

Environment Variables Required:
    OPENWEATHER_API_KEY: Your OpenWeatherMap API key
    WEBSITE_ALERT_ENDPOINT: URL endpoint to send alerts to your website
"""

import os
import sys
import json
import pickle
import requests
import argparse
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import numpy as np
import schedule
import time
from dataclasses import dataclass
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('flood_alert_monitor.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class LocationConfig:
    """Configuration for a monitoring location"""
    latitude: float
    longitude: float
    location_name: str
    alert_threshold: float = 0.64  # 64% as specified
    check_interval_hours: int = 1

@dataclass
class WeatherData:
    """Weather data structure"""
    temperature: float
    humidity: float
    pressure: float
    wind_speed: float
    wind_direction: float
    visibility: float
    precipitation: float
    clouds: float
    description: str
    timestamp: datetime

@dataclass
class FloodAlert:
    """Flood alert data structure"""
    location: LocationConfig
    flood_probability: float
    risk_level: str
    weather_data: WeatherData
    rainfall_data: List[float]
    timestamp: datetime
    alert_id: str
    message: str

class FloodMonitor:
    """Main flood monitoring class"""
    
    def __init__(self, config_file: Optional[str] = None):
        self.config_file = config_file
        self.locations: List[LocationConfig] = []
        self.flood_model = None
        self.openweather_api_key = os.getenv('OPENWEATHER_API_KEY')
        self.website_alert_endpoint = os.getenv('WEBSITE_ALERT_ENDPOINT', 'http://localhost:3000/api/flood-alerts')
        
        # Load configuration
        self._load_config()
        
        # Load the flood prediction model
        self._load_flood_model()
        
        if not self.openweather_api_key:
            logger.error("OPENWEATHER_API_KEY environment variable not set!")
            logger.info("Please set your OpenWeatherMap API key in the environment or .env file")
            sys.exit(1)
    
    def _load_config(self):
        """Load monitoring configuration"""
        if self.config_file and os.path.exists(self.config_file):
            try:
                with open(self.config_file, 'r') as f:
                    config_data = json.load(f)
                
                for loc_data in config_data.get('locations', []):
                    location = LocationConfig(
                        latitude=loc_data['latitude'],
                        longitude=loc_data['longitude'],
                        location_name=loc_data['name'],
                        alert_threshold=loc_data.get('alert_threshold', 0.64),
                        check_interval_hours=loc_data.get('check_interval_hours', 1)
                    )
                    self.locations.append(location)
                
                logger.info(f"Loaded {len(self.locations)} locations from config file")
            except Exception as e:
                logger.error(f"Error loading config file: {e}")
                sys.exit(1)
        else:
            logger.info("No config file provided, will use command line arguments")
    
    def _load_flood_model(self):
        """Load the trained flood prediction model"""
        model_path = Path(__file__).parent / "models" / "best_flood_prediction_lr_model.pkl"
        
        try:
            with open(model_path, 'rb') as f:
                self.flood_model = pickle.load(f)
            logger.info(f"Successfully loaded flood prediction model from {model_path}")
        except FileNotFoundError:
            logger.error(f"Flood model not found at {model_path}")
            logger.error("Please ensure the flood prediction model is available")
            sys.exit(1)
        except Exception as e:
            logger.error(f"Error loading flood model: {e}")
            sys.exit(1)
    
    def fetch_weather_data(self, latitude: float, longitude: float) -> Optional[WeatherData]:
        """Fetch current weather data from OpenWeatherMap API"""
        try:
            url = "https://api.openweathermap.org/data/2.5/weather"
            params = {
                'lat': latitude,
                'lon': longitude,
                'appid': self.openweather_api_key,
                'units': 'metric'
            }
            
            logger.debug(f"Fetching weather data for ({latitude}, {longitude})")
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            weather = WeatherData(
                temperature=data['main']['temp'],
                humidity=data['main']['humidity'],
                pressure=data['main']['pressure'],
                wind_speed=data.get('wind', {}).get('speed', 0),
                wind_direction=data.get('wind', {}).get('deg', 0),
                visibility=data.get('visibility', 10000) / 1000,  # Convert to km
                precipitation=data.get('rain', {}).get('1h', 0),  # mm in last hour
                clouds=data.get('clouds', {}).get('all', 0),
                description=data['weather'][0]['description'],
                timestamp=datetime.now()
            )
            
            logger.debug(f"Successfully fetched weather data: {weather.description}, {weather.temperature}°C")
            return weather
            
        except requests.RequestException as e:
            logger.error(f"Failed to fetch weather data: {e}")
            return None
        except Exception as e:
            logger.error(f"Error processing weather data: {e}")
            return None
    
    def fetch_forecast_data(self, latitude: float, longitude: float) -> Optional[Dict]:
        """Fetch weather forecast data for rainfall estimation"""
        try:
            url = "https://api.openweathermap.org/data/2.5/forecast"
            params = {
                'lat': latitude,
                'lon': longitude,
                'appid': self.openweather_api_key,
                'units': 'metric',
                'cnt': 40  # 5 days * 8 forecasts per day
            }
            
            logger.debug(f"Fetching forecast data for ({latitude}, {longitude})")
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # Process forecast data for rainfall estimation
            daily_rainfall = {}
            total_forecast_rainfall = 0
            
            for item in data['list']:
                forecast_time = datetime.fromtimestamp(item['dt'])
                day_key = forecast_time.strftime('%Y-%m-%d')
                
                rainfall = item.get('rain', {}).get('3h', 0)
                total_forecast_rainfall += rainfall
                
                if day_key not in daily_rainfall:
                    daily_rainfall[day_key] = 0
                daily_rainfall[day_key] += rainfall
            
            return {
                'daily_rainfall': daily_rainfall,
                'total_forecast_rainfall': total_forecast_rainfall,
                'location': data['city']
            }
            
        except Exception as e:
            logger.error(f"Error fetching forecast data: {e}")
            return None
    
    def estimate_monthly_rainfall(self, latitude: float, longitude: float, 
                                current_forecast: Optional[Dict] = None) -> List[float]:
        """Estimate monthly rainfall data for the flood model"""
        current_month = datetime.now().month
        abs_lat = abs(latitude)
        
        # Base rainfall patterns by latitude (climatological estimates)
        if abs_lat < 23.5:  # Tropical
            base_monthly = [180, 160, 200, 220, 250, 280, 300, 290, 270, 240, 200, 190]
        elif abs_lat < 40:  # Subtropical
            base_monthly = [80, 70, 90, 110, 130, 120, 100, 90, 85, 95, 85, 80]
        else:  # Temperate
            base_monthly = [50, 45, 60, 70, 80, 85, 90, 85, 75, 65, 55, 50]
        
        # Adjust based on longitude (oceanic influence)
        oceanic_factor = 1.2 if abs(longitude) > 20 else 0.8
        
        monthly_rainfall = []
        for i, base_rain in enumerate(base_monthly):
            # Apply geographical adjustments
            adjusted_rain = base_rain * oceanic_factor
            
            # If we have forecast data and this is the current month, use it
            if current_forecast and i == (current_month - 1):
                forecast_rainfall = current_forecast.get('total_forecast_rainfall', 0)
                if forecast_rainfall > 0:
                    # Extrapolate 5-day forecast to monthly estimate
                    estimated_monthly = (forecast_rainfall / 5) * 30
                    adjusted_rain = max(adjusted_rain, estimated_monthly)
            
            monthly_rainfall.append(round(adjusted_rain, 1))
        
        return monthly_rainfall
    
    def predict_flood_probability(self, monthly_rainfall: List[float]) -> float:
        """Use the ML model to predict flood probability"""
        try:
            current_year = datetime.now().year
            
            # Prepare features: [YEAR, JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC]
            features = np.array([current_year] + monthly_rainfall).reshape(1, -1)
            
            # Make prediction
            if hasattr(self.flood_model, 'predict_proba'):
                proba = self.flood_model.predict_proba(features)
                flood_probability = float(proba[0][1]) if len(proba[0]) > 1 else float(np.max(proba))
            else:
                # If model doesn't have predict_proba, use predict and assume binary output
                prediction = self.flood_model.predict(features)[0]
                flood_probability = float(prediction)
            
            return max(0.0, min(1.0, flood_probability))  # Ensure it's between 0 and 1
            
        except Exception as e:
            logger.error(f"Error predicting flood probability: {e}")
            return 0.0
    
    def determine_risk_level(self, probability: float) -> str:
        """Determine risk level based on flood probability"""
        if probability >= 0.8:
            return "Extreme"
        elif probability >= 0.64:  # Our alert threshold
            return "High"
        elif probability >= 0.4:
            return "Medium"
        elif probability >= 0.2:
            return "Low"
        else:
            return "Very Low"
    
    def create_flood_alert(self, location: LocationConfig, flood_probability: float, 
                          weather_data: WeatherData, rainfall_data: List[float]) -> FloodAlert:
        """Create a flood alert object"""
        risk_level = self.determine_risk_level(flood_probability)
        alert_id = f"FLOOD_{location.location_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Create alert message
        message = f"""
🚨 FLOOD ALERT for {location.location_name}

⚠️  FLOOD PROBABILITY: {flood_probability:.1%}
📍 LOCATION: {location.latitude:.4f}, {location.longitude:.4f}
🎯 RISK LEVEL: {risk_level}
🌧️  CURRENT CONDITIONS: {weather_data.description}
🌡️  TEMPERATURE: {weather_data.temperature}°C
💧 HUMIDITY: {weather_data.humidity}%
🌊 PRECIPITATION: {weather_data.precipitation}mm/hr
📅 TIME: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

IMMEDIATE ACTIONS RECOMMENDED:
• Avoid low-lying areas and flood-prone zones
• Monitor local emergency services alerts
• Prepare emergency evacuation plan
• Move vehicles to higher ground
• Stock emergency supplies (water, food, flashlight, battery radio)

This alert was generated automatically by WaveGuard AI monitoring system.
        """.strip()
        
        return FloodAlert(
            location=location,
            flood_probability=flood_probability,
            risk_level=risk_level,
            weather_data=weather_data,
            rainfall_data=rainfall_data,
            timestamp=datetime.now(),
            alert_id=alert_id,
            message=message
        )
    
    def send_alert_to_website(self, alert: FloodAlert) -> bool:
        """Send alert to the website endpoint"""
        try:
            alert_data = {
                'alert_id': alert.alert_id,
                'location': {
                    'name': alert.location.location_name,
                    'latitude': alert.location.latitude,
                    'longitude': alert.location.longitude
                },
                'flood_probability': alert.flood_probability,
                'risk_level': alert.risk_level,
                'weather': {
                    'temperature': alert.weather_data.temperature,
                    'humidity': alert.weather_data.humidity,
                    'pressure': alert.weather_data.pressure,
                    'wind_speed': alert.weather_data.wind_speed,
                    'precipitation': alert.weather_data.precipitation,
                    'description': alert.weather_data.description
                },
                'message': alert.message,
                'timestamp': alert.timestamp.isoformat(),
                'alert_type': 'flood',
                'severity': alert.risk_level.lower()
            }
            
            headers = {
                'Content-Type': 'application/json',
                'User-Agent': 'WaveGuard-FloodMonitor/1.0'
            }
            
            logger.info(f"Sending flood alert to website: {self.website_alert_endpoint}")
            response = requests.post(
                self.website_alert_endpoint,
                json=alert_data,
                headers=headers,
                timeout=10
            )
            
            response.raise_for_status()
            logger.info(f"Successfully sent alert {alert.alert_id} to website")
            return True
            
        except requests.RequestException as e:
            logger.error(f"Failed to send alert to website: {e}")
            return False
        except Exception as e:
            logger.error(f"Error sending alert to website: {e}")
            return False
    
    def log_alert_locally(self, alert: FloodAlert):
        """Log alert to local file for record keeping"""
        try:
            log_file = Path("flood_alerts_log.json")
            
            alert_record = {
                'alert_id': alert.alert_id,
                'timestamp': alert.timestamp.isoformat(),
                'location': {
                    'name': alert.location.location_name,
                    'latitude': alert.location.latitude,
                    'longitude': alert.location.longitude
                },
                'flood_probability': alert.flood_probability,
                'risk_level': alert.risk_level,
                'weather_conditions': {
                    'temperature': alert.weather_data.temperature,
                    'humidity': alert.weather_data.humidity,
                    'pressure': alert.weather_data.pressure,
                    'precipitation': alert.weather_data.precipitation,
                    'description': alert.weather_data.description
                }
            }
            
            # Append to existing log file or create new one
            if log_file.exists():
                with open(log_file, 'r') as f:
                    log_data = json.load(f)
            else:
                log_data = {'alerts': []}
            
            log_data['alerts'].append(alert_record)
            
            with open(log_file, 'w') as f:
                json.dump(log_data, f, indent=2)
            
            logger.info(f"Logged alert {alert.alert_id} to local file")
            
        except Exception as e:
            logger.error(f"Error logging alert locally: {e}")
    
    def monitor_location(self, location: LocationConfig):
        """Monitor a single location for flood risk"""
        try:
            logger.info(f"Monitoring flood risk for {location.location_name} ({location.latitude}, {location.longitude})")
            
            # Fetch current weather data
            weather_data = self.fetch_weather_data(location.latitude, location.longitude)
            if not weather_data:
                logger.warning(f"Could not fetch weather data for {location.location_name}")
                return
            
            # Fetch forecast data
            forecast_data = self.fetch_forecast_data(location.latitude, location.longitude)
            
            # Estimate monthly rainfall
            monthly_rainfall = self.estimate_monthly_rainfall(
                location.latitude, location.longitude, forecast_data
            )
            
            # Predict flood probability
            flood_probability = self.predict_flood_probability(monthly_rainfall)
            
            logger.info(f"Flood probability for {location.location_name}: {flood_probability:.1%}")
            
            # Check if alert threshold is exceeded
            if flood_probability >= location.alert_threshold:
                logger.warning(f"FLOOD ALERT TRIGGERED for {location.location_name}! "
                             f"Probability: {flood_probability:.1%} (threshold: {location.alert_threshold:.1%})")
                
                # Create alert
                alert = self.create_flood_alert(location, flood_probability, weather_data, monthly_rainfall)
                
                # Log alert locally
                self.log_alert_locally(alert)
                
                # Send alert to website
                if self.send_alert_to_website(alert):
                    logger.info(f"Alert {alert.alert_id} successfully sent to website")
                else:
                    logger.error(f"Failed to send alert {alert.alert_id} to website")
                
                # Print alert to console
                print("\n" + "="*60)
                print(alert.message)
                print("="*60 + "\n")
                
            else:
                logger.info(f"No flood alert needed for {location.location_name}. "
                           f"Probability: {flood_probability:.1%} < {location.alert_threshold:.1%}")
            
        except Exception as e:
            logger.error(f"Error monitoring location {location.location_name}: {e}")
    
    def run_monitoring_cycle(self):
        """Run one complete monitoring cycle for all locations"""
        logger.info("Starting flood monitoring cycle...")
        
        for location in self.locations:
            self.monitor_location(location)
        
        logger.info("Completed flood monitoring cycle")
    
    def start_monitoring(self):
        """Start the continuous monitoring process"""
        logger.info("Starting WaveGuard Flood Alert Monitor...")
        logger.info(f"Monitoring {len(self.locations)} location(s)")
        logger.info(f"Alert threshold: {self.locations[0].alert_threshold:.1%} if locations exist")
        logger.info(f"Website endpoint: {self.website_alert_endpoint}")
        
        # Schedule monitoring for each location
        for location in self.locations:
            schedule.every(location.check_interval_hours).hours.do(
                self.monitor_location, location
            )
        
        # Run initial check immediately
        self.run_monitoring_cycle()
        
        # Keep running scheduled jobs
        logger.info("Flood monitor is now running. Press Ctrl+C to stop.")
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Check every minute for scheduled jobs
        except KeyboardInterrupt:
            logger.info("Flood monitor stopped by user")

def create_sample_config():
    """Create a sample configuration file"""
    sample_config = {
        "locations": [
            {
                "name": "Mumbai, India",
                "latitude": 19.0760,
                "longitude": 72.8777,
                "alert_threshold": 0.64,
                "check_interval_hours": 1
            },
            {
                "name": "Houston, Texas",
                "latitude": 29.7604,
                "longitude": -95.3698,
                "alert_threshold": 0.64,
                "check_interval_hours": 1
            },
            {
                "name": "Venice, Italy",
                "latitude": 45.4408,
                "longitude": 12.3155,
                "alert_threshold": 0.64,
                "check_interval_hours": 1
            }
        ]
    }
    
    with open('flood_monitor_config.json', 'w') as f:
        json.dump(sample_config, f, indent=2)
    
    print("Created sample configuration file: flood_monitor_config.json")
    print("Edit this file to add your monitoring locations.")

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='WaveGuard Flood Alert Monitor')
    parser.add_argument('--lat', type=float, help='Latitude for monitoring')
    parser.add_argument('--lon', type=float, help='Longitude for monitoring')
    parser.add_argument('--name', default='Unknown Location', help='Location name')
    parser.add_argument('--config', help='Configuration file path')
    parser.add_argument('--threshold', type=float, default=0.64, help='Alert threshold (default: 0.64)')
    parser.add_argument('--create-config', action='store_true', help='Create sample configuration file')
    parser.add_argument('--test', action='store_true', help='Run single test cycle instead of continuous monitoring')
    
    args = parser.parse_args()
    
    if args.create_config:
        create_sample_config()
        return
    
    # Initialize monitor
    if args.config:
        monitor = FloodMonitor(config_file=args.config)
    else:
        monitor = FloodMonitor()
        
        # Add location from command line arguments
        if args.lat is not None and args.lon is not None:
            location = LocationConfig(
                latitude=args.lat,
                longitude=args.lon,
                location_name=args.name,
                alert_threshold=args.threshold
            )
            monitor.locations.append(location)
        else:
            print("Error: Please provide either --config file or --lat and --lon coordinates")
            print("Use --create-config to create a sample configuration file")
            sys.exit(1)
    
    if not monitor.locations:
        print("No locations configured for monitoring!")
        sys.exit(1)
    
    # Run monitoring
    if args.test:
        print("Running test monitoring cycle...")
        monitor.run_monitoring_cycle()
        print("Test completed.")
    else:
        monitor.start_monitoring()

if __name__ == "__main__":
    main()
