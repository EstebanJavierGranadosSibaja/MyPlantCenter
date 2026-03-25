from fastapi import APIRouter

from backend.models.common_model import ApiCollectionResponse
from backend.services.collection_service import read_collection

router = APIRouter(tags=["collections"])


@router.get("/api/collections/{collection_path:path}", response_model=ApiCollectionResponse)
async def read_collection_route(collection_path: str) -> dict:
    return await read_collection(collection_path)
