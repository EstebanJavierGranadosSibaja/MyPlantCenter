from pydantic import BaseModel, Field


class AchievementTierModel(BaseModel):
    tier: str
    goal: int
    xpReward: int


class AchievementTemplateModel(BaseModel):
    id: str
    title: str
    description: str
    iconKey: str
    iconSet: str
    emoji: str
    category: str
    createdAt: str
    updatedAt: str
    tiers: list[AchievementTierModel] = Field(default_factory=list)
