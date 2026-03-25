from backend.services.firestore_service import get_collection


async def get_user_care_schedule(user_id: str) -> list[dict]:
    return await get_collection(
        "careSchedule",
        filters=[("userId", "==", user_id)],
        order_by="scheduledFor",
    )
