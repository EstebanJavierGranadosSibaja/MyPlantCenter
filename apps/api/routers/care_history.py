from fastapi import APIRouter

from models.care_history_model import CareHistoryModel
from services.care_history_service import get_user_care_history

router = APIRouter(tags=["care-history"])


@router.get("/api/users/{user_id}/care-history", response_model=list[CareHistoryModel])
async def read_user_care_history(user_id: str) -> list[dict]:
    return await get_user_care_history(user_id)
