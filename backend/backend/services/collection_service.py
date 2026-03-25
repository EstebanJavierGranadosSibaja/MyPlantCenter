from backend.services.firestore_service import get_collection


async def read_collection(collection_path: str) -> dict:
    items = await get_collection(collection_path)
    return {
        "collection": collection_path,
        "count": len(items),
        "items": items,
    }
