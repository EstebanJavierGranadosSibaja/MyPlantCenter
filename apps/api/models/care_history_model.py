from pydantic import BaseModel


class CareHistoryModel(BaseModel):
    id: str
    userId: str
    plantId: str
    scheduleId: str | None = None
    type: str
    createdAt: str
    completedAt: str
    notes: str | None = None
    updatedAt: str


class CareHistoryCreateModel(BaseModel):
    plantId: str
    type: str = "watering"
    completedAt: str | None = None
    scheduleId: str | None = None
    notes: str | None = None
    idempotencyKey: str | None = None
