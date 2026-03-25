from fastapi import APIRouter

from backend.models.achievement_template_model import AchievementTemplateModel
from backend.services.achievement_template_service import list_achievement_templates

router = APIRouter(tags=["achievement-templates"])


@router.get("/api/achievement-templates", response_model=list[AchievementTemplateModel])
async def read_achievement_templates() -> list[dict]:
    return await list_achievement_templates()
