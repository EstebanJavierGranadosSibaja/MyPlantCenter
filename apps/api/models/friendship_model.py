from pydantic import BaseModel, Field


class FriendshipModel(BaseModel):
    id: str
    participants: list[str] = Field(default_factory=list)
    createdAt: str
    updatedAt: str


class FriendSummaryModel(BaseModel):
    id: str
    name: str
    nickname: str
    avatarUrl: str | None = None
    level: int = 1
    visibility: str = "public"
    plantsCount: int = 0
    streakDays: int = 0
    friendshipId: str
    friendsSince: str | None = None
