from fastapi import APIRouter

from models.plant_issue_model import PlantIssueModel
from services.plant_issue_service import get_plant_issues, get_user_plant_issues

router = APIRouter(tags=["plant-issues"])


@router.get("/api/users/{user_id}/plant-issues", response_model=list[PlantIssueModel])
async def read_user_plant_issues(user_id: str) -> list[dict]:
    return await get_user_plant_issues(user_id)


@router.get("/api/plants/{plant_id}/issues", response_model=list[PlantIssueModel])
async def read_plant_issues(plant_id: str) -> list[dict]:
    return await get_plant_issues(plant_id)
