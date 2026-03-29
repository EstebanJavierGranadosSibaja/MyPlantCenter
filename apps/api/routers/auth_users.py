from fastapi import APIRouter

from models.auth_user_model import AuthUserModel
from services.auth_user_service import get_auth_user, list_auth_users

router = APIRouter(prefix="/api/auth-users", tags=["auth-users"])


@router.get("", response_model=list[AuthUserModel])
async def read_auth_users() -> list[dict]:
    return await list_auth_users()


@router.get("/{auth_user_id}", response_model=AuthUserModel)
async def read_auth_user(auth_user_id: str) -> dict:
    return await get_auth_user(auth_user_id)
