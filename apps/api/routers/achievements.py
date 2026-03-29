from fastapi import APIRouter

from models.achievement_model import AchievementModel
from services.achievement_service import get_user_achievements

router = APIRouter(tags=["achievements"])


@router.get("/api/users/{user_id}/achievements", response_model=list[AchievementModel])
async def read_user_achievements(user_id: str) -> list[dict]:
    return await get_user_achievements(user_id)
