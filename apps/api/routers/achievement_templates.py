from fastapi import APIRouter, Depends

from models.achievement_template_model import AchievementTemplateModel
from services.achievement_template_service import list_achievement_templates
from utils.auth import AuthContext, require_auth

router = APIRouter(tags=["achievement-templates"])


@router.get("/api/achievement-templates", response_model=list[AchievementTemplateModel])
async def read_achievement_templates(
    current_user: AuthContext = Depends(require_auth),
) -> list[dict]:
    return await list_achievement_templates()
