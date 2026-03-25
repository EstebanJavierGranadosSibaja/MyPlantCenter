from pydantic import BaseModel


class PlantIssueModel(BaseModel):
    id: str
    userId: str
    plantId: str
    type: str
    name: str
    description: str
    severity: str
    status: str
    detectedAt: str
    updatedAt: str
    resolvedAt: str | None = None
    notes: str | None = None
