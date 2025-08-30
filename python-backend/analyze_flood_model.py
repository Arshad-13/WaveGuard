import pickle
import numpy as np
import os

def analyze_flood_model():
    """Analyze the flood prediction model to understand its structure"""
    model_path = "models/best_flood_prediction_lr_model.pkl"
    
    try:
        with open(model_path, 'rb') as f:
            model_data = pickle.load(f)
        
        print("Model loaded successfully!")
        print(f"Type: {type(model_data)}")
        
        if isinstance(model_data, dict):
            print("\nModel is a dictionary with keys:")
            for key in model_data.keys():
                print(f"  - {key}: {type(model_data[key])}")
                
            if 'feature_columns' in model_data:
                print(f"\nFeature columns: {model_data['feature_columns']}")
            if 'model' in model_data:
                print(f"Model type: {type(model_data['model'])}")
                if hasattr(model_data['model'], 'feature_names_in_'):
                    print(f"Features: {model_data['model'].feature_names_in_}")
                if hasattr(model_data['model'], 'n_features_in_'):
                    print(f"Number of features: {model_data['model'].n_features_in_}")
        else:
            print(f"\nModel is of type: {type(model_data)}")
            if hasattr(model_data, 'feature_names_in_'):
                print(f"Features: {model_data.feature_names_in_}")
            if hasattr(model_data, 'n_features_in_'):
                print(f"Number of features: {model_data.n_features_in_}")
                
    except Exception as e:
        print(f"Error loading model: {e}")

if __name__ == "__main__":
    analyze_flood_model()
