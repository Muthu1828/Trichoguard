import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

df = pd.read_csv("../data/hair_fall_dataset.csv")

features = [
    "Age","Gender","Sleep_Duration","Smoking_Habit","Drinking_Habit",
    "Genetics","Stress_Level","Diet_Quality","Water_Intake",
    "Hair_Care_Routine","Activity_Level"
]

X = df[features]
y = df["Hair_Fall_Level"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(n_estimators=300, random_state=42)
model.fit(X_train, y_train)

pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, pred))

joblib.dump(model, "../models/lifestyle_model.pkl")
print("Lifestyle model saved successfully")
