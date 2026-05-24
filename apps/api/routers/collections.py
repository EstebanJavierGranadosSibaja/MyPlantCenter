from fastapi import APIRouter, Depends

from models.common_model import ApiCollectionResponse
from services.collection_service import read_collection
from utils.auth import AuthContext, require_admin

router = APIRouter(tags=["collections"])


@router.get("/api/collections/{collection_path:path}", response_model=ApiCollectionResponse)
async def read_collection_route(
    collection_path: str,
    current_user: AuthContext = Depends(require_admin),
) -> dict:
    return await read_collection(collection_path)
