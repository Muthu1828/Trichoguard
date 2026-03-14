from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import tensorflow as tf
import joblib
from PIL import Image
import io
import os
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get base path for models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load models with absolute paths
image_model = tf.keras.models.load_model(os.path.join(BASE_DIR, "scalp_model.h5"))
lifestyle_model = joblib.load(os.path.join(BASE_DIR, "lifestyle_model.pkl"))

@app.get("/")
async def health():
    return {"status": "ok", "message": "TrichoGuard API is running"}

# Reversing classes based on user feedback of inverted results
# Index 0 will now be Severe, Index 3 will be Healthy
classes = ["Severe", "Moderate", "Mild", "Healthy"]


@app.post("/predict")
async def predict(
    image: UploadFile = File(...),
    age: int = Form(...),
    gender: str = Form(...),
    stress: int = Form(...),
    sleep: int = Form(...),
    water: int = Form(...),
    diet: str = Form(...),
    exercise: str = Form(...),
    hairProduct: str = Form(...),
    smoking: str = Form(...),
    drinking: str = Form(...),
    familyHistory: str = Form(...)
):

    # -------- IMAGE PREDICTION --------
    contents = await image.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB").resize((224, 224))
    img = np.array(img).astype(np.float32) / 255.0
    img = np.expand_dims(img, axis=0)

    image_pred = image_model.predict(img)
    image_idx = int(np.argmax(image_pred))
    image_stage = classes[image_idx]

    # -------- LIFESTYLE PREDICTION --------
    gender_map = {"Female": 0, "Male": 1, "Other": 2}
    smoke_drink_map = {"Never smoked": 0, "Occasional smoker": 1, "Regular smoker": 2,
                       "Non drinker": 0, "Occasional drinker": 1, "Frequent drinker": 2}
    genetics_map = {"No family history": 0, "Father side": 1, "Mother side": 2, "Both sides": 3}
    diet_map = {"Poor - Junk food heavy": 0, "Average - Mixed diet": 1, "Healthy - Balanced diet": 2}
    hair_care_map = {"Minimal - Shampoo only": 0, "Moderate - Oil & conditioner": 1, "Heavy - Styling products": 2}
    activity_map = {"None": 0, "Light - 1-2 times/week": 1, "Moderate - 3-4 times/week": 2, "Heavy - Daily workout": 3}

    lifestyle_data = pd.DataFrame({
        "Age": [int(age)],
        "Gender": [gender_map.get(gender, 1)],
        "Stress": [int(stress)],
        "Sleep": [int(sleep)],
        "Water": [float(water)],
        "Diet": [diet_map.get(diet, 1)],
        "Exercise": [activity_map.get(exercise, 0)],
        "HairProduct": [hair_care_map.get(hairProduct, 0)],
        "Smoking": [smoke_drink_map.get(smoking, 0)],
        "Drinking": [smoke_drink_map.get(drinking, 0)],
        "FamilyHistory": [genetics_map.get(familyHistory, 0)]
    })

    lifestyle_pred = lifestyle_model.predict(lifestyle_data)
    lifestyle_idx = int(lifestyle_pred[0])
    lifestyle_stage = classes[lifestyle_idx]

    # -------- COMBINE RESULT --------
    # image_idx and lifestyle_idx are 0 for Severe, 3 for Healthy
    # We use 0.85 weight for the image as previously adjusted
    final_idx = int(round((0.85 * image_idx) + (0.15 * lifestyle_idx)))
    final_stage = classes[final_idx]

    # -------- REASONS & ANALYSIS (EXHAUSTIVE) --------
    reasons = []
    
    # 1. Primary Driver Explanation
    if image_idx < lifestyle_idx:
        reasons.append("PRIMARY DRIVER: Visual scalp analysis shows more advanced thinning than your lifestyle data suggests.")
    elif image_idx > lifestyle_idx:
        reasons.append("PRIMARY DRIVER: Your lifestyle risk factors are currently the main contributor to your hair health score.")
    else:
        reasons.append("PRIMARY DRIVER: Both visual indicators and lifestyle data are in sync for this assessment.")

    # 2. Specific Factor Deep-Dive
    if stress > 6: 
        reasons.append(f"STRESS (Level {stress}/10): High cortisol levels can prematurely trigger the shedding phase.")
    
    if water < 5: 
        reasons.append(f"HYDRATION ({water} glasses): Insufficient water intake makes hair fibers brittle and slows growth.")
    
    if sleep < 6: 
        reasons.append(f"SLEEP ({sleep} hrs): Inadequate rest prevents effective follicle cell regeneration.")
    
    if smoking != "Never smoked": 
        reasons.append(f"SMOKING ({smoking}): Nicotine restricts blood flow to the scalp, starving follicles of oxygen.")
    
    if "Poor" in diet: 
        reasons.append("DIET: Lack of essential proteins and vitamins (Biotin, Zinc) is impacting hair strength.")
    
    if "Heavy" in hairProduct: 
        reasons.append("PRODUCT USE: Frequent styling products may be causing scalp buildup and follicle suffocating.")
    
    if familyHistory != "No family history": 
        reasons.append(f"GENETICS ({familyHistory}): A higher hereditary predisposition to thinning patterns.")
    
    if exercise == "None":
        reasons.append("PHYSICAL ACTIVITY: Low heart rate activity reduces overall scalp circulation.")

    # Fallback for non-healthy stages with no specific triggers found
    if final_stage != "Healthy" and len(reasons) <= 1:
        reasons.append(f"Visual analysis confirms {final_stage.lower()} phase follicle miniaturization.")

    # -------- RECOMMENDATIONS ENGINE (EXHAUSTIVE) --------
    recommendations = []
    
    # 1. Input-Driven Action Cards
    if sleep < 7:
        recommendations.append({
            "title": "Optimize Circadian Rhythm",
            "description": "Hair follicles are metabolically active during deep sleep. Aim for consistent 7-9 hour cycles to support cellular repair.",
            "priority": "MEDIUM", "category": "Lifestyle"
        })
    
    if stress > 6:
        recommendations.append({
            "title": "Cortisol Regulation",
            "description": "Chronic stress pushes follicles into a 'resting' phase. Implement 10-min mindfulness or breathwork daily to lower cortisol.",
            "priority": "HIGH", "category": "Mindset"
        })

    if "Poor" in diet:
        recommendations.append({
            "title": "Follicle Nutrition Plan",
            "description": "Increase intake of Lean Proteins, Biotin-rich foods (eggs), and Zinc. Your current diet lacks essential building blocks.",
            "priority": "HIGH", "category": "Nutrition"
        })

    if exercise == "None":
        recommendations.append({
          "title": "Scalp Microcirculation",
          "description": "Light cardio 3x weekly increases heart rate and blood flow to the upper dermis, nourishing hair roots.",
          "priority": "MEDIUM", "category": "Physical"
        })

    if smoking != "Never smoked":
      recommendations.append({
          "title": "Vasoconstriction Alert",
          "description": "Nicotine restricts small blood vessels. Reducing intake is critical to ensuring oxygen reaches your hair follicles.",
          "priority": "HIGH", "category": "Urgent"
      })

    if "Heavy" in hairProduct:
      recommendations.append({
          "title": "Chemical Detox",
          "description": "Limit styling products for 14 days. Use a clarifying scalp scrub once a week to clear follicle-clogging buildup.",
          "priority": "MEDIUM", "category": "Scalp Care"
      })

    if water < 6:
        recommendations.append({
            "title": "Hydration Target",
            "description": "Maintain 3L of water daily. Hydration ensures the hair shaft remains elastic and less prone to breakage.",
            "priority": "LOW", "category": "Lifestyle"
        })

    # 2. Stage-Specific Clinical Baseline
    if final_stage == "Healthy":
        recommendations.append({
            "title": "Preventative Maintenance",
            "description": "Your scalp is currently in peak condition. Use pH-balanced cleansers to maintain the protective acid mantle.",
            "priority": "LOW", "category": "Daily Care"
        })
    elif final_stage == "Mild":
        recommendations.append({
            "title": "Early Intervention Tonics",
            "description": "Natural DHT blockers like Rosemary Oil or Caffeine tonics can help strengthen hair at the root level now.",
            "priority": "MEDIUM", "category": "Scalp Care"
        })
    elif final_stage == "Moderate":
        recommendations.append({
            "title": "Clinical Assessment",
            "description": "Consult a specialist to evaluate FDA-approved topicals. Moderate stages respond best to early medicinal support.",
            "priority": "HIGH", "category": "Medical"
        })
        recommendations.append({
            "title": "Dermal Stimulation",
            "description": "Daily 4-minute G-spot scalp massages can help increase hair thickness by stretching follicle cells.",
            "priority": "MEDIUM", "category": "Physical"
        })
    elif final_stage == "Severe":
        recommendations.append({
            "title": "Tri-Phase Restoration",
            "description": "Significant thinning requires clinical intervention. Discuss PRP (Platelet Rich Plasma) and Minoxidil with a trichologist.",
            "priority": "HIGH", "category": "Medical"
        })
        recommendations.append({
            "title": "Follicle Preservation",
            "description": "Avoid all heat, bleach, and tension. Your primary goal is to preserve existing dormant follicles.",
            "priority": "HIGH", "category": "Urgent"
        })

    # -------- POSITIVE FACTORS --------
    positive_factors = []
    if familyHistory == "No family history": positive_factors.append("No family history of hair loss reported")
    if sleep >= 8: positive_factors.append(f"Excellent sleep duration ({sleep} hours)")
    if stress <= 3: positive_factors.append("Very low stress levels")
    if smoking == "Never smoked": positive_factors.append("Non-smoker")
    if final_stage == "Healthy": positive_factors.append("No visible signs of thinning detected")

    # -------- CALCULATE METRICS --------
    def get_score_from_idx(idx):
        if idx == 3: return 95 # Healthy
        if idx == 2: return 80 # Mild
        if idx == 1: return 60 # Moderate
        return 40 # Severe

    scalp_health = int(get_score_from_idx(image_idx))
    hair_density = int(round(scalp_health * 1.03)) if final_stage == "Healthy" else int(round(scalp_health * 0.95))
    follicle_strength = int(round(scalp_health * 1.0)) if "Healthy" in diet else int(round(scalp_health * 0.9))
    oil_balance = 90 if "Minimal" in hairProduct else 80

    hair_density = int(min(98, hair_density))
    follicle_strength = int(min(98, follicle_strength))

    # Map our 4 classes to the 5 UI dots (0 to 4)
    ui_stage_map = {3: 0, 2: 1, 1: 2, 0: 4}
    
    return {
        "image_stage": str(image_stage),
        "lifestyle_stage": str(lifestyle_stage),
        "final_stage": str(final_stage),
        "stage_number": int(ui_stage_map.get(final_idx, 0)),
        "reasons": [str(r) for r in reasons],
        "recommendations": recommendations,
        "positive_factors": [str(p) for p in positive_factors],
        "metrics": {
            "scalp_health": int(scalp_health),
            "hair_density": int(hair_density),
            "follicle_strength": int(follicle_strength),
            "oil_balance": int(oil_balance)
        }
    }