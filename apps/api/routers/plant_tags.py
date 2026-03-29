from fastapi import APIRouter

from models.plant_tag_model import PlantTagModel
from services.plant_tag_service import get_user_plant_tags

router = APIRouter(tags=["plant-tags"])


@router.get("/api/users/{user_id}/plant-tags", response_model=list[PlantTagModel])
async def read_user_plant_tags(user_id: str) -> list[dict]:
    return await get_user_plant_tags(user_id)
