import joblib
import tensorflow as tf

print("Testing Lifestyle Model...")
life_model = joblib.load("models/lifestyle_model.pkl")
print("Lifestyle model loaded ✅")

print("Testing Image Model...")
img_model = tf.keras.models.load_model("models/hairfall_cnn.h5")
print("Image model loaded ✅")
