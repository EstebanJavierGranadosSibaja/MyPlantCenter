from fastapi import APIRouter, Depends

from models.level_config_model import LevelConfigModel
from services.level_config_service import get_level_config_by_level, list_level_config
from utils.auth import AuthContext, require_auth

router = APIRouter(tags=["level-config"])


@router.get("/api/level-config", response_model=list[LevelConfigModel])
async def read_level_config(
    current_user: AuthContext = Depends(require_auth),
) -> list[dict]:
    return await list_level_config()


@router.get("/api/level-config/{level}", response_model=LevelConfigModel)
async def read_level_config_by_level(
    level: int,
    current_user: AuthContext = Depends(require_auth),
) -> dict:
    return await get_level_config_by_level(level)
