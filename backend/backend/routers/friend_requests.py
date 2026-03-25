from fastapi import APIRouter

from backend.models.friend_request_model import FriendRequestModel
from backend.services.friend_request_service import get_user_friend_requests

router = APIRouter(tags=["friend-requests"])


@router.get("/api/users/{user_id}/friend-requests", response_model=list[FriendRequestModel])
async def read_user_friend_requests(user_id: str) -> list[dict]:
    return await get_user_friend_requests(user_id)
