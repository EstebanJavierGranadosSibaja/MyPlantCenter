from fastapi import APIRouter, Depends

from models.achievement_model import AchievementModel
from services.achievement_service import get_user_achievements
from utils.auth import AuthContext, ensure_user_match, require_auth

router = APIRouter(tags=["achievements"])


@router.get("/api/users/{user_id}/achievements", response_model=list[AchievementModel])
async def read_user_achievements(
    user_id: str,
    current_user: AuthContext = Depends(require_auth),
) -> list[dict]:
    ensure_user_match(current_user, user_id)
    return await get_user_achievements(user_id)
