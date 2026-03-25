from backend.services.firestore_service import get_collection


async def get_user_care_history(user_id: str) -> list[dict]:
    return await get_collection(
        "careHistory",
        filters=[("userId", "==", user_id)],
        order_by="completedAt",
    )
