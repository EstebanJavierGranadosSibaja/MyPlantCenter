from services.firestore_service import get_collection


async def get_user_notifications(user_id: str) -> list[dict]:
    results = await get_collection(
        "notifications",
        filters=[("userId", "==", user_id)],
    )
    return sorted(results, key=lambda r: r.get("createdAt") or "", reverse=True)
