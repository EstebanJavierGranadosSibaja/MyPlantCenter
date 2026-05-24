from fastapi import APIRouter, Depends

from models.care_history_model import CareHistoryCreateModel, CareHistoryModel
from services.care_history_service import create_care_history, get_user_care_history
from utils.auth import AuthContext, ensure_user_match, require_auth

router = APIRouter(tags=["care-history"])


@router.get("/api/users/{user_id}/care-history", response_model=list[CareHistoryModel])
async def read_user_care_history(
    user_id: str,
    current_user: AuthContext = Depends(require_auth),
) -> list[dict]:
    ensure_user_match(current_user, user_id)
    return await get_user_care_history(user_id)


@router.post("/api/users/{user_id}/care-history", response_model=CareHistoryModel)
async def create_user_care_history(
    user_id: str,
    payload: CareHistoryCreateModel,
    current_user: AuthContext = Depends(require_auth),
) -> dict:
    ensure_user_match(current_user, user_id)
    return await create_care_history(user_id, payload.model_dump())
