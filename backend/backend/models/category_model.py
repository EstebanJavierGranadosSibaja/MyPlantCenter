from pydantic import BaseModel


class CategoryModel(BaseModel):
    id: str
    name: str
    iconKey: str
    iconSet: str
    iconEmoji: str
    color: str
    count: int
    order: int
    createdAt: str
