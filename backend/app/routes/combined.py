from asyncio import sleep

from fastapi import APIRouter, UploadFile, File, Form
from app.services.image_model import predict_image
from app.services.lifestyle_model import predict_lifestyle
from app.services.fusion import fuse_predictions
from app.services.rule_engine import generate_explanation

router = APIRouter(prefix="/predict", tags=["Combined Prediction"])

@router.post("/combined")
async def combined_prediction(
    image: UploadFile = File(...),
    age: int = Form(...),
    gender: str = Form(...),
    water: int = Form(...),
    diet: int = Form(...),
    sleep: int = Form(...),
    smoking: int = Form(...),
    alcohol: int = Form(...),
    stress: int = Form(...),
    activity: int = Form(...),
    genetics: int = Form(...)
):

    # Image prediction
    image_pred = predict_image(image)

    # Lifestyle prediction
    lifestyle_pred = predict_lifestyle(age, gender, diet, water, sleep,smoking, alcohol, stress, activity, genetics)

    # Fusion
    final_pred = fuse_predictions(image_pred, lifestyle_pred["severity"])

    # Explanation
    cause, prevention = generate_explanation(
        final_pred,
        diet,
        stress,
        water
    )

    return {
        "image_severity": image_pred,
        "lifestyle_severity": lifestyle_pred["severity"],
        "final_severity": final_pred,
        "cause": cause,
        "prevention": prevention
    }