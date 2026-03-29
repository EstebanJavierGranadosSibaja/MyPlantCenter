from pydantic import BaseModel


class CategoryModel(BaseModel):
    id: str
    userId: str | None = None
    name: str
    iconKey: str
    iconSet: str | None = None
    iconEmoji: str | None = None
    color: str
    count: int | None = None
    order: int
    createdAt: str
    updatedAt: str | None = None
