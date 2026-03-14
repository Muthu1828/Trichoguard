from fastapi import APIRouter, UploadFile, File
from app.services.image_model import predict_image

router = APIRouter(prefix="/predict", tags=["Image Prediction"])

@router.post("/image")
async def image_prediction(file: UploadFile = File(...)):
    result = predict_image(file)

    severity_map = {0: "Low", 1: "Moderate", 2: "High"}

    return {
        "prediction": severity_map[result["severity"]],
        "confidence": result["confidence"]
    }
