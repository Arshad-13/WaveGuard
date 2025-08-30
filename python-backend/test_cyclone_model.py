#!/usr/bin/env python3
"""Test loading the cyclone model"""

import pickle
import os
import sklearn
import sklearn.linear_model
import numpy as np

def test_cyclone_model():
    model_path = os.path.join('models', 'cyclone_intensity_predictor_improved.pkl')
    
    print(f"Testing cyclone model: {model_path}")
    print(f"File exists: {os.path.exists(model_path)}")
    print(f"File size: {os.path.getsize(model_path)} bytes")
    print(f"sklearn version: {sklearn.__version__}")
    
    try:
        print("\nAttempting to load model...")
        with open(model_path, 'rb') as f:
            model_data = pickle.load(f)
        
        print(f"✅ Model loaded successfully!")
        print(f"Model type: {type(model_data)}")
        
        # Check if it's a sklearn model directly or wrapped in a dict
        if hasattr(model_data, 'predict'):
            model = model_data
            print("Model is direct sklearn model")
        elif isinstance(model_data, dict) and 'model' in model_data:
            model = model_data['model']
            print("Model is wrapped in dictionary")
        else:
            print(f"Model data structure: {model_data}")
            return False
            
        print(f"Actual model type: {type(model)}")
        
        # Test prediction with sample data
        # Typical cyclone features: [pressure, wind_speed]
        sample_input = np.array([[990, 15]])  # Low pressure, moderate wind
        prediction = model.predict(sample_input)
        print(f"🧪 Test prediction: {prediction}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_cyclone_model()
