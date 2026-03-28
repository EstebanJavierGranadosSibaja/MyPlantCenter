from pydantic import BaseModel


class AchievementModel(BaseModel):
    id: str
    userId: str
    templateId: str
    tier: str
    progress: int
    type: str
    unlocked: bool
    unlockedAt: str | None = None
    notified: bool
    createdAt: str
    updatedAt: str
