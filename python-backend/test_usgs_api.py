"""
Test script to check USGS API response when no earthquakes occur
"""

import requests
import json
from datetime import datetime, timedelta

def test_usgs_api_no_earthquakes():
    """Test USGS API response when filtering for conditions with no earthquakes"""
    
    # USGS Earthquake API endpoint
    base_url = "https://earthquake.usgs.gov/fdsnws/event/1/query"
    
    print("🌍 Testing USGS API responses for scenarios with no earthquakes...")
    print("=" * 60)
    
    # Test 1: Very high magnitude filter (likely no results)
    print("\n1️⃣ Testing with very high magnitude filter (minmagnitude=9.5)")
    params_high_mag = {
        'format': 'geojson',
        'minmagnitude': 9.5,  # Very rare magnitude
        'starttime': '2024-01-01',
        'endtime': '2024-12-31'
    }
    
    try:
        response = requests.get(base_url, params=params_high_mag, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        print(f"   Status Code: {response.status_code}")
        print(f"   Number of earthquakes found: {len(data.get('features', []))}")
        print(f"   Response structure:")
        print(f"   - Type: {data.get('type', 'N/A')}")
        print(f"   - Metadata: {data.get('metadata', {})}")
        print(f"   - Features count: {len(data.get('features', []))}")
        
        if len(data.get('features', [])) == 0:
            print("   ✅ No earthquakes found - this is our target scenario!")
            print(f"   📋 Full response structure:")
            print(json.dumps(data, indent=2)[:500] + "..." if len(str(data)) > 500 else json.dumps(data, indent=2))
        
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 2: Very specific small geographic area with no recent activity
    print("\n2️⃣ Testing with small geographic area (middle of Pacific)")
    params_small_area = {
        'format': 'geojson',
        'minlatitude': 10.0,
        'maxlatitude': 10.1,
        'minlongitude': -150.0,
        'maxlongitude': -149.9,
        'starttime': (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d'),
        'endtime': datetime.now().strftime('%Y-%m-%d')
    }
    
    try:
        response = requests.get(base_url, params=params_small_area, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        print(f"   Status Code: {response.status_code}")
        print(f"   Number of earthquakes found: {len(data.get('features', []))}")
        
        if len(data.get('features', [])) == 0:
            print("   ✅ No earthquakes in this small area!")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # Test 3: Future date (should return no results)
    print("\n3️⃣ Testing with future date")
    future_date = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d')
    params_future = {
        'format': 'geojson',
        'starttime': future_date,
        'endtime': future_date
    }
    
    try:
        response = requests.get(base_url, params=params_future, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        print(f"   Status Code: {response.status_code}")
        print(f"   Number of earthquakes found: {len(data.get('features', []))}")
        
        if len(data.get('features', [])) == 0:
            print("   ✅ No earthquakes in future date!")
            print("   📋 Response metadata:")
            print(f"   {json.dumps(data.get('metadata', {}), indent=2)}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("🔍 Summary: When USGS API finds no earthquakes, it returns:")
    print("   - HTTP 200 status code")
    print("   - Valid GeoJSON structure")
    print("   - Empty 'features' array")
    print("   - Metadata with query information")
    print("   - Type: 'FeatureCollection'")

def test_usgs_api_basic():
    """Test basic USGS API call to understand normal structure"""
    
    print("\n🌍 Testing normal USGS API response for comparison...")
    print("=" * 60)
    
    base_url = "https://earthquake.usgs.gov/fdsnws/event/1/query"
    
    # Get recent earthquakes (last 24 hours, magnitude 4+)
    params = {
        'format': 'geojson',
        'minmagnitude': 4.0,
        'starttime': (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d'),
        'limit': 1  # Just get one earthquake for comparison
    }
    
    try:
        response = requests.get(base_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        print(f"Status Code: {response.status_code}")
        print(f"Number of earthquakes found: {len(data.get('features', []))}")
        print(f"Response type: {data.get('type', 'N/A')}")
        
        if data.get('features'):
            earthquake = data['features'][0]
            properties = earthquake.get('properties', {})
            print(f"\nExample earthquake structure:")
            print(f"- Magnitude: {properties.get('mag')}")
            print(f"- Place: {properties.get('place')}")
            print(f"- Time: {properties.get('time')}")
            print(f"- Coordinates: {earthquake.get('geometry', {}).get('coordinates')}")
        
    except Exception as e:
        print(f"❌ Error fetching normal earthquakes: {e}")

if __name__ == "__main__":
    test_usgs_api_no_earthquakes()
    test_usgs_api_basic()
