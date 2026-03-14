import os
import tensorflow as tf
import joblib

def test_load():
    print("Starting model load test...")
    try:
        print("Loading image model...")
        img_model = tf.keras.models.load_model("scalp_model.h5")
        print("✅ Image model loaded")
        
        print("Loading lifestyle model...")
        lst_model = joblib.load("lifestyle_model.pkl")
        print("✅ Lifestyle model loaded")
        
        return True
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        return False

if __name__ == "__main__":
    test_load()
