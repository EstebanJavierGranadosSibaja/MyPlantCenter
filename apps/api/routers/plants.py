from fastapi import APIRouter, Depends

from models.plant_model import PlantCreateModel, PlantDetailResponse
from services.plant_service import create_plant, delete_plant, get_plant_detail, update_plant
from utils.auth import AuthContext, ensure_user_match, require_auth

router = APIRouter(tags=["plants"])


@router.get("/api/plants/{plant_id}", response_model=PlantDetailResponse)
async def read_plant_detail(
    plant_id: str,
    current_user: AuthContext = Depends(require_auth),
) -> dict:
    return await get_plant_detail(plant_id, user_id=current_user.uid)


@router.patch("/api/plants/{plant_id}", response_model=PlantDetailResponse)
async def patch_plant_detail(
    plant_id: str,
    payload: dict,
    current_user: AuthContext = Depends(require_auth),
) -> dict:
    return await update_plant(plant_id, payload, user_id=current_user.uid)


@router.post("/api/users/{user_id}/plants", response_model=PlantDetailResponse)
async def create_user_plant(
    user_id: str,
    payload: PlantCreateModel,
    current_user: AuthContext = Depends(require_auth),
) -> dict:
    ensure_user_match(current_user, user_id)
    return await create_plant(user_id, payload.model_dump())


@router.delete("/api/plants/{plant_id}")
async def delete_plant_route(
    plant_id: str,
    current_user: AuthContext = Depends(require_auth),
) -> dict:
    return await delete_plant(plant_id, user_id=current_user.uid)
