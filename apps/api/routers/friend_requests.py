from fastapi import APIRouter

from models.friend_request_model import FriendRequestCreateModel, FriendRequestModel, FriendRequestUpdateModel
from services.friend_request_service import create_friend_request, get_user_friend_requests, resolve_friend_request

router = APIRouter(tags=["friend-requests"])


@router.get("/api/users/{user_id}/friend-requests", response_model=list[FriendRequestModel])
async def read_user_friend_requests(user_id: str) -> list[dict]:
    return await get_user_friend_requests(user_id)


@router.post("/api/users/{user_id}/friend-requests", response_model=FriendRequestModel)
async def create_user_friend_request(user_id: str, payload: FriendRequestCreateModel) -> dict:
    return await create_friend_request(user_id, payload.toCode)


@router.patch("/api/friend-requests/{request_id}", response_model=FriendRequestModel)
async def patch_friend_request(request_id: str, payload: FriendRequestUpdateModel) -> dict:
    return await resolve_friend_request(request_id, payload.userId, payload.status)
