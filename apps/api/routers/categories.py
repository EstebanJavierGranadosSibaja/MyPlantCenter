from fastapi import APIRouter, Depends

from models.category_model import CategoryModel
from services.category_service import get_user_categories
from utils.auth import AuthContext, ensure_user_match, require_auth

router = APIRouter(tags=["categories"])


@router.get("/api/users/{user_id}/categories", response_model=list[CategoryModel])
async def read_user_categories(
    user_id: str,
    current_user: AuthContext = Depends(require_auth),
) -> list[dict]:
    ensure_user_match(current_user, user_id)
    return await get_user_categories(user_id)
