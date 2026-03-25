from pydantic import BaseModel


class AuthUserModel(BaseModel):
    id: str
    profileId: str
    fullName: str
    email: str
    emailLower: str
    nickname: str
    method: str
    provider: str
    emailVerified: bool
    status: str
    lastLoginAt: str
    createdAt: str
    updatedAt: str
