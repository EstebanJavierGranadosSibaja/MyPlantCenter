from fastapi import APIRouter

from backend.models.category_model import CategoryModel
from backend.services.category_service import get_user_categories

router = APIRouter(tags=["categories"])


@router.get("/api/users/{user_id}/categories", response_model=list[CategoryModel])
async def read_user_categories(user_id: str) -> list[dict]:
    return await get_user_categories(user_id)
