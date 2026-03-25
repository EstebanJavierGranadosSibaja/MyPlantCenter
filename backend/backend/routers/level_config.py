from fastapi import APIRouter

from backend.models.level_config_model import LevelConfigModel
from backend.services.level_config_service import get_level_config_by_level, list_level_config

router = APIRouter(tags=["level-config"])


@router.get("/api/level-config", response_model=list[LevelConfigModel])
async def read_level_config() -> list[dict]:
    return await list_level_config()


@router.get("/api/level-config/{level}", response_model=LevelConfigModel)
async def read_level_config_by_level(level: int) -> dict:
    return await get_level_config_by_level(level)
