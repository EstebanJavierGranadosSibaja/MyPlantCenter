from fastapi import APIRouter

from models.plant_model import PlantModel
from models.user_model import (
    UserCreateModel,
    UserInfoTileModel,
    UserModel,
    UserProfileResponse,
    UserStatsModel,
    UserUpdateModel,
)
from services.user_service import (
    create_user,
    get_user,
    get_user_info_tiles,
    get_user_plants_list,
    get_user_profile,
    get_user_stats,
    update_user,
)

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("", response_model=UserModel)
async def create_user_route(payload: UserCreateModel) -> dict:
    return await create_user(payload.model_dump())


@router.get("/{user_id}", response_model=UserModel)
async def read_user(user_id: str) -> dict:
    return await get_user(user_id)


@router.patch("/{user_id}", response_model=UserModel)
async def patch_user(user_id: str, payload: UserUpdateModel) -> dict:
    return await update_user(user_id, payload.model_dump(exclude_unset=True))


@router.get("/{user_id}/profile", response_model=UserProfileResponse)
async def read_user_profile(user_id: str) -> dict:
    return await get_user_profile(user_id)


@router.get("/{user_id}/plants", response_model=list[PlantModel])
async def read_user_plants(user_id: str) -> list[dict]:
    return await get_user_plants_list(user_id)


@router.get("/{user_id}/stats", response_model=UserStatsModel)
async def read_user_stats(user_id: str) -> dict:
    return await get_user_stats(user_id)


@router.get("/{user_id}/info-tiles", response_model=list[UserInfoTileModel])
async def read_user_info_tiles(user_id: str) -> list[dict]:
    return await get_user_info_tiles(user_id)
