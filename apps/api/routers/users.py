from fastapi import APIRouter, Depends

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
    get_user_visibility,
    update_user,
)
from utils.auth import AuthContext, ensure_public_profile_or_owner, ensure_user_match, require_auth

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("", response_model=UserModel)
async def create_user_route(
    payload: UserCreateModel,
    current_user: AuthContext = Depends(require_auth),
) -> dict:
    ensure_user_match(current_user, payload.id)
    ensure_user_match(current_user, payload.authUserId)
    return await create_user(payload.model_dump())


@router.get("/{user_id}", response_model=UserModel)
async def read_user(
    user_id: str,
    current_user: AuthContext = Depends(require_auth),
) -> dict:
    ensure_user_match(current_user, user_id)
    return await get_user(user_id)


@router.patch("/{user_id}", response_model=UserModel)
async def patch_user(
    user_id: str,
    payload: UserUpdateModel,
    current_user: AuthContext = Depends(require_auth),
) -> dict:
    ensure_user_match(current_user, user_id)
    return await update_user(user_id, payload.model_dump(exclude_unset=True))


@router.get("/{user_id}/profile", response_model=UserProfileResponse)
async def read_user_profile(
    user_id: str,
    current_user: AuthContext = Depends(require_auth),
) -> dict:
    visibility = await get_user_visibility(user_id)
    ensure_public_profile_or_owner(current_user, user_id, is_public=visibility == "public")
    return await get_user_profile(user_id)


@router.get("/{user_id}/plants", response_model=list[PlantModel])
async def read_user_plants(
    user_id: str,
    current_user: AuthContext = Depends(require_auth),
) -> list[dict]:
    ensure_user_match(current_user, user_id)
    return await get_user_plants_list(user_id)


@router.get("/{user_id}/stats", response_model=UserStatsModel)
async def read_user_stats(
    user_id: str,
    current_user: AuthContext = Depends(require_auth),
) -> dict:
    ensure_user_match(current_user, user_id)
    return await get_user_stats(user_id)


@router.get("/{user_id}/info-tiles", response_model=list[UserInfoTileModel])
async def read_user_info_tiles(
    user_id: str,
    current_user: AuthContext = Depends(require_auth),
) -> list[dict]:
    ensure_user_match(current_user, user_id)
    return await get_user_info_tiles(user_id)
