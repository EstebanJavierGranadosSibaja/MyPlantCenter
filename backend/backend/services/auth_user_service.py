from backend.services.firestore_service import get_collection, get_document


async def get_auth_user(auth_user_id: str) -> dict:
    return await get_document("authUsers", auth_user_id)


async def list_auth_users() -> list[dict]:
    return await get_collection("authUsers", order_by="createdAt")
