from fastapi import APIRouter

from models.plant_detection_model import (
    PlantDetectionAnalyzeRequest,
    PlantDetectionAnalyzeResponse,
)
from services.plant_detection_service import analyze_plant_image

router = APIRouter(tags=["plant-detections"])


@router.post(
    "/api/users/{user_id}/plant-detections/analyze",
    response_model=PlantDetectionAnalyzeResponse,
)
async def analyze_user_plant_detection(
    user_id: str,
    payload: PlantDetectionAnalyzeRequest,
) -> dict:
    return await analyze_plant_image(user_id, payload.model_dump())
