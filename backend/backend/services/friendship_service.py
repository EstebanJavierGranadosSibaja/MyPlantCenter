from backend.services.firestore_service import get_collection


async def get_user_friendships(user_id: str) -> list[dict]:
    return await get_collection(
        "friendships",
        filters=[("participants", "array_contains", user_id)],
        order_by="createdAt",
    )
