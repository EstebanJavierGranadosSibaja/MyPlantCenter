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
