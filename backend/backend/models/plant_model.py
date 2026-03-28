from pydantic import BaseModel, Field

from .plant_issue_model import PlantIssueModel
from .plant_tag_model import PlantTagModel


class PlantModel(BaseModel):
    id: str
    userId: str
    categoryId: str
    name: str
    nickname: str
    scientificName: str
    iconKey: str
    iconSet: str | None = None
    iconEmoji: str | None = None
    healthStatus: int
    progress: int
    favorite: bool
    careFrequencyPerWeek: int
    lastWatered: str
    description: str
    order: int
    createdAt: str
    updatedAt: str
    progressMetric: str | None = None


class PlantDetailResponse(BaseModel):
    plant: PlantModel
    tags: list[PlantTagModel] = Field(default_factory=list)
    issues: list[PlantIssueModel] = Field(default_factory=list)
