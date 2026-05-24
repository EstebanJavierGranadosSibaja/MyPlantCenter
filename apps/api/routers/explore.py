from fastapi import APIRouter, Depends

from models.explore_model import ExploreResponse, RecentActivity, TrendingPlant
from services.explore_service import ExploreService
from utils.auth import AuthContext, require_auth

router = APIRouter(tags=["explore"])
explore_service = ExploreService()


@router.get("/api/explore/trending-plants", response_model=list[TrendingPlant])
async def get_trending_plants(
    current_user: AuthContext = Depends(require_auth),
) -> list[TrendingPlant]:
    """Get trending plants for explore section"""
    return explore_service.get_trending_plants()


@router.get("/api/explore/recent-activity", response_model=list[RecentActivity])
async def get_recent_activity(
    current_user: AuthContext = Depends(require_auth),
) -> list[RecentActivity]:
    """Get recent activity for explore section"""
    return explore_service.get_recent_activity()


@router.get("/api/explore", response_model=ExploreResponse)
async def get_explore_data(
    current_user: AuthContext = Depends(require_auth),
) -> ExploreResponse:
    """Get complete explore data"""
    return explore_service.get_explore_data()
