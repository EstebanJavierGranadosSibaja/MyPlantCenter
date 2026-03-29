from datetime import datetime

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
    wateringFrequencyDays: int
    careFrequencyPerWeek: int | None = None
    lastWatered: str | datetime
    description: str
    order: int
    createdAt: str | datetime
    updatedAt: str | datetime
    acquiredAt: str | datetime | None = None
    progressMetric: str | None = None


class PlantDetailResponse(BaseModel):
    plant: PlantModel
    tags: list[PlantTagModel] = Field(default_factory=list)
    issues: list[PlantIssueModel] = Field(default_factory=list)


class PlantCreateModel(BaseModel):
    name: str
    scientificName: str = ""
    categoryId: str
    wateringFrequencyDays: int | None = None
    careFrequencyPerWeek: int | None = None
    description: str = ""
    acquiredAt: str | None = None
