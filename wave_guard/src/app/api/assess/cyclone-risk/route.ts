import { NextRequest, NextResponse } from 'next/server';
import { CycloneRiskInput, CycloneAssessment, WeatherData, CyclonePredictionResult } from '@/types/models';

// OpenWeatherMap API configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'demo_key';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Mock prediction model for demonstration (in production, this would call your actual ML model)
const predictCycloneRisk = (pressure: number, windSpeed: number): CyclonePredictionResult => {
  // Basic prediction logic based on meteorological thresholds
  // In production, this would call your trained ML model
  
  let prediction = false;
  let riskLevel: CyclonePredictionResult['risk_level'] = 'No Risk';
  let confidence = 0.7;
  let predictedWindSpeed = windSpeed;
  
  // Low pressure and high wind speed indicate cyclone formation potential
  const pressureFactor = pressure < 1000; // Low pressure systems
  const windFactor = windSpeed > 10; // Elevated wind speeds
  
  if (pressure < 980 && windSpeed > 25) {
    prediction = true;
    riskLevel = 'Extreme Risk';
    confidence = 0.9;
    predictedWindSpeed = Math.max(windSpeed * 1.5, 30); // Predict intensification
  } else if (pressure < 990 && windSpeed > 20) {
    prediction = true;
    riskLevel = 'High Risk';
    confidence = 0.85;
    predictedWindSpeed = Math.max(windSpeed * 1.3, 25);
  } else if (pressure < 995 && windSpeed > 15) {
    prediction = true;
    riskLevel = 'Moderate Risk';
    confidence = 0.75;
    predictedWindSpeed = Math.max(windSpeed * 1.2, 18);
  } else if (pressure < 1005 && windSpeed > 10) {
    riskLevel = 'Low Risk';
    confidence = 0.6;
    predictedWindSpeed = Math.max(windSpeed * 1.1, 12);
  }
  
  const getPressureFactor = (): string => {
    if (pressure < 980) return `Extremely low pressure (${pressure} hPa) - Strong cyclone formation indicator`;
    if (pressure < 990) return `Very low pressure (${pressure} hPa) - Significant cyclone development risk`;
    if (pressure < 995) return `Low pressure (${pressure} hPa) - Moderate cyclone formation potential`;
    if (pressure < 1005) return `Below normal pressure (${pressure} hPa) - Mild atmospheric instability`;
    return `Normal pressure (${pressure} hPa) - Stable atmospheric conditions`;
  };
  
  const getWindFactor = (): string => {
    if (windSpeed > 25) return `Very high winds (${windSpeed} m/s) - Conducive to rapid cyclone intensification`;
    if (windSpeed > 20) return `High winds (${windSpeed} m/s) - Favorable for cyclone development`;
    if (windSpeed > 15) return `Elevated winds (${windSpeed} m/s) - Some potential for system organization`;
    if (windSpeed > 10) return `Moderate winds (${windSpeed} m/s) - Limited cyclone formation potential`;
    return `Light winds (${windSpeed} m/s) - Minimal cyclone development risk`;
  };
  
  const getCombinedAssessment = (): string => {
    if (prediction) {
      return `Current atmospheric conditions favor cyclone formation. The combination of ${pressureFactor ? 'low pressure' : 'pressure variations'} and ${windFactor ? 'elevated winds' : 'wind patterns'} creates an environment conducive to tropical system development.`;
    }
    return `Current atmospheric conditions are not conducive to cyclone formation. Pressure and wind patterns indicate stable weather conditions.`;
  };
  
  return {
    prediction,
    risk_level: riskLevel,
    confidence,
    predicted_wind_speed: predictedWindSpeed,
    risk_factors: {
      pressure_factor: getPressureFactor(),
      wind_factor: getWindFactor(),
      combined_assessment: getCombinedAssessment()
    }
  };
};

const getRecommendations = (riskLevel: string, prediction: boolean): string[] => {
  const baseRecommendations = [
    'Monitor local weather updates and warnings',
    'Stay informed about evacuation routes in your area'
  ];
  
  switch (riskLevel) {
    case 'Extreme Risk':
      return [
        'IMMEDIATE: Prepare for hurricane/typhoon conditions',
        'Secure all outdoor items and board up windows',
        'Stock emergency supplies for at least 7 days',
        'Review evacuation plans and routes immediately',
        'Monitor emergency broadcasts continuously',
        ...baseRecommendations
      ];
    case 'High Risk':
      return [
        'Prepare for severe tropical storm conditions',
        'Secure outdoor furniture and equipment',
        'Stock emergency supplies for 3-5 days',
        'Review emergency plans with family',
        'Monitor weather forecasts closely',
        ...baseRecommendations
      ];
    case 'Moderate Risk':
      return [
        'Prepare for possible tropical storm conditions',
        'Check and secure loose outdoor items',
        'Stock basic emergency supplies',
        'Stay updated on weather developments',
        ...baseRecommendations
      ];
    case 'Low Risk':
      return [
        'Monitor weather conditions for changes',
        'Ensure emergency kit is ready',
        ...baseRecommendations
      ];
    default:
      return baseRecommendations;
  }
};

const getMonitoringAdvice = (riskLevel: string): string[] => {
  const baseAdvice = [
    'Check weather updates every 6 hours',
    'Monitor official meteorological services'
  ];
  
  switch (riskLevel) {
    case 'Extreme Risk':
      return [
        'Monitor conditions every 30 minutes',
        'Follow emergency management broadcasts',
        'Track official hurricane/typhoon warnings',
        'Watch for rapid intensification updates',
        ...baseAdvice
      ];
    case 'High Risk':
      return [
        'Monitor conditions every 2 hours',
        'Watch for tropical storm warnings',
        'Track storm development patterns',
        ...baseAdvice
      ];
    case 'Moderate Risk':
      return [
        'Monitor conditions every 4 hours',
        'Watch for weather advisories',
        'Track atmospheric pressure trends',
        ...baseAdvice
      ];
    default:
      return baseAdvice;
  }
};

export async function POST(request: NextRequest) {
  try {
    const body: CycloneRiskInput = await request.json();
    const { latitude, longitude, address } = body;

    // Validate input
    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Fetch weather data from OpenWeatherMap
    const weatherUrl = `${OPENWEATHER_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    
    let weatherData: WeatherData;
    
    try {
      const weatherResponse = await fetch(weatherUrl);
      
      if (!weatherResponse.ok) {
        throw new Error(`OpenWeatherMap API error: ${weatherResponse.status}`);
      }
      
      const rawWeatherData = await weatherResponse.json();
      
      // Extract relevant weather parameters
      weatherData = {
        pressure: rawWeatherData.main.pressure, // hPa
        wind_speed: rawWeatherData.wind?.speed || 0, // m/s
        wind_direction: rawWeatherData.wind?.deg || 0, // degrees
        temperature: rawWeatherData.main.temp, // Celsius
        humidity: rawWeatherData.main.humidity, // percentage
        visibility: (rawWeatherData.visibility || 10000) / 1000, // convert meters to km
      };
    } catch (error) {
      // If OpenWeatherMap fails, use mock data for demonstration
      console.warn('OpenWeatherMap API error, using mock data:', error);
      weatherData = {
        pressure: 1013 + Math.random() * 40 - 20, // 993-1033 hPa
        wind_speed: Math.random() * 30, // 0-30 m/s
        wind_direction: Math.random() * 360,
        temperature: 25 + Math.random() * 10,
        humidity: 60 + Math.random() * 30,
        visibility: 10 + Math.random() * 15,
      };
    }

    // Get cyclone prediction using the weather data
    const cyclonePrediction = predictCycloneRisk(weatherData.pressure, weatherData.wind_speed);
    
    // Create comprehensive assessment
    const assessment: CycloneAssessment = {
      location: {
        latitude,
        longitude,
        address
      },
      weather_data: weatherData,
      cyclone_prediction: cyclonePrediction,
      recommendations: getRecommendations(cyclonePrediction.risk_level, cyclonePrediction.prediction),
      monitoring_advice: getMonitoringAdvice(cyclonePrediction.risk_level),
      data_source: 'OpenWeatherMap Current Weather API',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Cyclone risk assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess cyclone risk' },
      { status: 500 }
    );
  }
}
