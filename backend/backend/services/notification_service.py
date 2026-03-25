from backend.services.firestore_service import get_collection


async def get_user_notifications(user_id: str) -> list[dict]:
    return await get_collection(
        "notifications",
        filters=[("userId", "==", user_id)],
        order_by="createdAt",
    )
