from backend.services.firestore_service import get_collection
from backend.utils.response import error_response


async def list_level_config() -> list[dict]:
    return await get_collection("levelConfig", order_by="level")


async def get_level_config_by_level(level: int) -> dict:
    levels = await get_collection("levelConfig", filters=[("level", "==", level)])
    if not levels:
        error_response(404, f"No se encontro configuracion de nivel para level={level}.")
    return levels[0]
