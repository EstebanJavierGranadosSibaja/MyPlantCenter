from fastapi import APIRouter

from backend.models.plant_model import PlantDetailResponse
from backend.services.plant_service import get_plant_detail, update_plant

router = APIRouter(tags=["plants"])


@router.get("/api/plants/{plant_id}", response_model=PlantDetailResponse)
async def read_plant_detail(plant_id: str) -> dict:
    return await get_plant_detail(plant_id)


@router.patch("/api/plants/{plant_id}", response_model=PlantDetailResponse)
async def patch_plant_detail(plant_id: str, payload: dict) -> dict:
    return await update_plant(plant_id, payload)
