from fastapi import APIRouter

from models.plant_model import PlantCreateModel, PlantDetailResponse
from services.plant_service import create_plant, delete_plant, get_plant_detail, update_plant

router = APIRouter(tags=["plants"])


@router.get("/api/plants/{plant_id}", response_model=PlantDetailResponse)
async def read_plant_detail(plant_id: str) -> dict:
    return await get_plant_detail(plant_id)


@router.patch("/api/plants/{plant_id}", response_model=PlantDetailResponse)
async def patch_plant_detail(plant_id: str, payload: dict) -> dict:
    return await update_plant(plant_id, payload)


@router.post("/api/users/{user_id}/plants", response_model=PlantDetailResponse)
async def create_user_plant(user_id: str, payload: PlantCreateModel) -> dict:
    return await create_plant(user_id, payload.model_dump())


@router.delete("/api/plants/{plant_id}")
async def delete_plant_route(plant_id: str) -> dict:
    return await delete_plant(plant_id)
