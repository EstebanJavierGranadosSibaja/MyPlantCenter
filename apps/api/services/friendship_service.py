from services.firestore_service import get_collection


async def get_user_friendships(user_id: str) -> list[dict]:
    friendships = await get_collection(
        "friendships",
        filters=[("participants", "array_contains", user_id)],
    )
    return sorted(friendships, key=lambda item: item.get("createdAt", ""))
