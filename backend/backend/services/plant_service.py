from backend.services.firestore_service import get_collection, get_document


async def get_user_plants(user_id: str) -> list[dict]:
    return await get_collection("plants", filters=[("userId", "==", user_id)], order_by="order")


async def get_plant_detail(plant_id: str) -> dict:
    plant = await get_document("plants", plant_id)
    tags = await get_collection("plantTags", filters=[("plantId", "==", plant_id)], order_by="order")
    issues = await get_collection("plantIssues", filters=[("plantId", "==", plant_id)], order_by="detectedAt")
    return {"plant": plant, "tags": tags, "issues": issues}
