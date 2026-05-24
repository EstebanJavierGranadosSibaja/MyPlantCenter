from fastapi import APIRouter, Depends

from models.notification_model import NotificationModel
from services.notification_service import get_user_notifications
from utils.auth import AuthContext, ensure_user_match, require_auth

router = APIRouter(tags=["notifications"])


@router.get("/api/users/{user_id}/notifications", response_model=list[NotificationModel])
async def read_user_notifications(
    user_id: str,
    current_user: AuthContext = Depends(require_auth),
) -> list[dict]:
    ensure_user_match(current_user, user_id)
    return await get_user_notifications(user_id)
