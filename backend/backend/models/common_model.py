from typing import Any

from pydantic import BaseModel, Field


class ApiCollectionResponse(BaseModel):
    collection: str
    count: int
    items: list[dict[str, Any]] = Field(default_factory=list)
