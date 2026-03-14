from fastapi import APIRouter
from app.services.lifestyle_model import predict_lifestyle

router = APIRouter()

@router.post("/predict/lifestyle")
def lifestyle_prediction(data: dict):
    return predict_lifestyle(data)
