from fastapi import APIRouter

from models.care_schedule_model import CareScheduleModel
from services.care_schedule_service import get_user_care_schedule

router = APIRouter(tags=["care-schedule"])


@router.get("/api/users/{user_id}/care-schedule", response_model=list[CareScheduleModel])
async def read_user_care_schedule(user_id: str) -> list[dict]:
    return await get_user_care_schedule(user_id)
