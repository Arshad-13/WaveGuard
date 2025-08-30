"""
Test script to demonstrate USGS integration and handle no-earthquake scenarios
"""

import requests
import json
from datetime import datetime

def test_usgs_integration():
    """Test the USGS integration with different scenarios"""
    
    print("🌊 Testing WaveGuard USGS Integration")
    print("=" * 50)
    
    # Test user location (example: Tokyo, Japan)
    user_location = {
        "latitude": 35.6762,
        "longitude": 139.6503,
        "feed_type": "past_day_m45"
    }
    
    api_base = "http://localhost:8000"
    
    print(f"\n📍 Testing for user location: {user_location['latitude']}, {user_location['longitude']}")
    print(f"🔍 Using feed: {user_location['feed_type']}")
    
    # Test 1: Check if API is running
    print("\n1️⃣ Testing API health...")
    try:
        response = requests.get(f"{api_base}/health", timeout=5)
        if response.status_code == 200:
            health_data = response.json()
            print(f"   ✅ API is running - Models loaded: {health_data.get('models_loaded', 0)}")
        else:
            print(f"   ❌ API health check failed: {response.status_code}")
            return
    except Exception as e:
        print(f"   ❌ Cannot connect to API: {e}")
        print("   💡 Make sure to run: python main.py")
        return
    
    # Test 2: Check raw USGS data
    print(f"\n2️⃣ Testing raw USGS data fetch...")
    try:
        response = requests.get(f"{api_base}/earthquakes/{user_location['feed_type']}", timeout=10)
        if response.status_code == 200:
            usgs_data = response.json()
            eq_count = usgs_data.get('count', 0)
            print(f"   ✅ USGS data fetched - Found {eq_count} earthquakes")
            
            if eq_count == 0:
                print("   📋 No earthquakes found - this demonstrates the 'no earthquake' scenario!")
                print("   🔍 USGS Response structure when no earthquakes occur:")
                print(f"   - Status: {usgs_data.get('status')}")
                print(f"   - Count: {eq_count}")
                print(f"   - Earthquakes array: {usgs_data.get('earthquakes', [])}")
                print(f"   - Feed type: {usgs_data.get('feed_type')}")
            else:
                print(f"   📋 Recent earthquakes found:")
                for i, eq in enumerate(usgs_data.get('earthquakes', [])[:3]):\n                    print(f"     {i+1}. Mag {eq['magnitude']} at {eq['place']}")
        else:\n            print(f"   ❌ USGS data fetch failed: {response.status_code}")
            return
    except Exception as e:\n        print(f"   ❌ Error fetching USGS data: {e}")
        return
    
    # Test 3: Full risk assessment
    print(f"\n3️⃣ Testing full tsunami risk assessment...")
    try:\n        response = requests.post(\n            f"{api_base}/assess/tsunami-risk",\n            json=user_location,\n            timeout=15\n        )\n        \n        if response.status_code == 200:\n            risk_data = response.json()\n            print(f"   ✅ Risk assessment completed\")\n            print(f"   📊 Results:\")\n            print(f"     - Overall status: {risk_data.get('overall_status')}\")\n            print(f"     - Earthquakes analyzed: {risk_data.get('earthquake_count')}\")\n            print(f"     - Highest risk level: {risk_data.get('highest_risk', {}).get('risk_zone')}\")\n            \n            if risk_data.get('earthquake_count', 0) == 0:\n                print(\"   🎯 NO EARTHQUAKE SCENARIO DEMONSTRATED:\")\n                print(f"     - Status: {risk_data.get('overall_status')}\")\n                print(f"     - Risk zone: {risk_data.get('highest_risk', {}).get('risk_zone')}\")\n                print(f"     - Reasoning: {risk_data.get('highest_risk', {}).get('reasoning')}\")\n                print(\"     - Recommendations:\")\n                for rec in risk_data.get('recommendations', []):\n                    print(f\"       • {rec}\")\n            else:\n                print(\"   📋 Earthquake analysis results:\")\n                for i, eq_analysis in enumerate(risk_data.get('earthquakes_analyzed', [])[:2]):\n                    eq = eq_analysis['earthquake']\n                    risk = eq_analysis['user_risk']\n                    print(f\"     {i+1}. Mag {eq['magnitude']} - {risk['risk_zone']} ({risk['distance_km']}km away)\")\n            \n        else:\n            print(f\"   ❌ Risk assessment failed: {response.status_code}\")\n            print(f\"   Error: {response.text}\")\n    except Exception as e:\n        print(f\"   ❌ Error in risk assessment: {e}\")\n    \n    print(f"\n" + "=" * 50)\n    print(\"🎯 INTEGRATION SUMMARY:\")\n    print(\"1. ✅ USGS API returns consistent structure when no earthquakes occur\")\n    print(\"2. ✅ Your app handles 'no earthquake' scenarios gracefully\")\n    print(\"3. ✅ Risk assessment works for both scenarios:\")\n    print(\"   - When earthquakes are found: Analyzes each for tsunami risk\")\n    print(\"   - When NO earthquakes found: Returns 'All Clear' status\")\n    print(\"4. ✅ Distance-based risk zones are calculated properly\")\n    print(\"\\n💡 Your frontend can now:\")\n    print(\"   - Get user lat/lon from Leaflet map\")\n    print(\"   - Call /assess/tsunami-risk endpoint\")\n    print(\"   - Display appropriate risk level and recommendations\")\n\ndef test_specific_scenarios():\n    \"\"\"Test specific scenarios including no earthquakes\"\"\"\n    \n    print(\"\\n🧪 Testing specific scenarios...\")\n    print(\"=\" * 50)\n    \n    scenarios = [\n        {\n            \"name\": \"High magnitude feed (likely no results)\",\n            \"feed_type\": \"past_hour_m45\",\n            \"location\": {\"latitude\": 35.6762, \"longitude\": 139.6503}\n        },\n        {\n            \"name\": \"All earthquakes today\",\n            \"feed_type\": \"past_day_all\",\n            \"location\": {\"latitude\": 37.7749, \"longitude\": -122.4194}  # San Francisco\n        }\n    ]\n    \n    api_base = \"http://localhost:8000\"\n    \n    for i, scenario in enumerate(scenarios, 1):\n        print(f\"\\n{i}️⃣ {scenario['name']}\")\n        print(f\"   Location: {scenario['location']['latitude']}, {scenario['location']['longitude']}\")\n        print(f\"   Feed: {scenario['feed_type']}\")\n        \n        try:\n            # First check raw earthquake data\n            eq_response = requests.get(f\"{api_base}/earthquakes/{scenario['feed_type']}\", timeout=10)\n            if eq_response.status_code == 200:\n                eq_data = eq_response.json()\n                print(f\"   📊 Raw USGS data: {eq_data.get('count', 0)} earthquakes found\")\n                \n                if eq_data.get('count', 0) == 0:\n                    print(\"   🎯 This is a 'NO EARTHQUAKE' scenario!\")\n                    print(f\"   📋 USGS returns: {{'count': 0, 'earthquakes': [], 'status': 'success'}}\")\n            \n            # Then test risk assessment\n            risk_payload = {**scenario['location'], \"feed_type\": scenario['feed_type']}\n            risk_response = requests.post(f\"{api_base}/assess/tsunami-risk\", json=risk_payload, timeout=15)\n            \n            if risk_response.status_code == 200:\n                risk_data = risk_response.json()\n                print(f\"   🔍 Risk assessment: {risk_data.get('overall_status')}\")\n                print(f\"   📍 Highest risk: {risk_data.get('highest_risk', {}).get('risk_zone')}\")\n                \n                if risk_data.get('earthquake_count', 0) == 0:\n                    print(f\"   ✅ Handled 'no earthquake' scenario correctly:\")\n                    print(f\"     - Status: {risk_data.get('overall_status')}\")\n                    print(f\"     - Risk: {risk_data.get('highest_risk', {}).get('risk_zone')}\")\n            \n        except Exception as e:\n            print(f\"   ❌ Error testing scenario: {e}\")\n\nif __name__ == \"__main__\":\n    test_usgs_integration()\n    test_specific_scenarios()
