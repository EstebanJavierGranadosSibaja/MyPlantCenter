from pydantic import BaseModel, Field


class FriendshipModel(BaseModel):
    id: str
    participants: list[str] = Field(default_factory=list)
    createdAt: str
    updatedAt: str
