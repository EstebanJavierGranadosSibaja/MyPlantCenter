from backend.services.firestore_service import get_collection


async def get_user_categories(user_id: str) -> list[dict]:
    return await get_collection(f"users/{user_id}/categories", order_by="order")
