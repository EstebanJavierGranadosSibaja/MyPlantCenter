from services.firestore_service import get_collection


async def get_user_categories(user_id: str) -> list[dict]:
    categories = await get_collection("categories", filters=[("userId", "==", user_id)])
    return sorted(categories, key=lambda category: category.get("order") or 0)
