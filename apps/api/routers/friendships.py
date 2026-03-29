from fastapi import APIRouter

from models.friendship_model import FriendshipModel
from services.friendship_service import get_user_friendships

router = APIRouter(tags=["friendships"])


@router.get("/api/users/{user_id}/friendships", response_model=list[FriendshipModel])
async def read_user_friendships(user_id: str) -> list[dict]:
    return await get_user_friendships(user_id)
