from fastapi import APIRouter

from backend.models.notification_model import NotificationModel
from backend.services.notification_service import get_user_notifications

router = APIRouter(tags=["notifications"])


@router.get("/api/users/{user_id}/notifications", response_model=list[NotificationModel])
async def read_user_notifications(user_id: str) -> list[dict]:
    return await get_user_notifications(user_id)
