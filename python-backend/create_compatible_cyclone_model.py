#!/usr/bin/env python3
"""
Create a compatible cyclone model that matches the expected format
"""

import pickle
import numpy as np
import os
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler

def create_simple_cyclone_model():
    """Create a simple cyclone intensity model"""
    
    print("🌪️ Creating compatible cyclone model...")
    
    # Generate simple training data
    np.random.seed(42)
    n_samples = 100
    
    # Features: pressure (hPa), wind_speed (m/s)
    X = []
    y = []
    
    for _ in range(n_samples):
        pressure = np.random.uniform(980, 1020)  # 980-1020 hPa
        wind_speed = np.random.uniform(0, 30)    # 0-30 m/s
        
        # Simple linear relationship: lower pressure + higher wind = higher intensity
        intensity = 40 - (pressure - 980) * 0.5 + wind_speed * 0.8 + np.random.normal(0, 2)
        intensity = max(0, min(70, intensity))  # Clamp between 0-70 m/s
        
        X.append([pressure, wind_speed])
        y.append(intensity)
    
    X = np.array(X)
    y = np.array(y)
    
    # Create and train simple linear model
    model = LinearRegression()
    model.fit(X, y)
    
    print(f"✅ Model trained. Coefficients: {model.coef_}")
    print(f"📊 Intercept: {model.intercept_:.2f}")
    
    # Test the model
    test_input = np.array([[990, 15]])  # Low pressure, moderate wind
    prediction = model.predict(test_input)
    print(f"🧪 Test prediction (990 hPa, 15 m/s): {prediction[0]:.2f} m/s")
    
    return model

def save_cyclone_model():
    """Save the cyclone model in the expected format"""
    
    model = create_simple_cyclone_model()
    
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, 'cyclone_intensity_predictor_improved.pkl')
    
    # Backup existing file
    if os.path.exists(model_path):
        backup_path = model_path + '.corrupt_backup'
        os.rename(model_path, backup_path)
        print(f"📋 Backed up corrupted model to: {backup_path}")
    
    # Save using the same protocol and structure expected by main.py
    try:
        with open(model_path, 'wb') as f:
            pickle.dump(model, f, protocol=pickle.HIGHEST_PROTOCOL)
        
        print(f"💾 Model saved to: {model_path}")
        
        # Verify the saved model
        file_size = os.path.getsize(model_path)
        print(f"📁 File size: {file_size:,} bytes")
        
        # Test loading
        with open(model_path, 'rb') as f:
            loaded_model = pickle.load(f)
        
        # Test prediction
        test_input = np.array([[985, 20]])
        prediction = loaded_model.predict(test_input)
        print(f"✅ Verification successful! Test prediction: {prediction[0]:.2f} m/s")
        
        return True
        
    except Exception as e:
        print(f"❌ Error saving model: {e}")
        return False

if __name__ == "__main__":
    print("🔧 Creating compatible cyclone model...")
    if save_cyclone_model():
        print("✅ Compatible cyclone model created successfully!")
        print("🚀 You can now restart the backend server.")
    else:
        print("❌ Failed to create compatible model!")
