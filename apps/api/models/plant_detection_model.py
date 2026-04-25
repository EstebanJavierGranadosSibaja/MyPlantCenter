from pydantic import BaseModel


class PlantDetectionPredictionModel(BaseModel):
    scientificName: str
    commonName: str | None = None
    confidence: float


class PlantDetectionCareModel(BaseModel):
    watering: str
    light: str
    soil: str
    temperature: str
    humidity: str


class PlantDetectionAnalyzeRequest(BaseModel):
    imageBase64: str
    imageMimeType: str = "image/jpeg"
    plantId: str | None = None
    source: str = "camera"


class IdentifyPlantRequest(BaseModel):
    userId: str
    imageBase64: str
    imageMimeType: str = "image/jpeg"
    plantId: str | None = None
    source: str = "camera"


class PlantDetectionAnalyzeResponse(BaseModel):
    detectionId: str
    scientificName: str
    commonName: str | None = None
    confidence: float
    care: PlantDetectionCareModel
    summary: str
    predictions: list[PlantDetectionPredictionModel]
    provider: str
    modelVersion: str


class PlantDetectionHistoryItem(BaseModel):
    detectionId: str
    scientificName: str
    commonName: str | None = None
    confidence: float
    care: PlantDetectionCareModel
    summary: str
    predictions: list[PlantDetectionPredictionModel]
    provider: str
    modelVersion: str
    source: str
    status: str
    createdAt: str
    updatedAt: str


class PlantDetectionHistoryResponse(BaseModel):
    items: list[PlantDetectionHistoryItem]


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
