from pydantic import BaseModel, Field


class AchievementTierModel(BaseModel):
    goal: int
    xpReward: int


class AchievementTemplateModel(BaseModel):
    id: str
    title: str
    description: str
    iconKey: str
    iconSet: str | None = None
    emoji: str
    category: str
    createdAt: str
    updatedAt: str
    tiers: dict[str, AchievementTierModel] = Field(default_factory=dict)
