from fastapi import APIRouter, Depends

from models.friendship_model import FriendshipModel, FriendSummaryModel
from services.friendship_service import get_user_friends, get_user_friendships
from utils.auth import AuthContext, ensure_user_match, require_auth

router = APIRouter(tags=["friendships"])


@router.get("/api/users/{user_id}/friendships", response_model=list[FriendshipModel])
async def read_user_friendships(
    user_id: str,
    current_user: AuthContext = Depends(require_auth),
) -> list[dict]:
    ensure_user_match(current_user, user_id)
    return await get_user_friendships(user_id)


@router.get("/api/users/{user_id}/friends", response_model=list[FriendSummaryModel])
async def read_user_friends(
    user_id: str,
    current_user: AuthContext = Depends(require_auth),
) -> list[dict]:
    ensure_user_match(current_user, user_id)
    return await get_user_friends(user_id)
