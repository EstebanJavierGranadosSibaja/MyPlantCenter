from fastapi import APIRouter, Depends

from models.plant_detection_model import (
    PlantDetectionAnalyzeRequest,
    PlantDetectionAnalyzeResponse,
)
from services.plant_detection_service import analyze_plant_image
from utils.auth import AuthContext, ensure_user_match, require_auth

router = APIRouter(tags=["plant-detections"])


@router.post(
    "/api/users/{user_id}/plant-detections/analyze",
    response_model=PlantDetectionAnalyzeResponse,
)
async def analyze_user_plant_detection(
    user_id: str,
    payload: PlantDetectionAnalyzeRequest,
    current_user: AuthContext = Depends(require_auth),
) -> dict:
    ensure_user_match(current_user, user_id)
    return await analyze_plant_image(user_id, payload.model_dump())
