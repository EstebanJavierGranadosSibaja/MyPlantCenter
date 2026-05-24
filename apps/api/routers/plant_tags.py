from fastapi import APIRouter, Depends

from models.plant_tag_model import PlantTagModel
from services.plant_tag_service import get_user_plant_tags
from utils.auth import AuthContext, ensure_user_match, require_auth

router = APIRouter(tags=["plant-tags"])


@router.get("/api/users/{user_id}/plant-tags", response_model=list[PlantTagModel])
async def read_user_plant_tags(
    user_id: str,
    current_user: AuthContext = Depends(require_auth),
) -> list[dict]:
    ensure_user_match(current_user, user_id)
    return await get_user_plant_tags(user_id)
