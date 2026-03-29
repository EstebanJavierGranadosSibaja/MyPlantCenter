from services.firestore_service import get_collection


async def get_user_achievements(user_id: str) -> list[dict]:
    achievements = await get_collection(
        "achievements",
        filters=[("userId", "==", user_id)],
    )
    return sorted(achievements, key=lambda item: item.get("createdAt") or "")
