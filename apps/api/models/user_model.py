from pydantic import BaseModel, Field

from .category_model import CategoryModel
from .plant_model import PlantModel


class UserStatsModel(BaseModel):
    plantsCount: int = 0
    friendsCount: int = 0
    wateredToday: int = 0
    activeDays: int = 0


class UserPrivacyModel(BaseModel):
    showStreak: bool = True
    showBirthday: bool = False
    allowRequests: bool = True


class UserNotificationsModel(BaseModel):
    wateringReminders: bool = True
    healthAlerts: bool = True
    newFriends: bool = True
    achievementsUnlocked: bool = True


class UserCreateModel(BaseModel):
    id: str
    authUserId: str
    name: str
    nickname: str
    email: str | None = None
    method: str | None = None
    provider: str | None = None
    emailVerified: bool | None = None


class UserPrivacyUpdateModel(BaseModel):
    showStreak: bool | None = None
    showBirthday: bool | None = None
    allowRequests: bool | None = None


class UserNotificationsUpdateModel(BaseModel):
    wateringReminders: bool | None = None
    healthAlerts: bool | None = None
    newFriends: bool | None = None
    achievementsUnlocked: bool | None = None


class UserUpdateModel(BaseModel):
    name: str | None = None
    nickname: str | None = None
    description: str | None = None
    birthday: str | None = None
    location: str | None = None
    visibility: str | None = None
    privacy: UserPrivacyUpdateModel | None = None
    notifications: UserNotificationsUpdateModel | None = None


class UserModel(BaseModel):
    id: str
    authUserId: str
    name: str | None = None
    displayName: str | None = None
    nickname: str
    friendCode: str
    description: str | None = None
    avatarUrl: str | None = None
    birthday: str | None = None
    location: str | None = None
    visibility: str
    favoritePlantId: str | None = None
    streakDays: int
    bestStreak: int
    lastActivityDate: str | None = None
    lastActiveAt: str | None = None
    streakFrozenUntil: str | None = None
    level: int
    xp: int
    xpMax: int | None = None
    stats: UserStatsModel = Field(default_factory=UserStatsModel)
    registeredAt: str
    updatedAt: str
    privacy: UserPrivacyModel = Field(default_factory=UserPrivacyModel)
    notifications: UserNotificationsModel | None = None
    notificationPrefs: UserNotificationsModel | None = None


class UserInfoTileModel(BaseModel):
    key: str
    label: str
    value: str


class UserProfileResponse(BaseModel):
    user: UserModel
    categories: list[CategoryModel] = Field(default_factory=list)
    favoritePlant: PlantModel | None = None
