from fastapi import APIRouter

from backend.models.friendship_model import FriendshipModel
from backend.services.friendship_service import get_user_friendships

router = APIRouter(tags=["friendships"])


@router.get("/api/users/{user_id}/friendships", response_model=list[FriendshipModel])
async def read_user_friendships(user_id: str) -> list[dict]:
    return await get_user_friendships(user_id)
