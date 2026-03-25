from pydantic import BaseModel


class PlantTagModel(BaseModel):
    id: str
    userId: str
    plantId: str
    value: str
    order: int
    createdAt: str
    updatedAt: str
