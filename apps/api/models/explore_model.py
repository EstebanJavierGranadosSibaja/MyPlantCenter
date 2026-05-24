from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TrendingPlant(BaseModel):
    id: str
    name: str
    scientificName: str
    imageUrl: Optional[str] = None
    detectionCount: int
    lastDetected: datetime

class RecentActivity(BaseModel):
    id: str
    userId: str
    userNickname: str
    plantName: str
    plantScientificName: str
    actionType: str  # "detected", "added", "updated"
    timestamp: datetime
    confidence: Optional[float] = None

class ExploreResponse(BaseModel):
    trendingPlants: List[TrendingPlant]
    recentActivity: List[RecentActivity]