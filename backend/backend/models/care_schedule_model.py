from pydantic import BaseModel


class CareScheduleModel(BaseModel):
    id: str
    userId: str
    plantId: str
    type: str
    status: str
    scheduledFor: str
    completedAt: str | None = None
    createdAt: str
    updatedAt: str
