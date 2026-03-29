from services.firestore_service import get_collection


async def get_user_plant_issues(user_id: str) -> list[dict]:
    return await get_collection(
        "plantIssues",
        filters=[("userId", "==", user_id)],
        order_by="detectedAt",
    )


async def get_plant_issues(plant_id: str) -> list[dict]:
    return await get_collection(
        "plantIssues",
        filters=[("plantId", "==", plant_id)],
        order_by="detectedAt",
    )
