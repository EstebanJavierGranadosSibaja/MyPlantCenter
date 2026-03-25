from pydantic import BaseModel


class LevelConfigModel(BaseModel):
    id: str
    level: int
    title: str
    xpRequired: int
    xpMax: int
    badge: str
    iconKey: str
    iconSet: str
    createdAt: str
    updatedAt: str
