from fastapi import APIRouter

from backend.models.plant_model import PlantDetailResponse
from backend.services.plant_service import get_plant_detail

router = APIRouter(tags=["plants"])


@router.get("/api/plants/{plant_id}", response_model=PlantDetailResponse)
async def read_plant_detail(plant_id: str) -> dict:
    return await get_plant_detail(plant_id)
