from pydantic import BaseModel


class PlantDetectionPredictionModel(BaseModel):
    scientificName: str
    commonName: str | None = None
    confidence: float


class PlantDetectionModel(BaseModel):
    id: str
    userId: str
    plantId: str | None = None
    imageUrl: str
    imageHash: str | None = None
    source: str
    status: str
    topPrediction: str
    confidence: float
    modelVersion: str
    createdAt: str
    updatedAt: str
    predictions: list[PlantDetectionPredictionModel]
