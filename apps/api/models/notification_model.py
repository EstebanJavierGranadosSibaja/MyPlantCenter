from typing import Any

from pydantic import BaseModel


class NotificationModel(BaseModel):
    id: str
    userId: str
    type: str
    title: str
    body: str
    read: bool
    data: dict[str, Any] | None = None
    createdAt: str
    updatedAt: str
