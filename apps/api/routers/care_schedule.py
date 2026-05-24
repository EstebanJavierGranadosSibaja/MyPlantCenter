from fastapi import APIRouter, Depends

from models.care_schedule_model import CareScheduleModel
from services.care_schedule_service import get_user_care_schedule
from utils.auth import AuthContext, ensure_user_match, require_auth

router = APIRouter(tags=["care-schedule"])


@router.get("/api/users/{user_id}/care-schedule", response_model=list[CareScheduleModel])
async def read_user_care_schedule(
    user_id: str,
    current_user: AuthContext = Depends(require_auth),
) -> list[dict]:
    ensure_user_match(current_user, user_id)
    return await get_user_care_schedule(user_id)
