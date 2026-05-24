from fastapi import APIRouter, Depends

from models.plant_issue_model import PlantIssueModel
from services.plant_issue_service import get_plant_issues, get_user_plant_issues
from services.plant_service import assert_plant_owner
from utils.auth import AuthContext, ensure_user_match, require_auth

router = APIRouter(tags=["plant-issues"])


@router.get("/api/users/{user_id}/plant-issues", response_model=list[PlantIssueModel])
async def read_user_plant_issues(
    user_id: str,
    current_user: AuthContext = Depends(require_auth),
) -> list[dict]:
    ensure_user_match(current_user, user_id)
    return await get_user_plant_issues(user_id)


@router.get("/api/plants/{plant_id}/issues", response_model=list[PlantIssueModel])
async def read_plant_issues(
    plant_id: str,
    current_user: AuthContext = Depends(require_auth),
) -> list[dict]:
    await assert_plant_owner(plant_id, current_user.uid)
    return await get_plant_issues(plant_id)
