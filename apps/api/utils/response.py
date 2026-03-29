from typing import Any

from fastapi import HTTPException


def error_response(status_code: int, detail: str) -> None:
    raise HTTPException(status_code=status_code, detail=detail)


def serialize_value(value: Any) -> Any:
    if hasattr(value, "isoformat"):
        return value.isoformat()

    if isinstance(value, list):
        return [serialize_value(item) for item in value]

    if isinstance(value, dict):
        return {nested_key: serialize_value(nested_value) for nested_key, nested_value in value.items()}

    return value


def serialize_document(document) -> dict[str, Any]:
    payload = {key: serialize_value(value) for key, value in document.to_dict().items()}
    payload["id"] = document.id
    return payload
