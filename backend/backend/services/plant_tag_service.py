from backend.services.firestore_service import get_collection


async def get_user_plant_tags(user_id: str) -> list[dict]:
    return await get_collection(
        "plantTags",
        filters=[("userId", "==", user_id)],
        order_by="order",
    )
