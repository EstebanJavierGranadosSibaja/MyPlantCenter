from pydantic import BaseModel


class FriendRequestModel(BaseModel):
    id: str
    fromUserId: str
    toUserId: str
    toCode: str
    status: str
    acceptedAt: str | None = None
    createdAt: str
    updatedAt: str


class FriendRequestCreateModel(BaseModel):
    toCode: str


class FriendRequestUpdateModel(BaseModel):
    userId: str
    status: str
