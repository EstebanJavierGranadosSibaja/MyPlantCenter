from backend.services.firestore_service import get_collection


async def list_achievement_templates() -> list[dict]:
    return await get_collection("achievementTemplates", order_by="createdAt")
