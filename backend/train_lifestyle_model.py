import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
df = pd.read_csv("data/hair_fall_dataset.csv")

# 🎯 Features (ONLY NUMERIC INPUTS)
features = [
    "Age",
    "Gender",
    "Sleep_Duration",
    "Smoking_Habit",
    "Drinking_Habit",
    "Genetics",
    "Stress_Level",
    "Diet_Quality",
    "Water_Intake",
    "Hair_Care_Routine",
    "Activity_Level"
]

X = df[features]
y = df["Hair_Fall_Level"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Model
model = RandomForestClassifier(
    n_estimators=150,
    random_state=42
)
model.fit(X_train, y_train)

# Accuracy
preds = model.predict(X_test)
print("Lifestyle Model Accuracy:", accuracy_score(y_test, preds))

# Save model
joblib.dump(model, "models/lifestyle_model.pkl")
print("✅ Lifestyle model saved")
