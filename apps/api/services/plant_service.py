from datetime import datetime, timezone
from typing import Any

from fastapi.concurrency import run_in_threadpool

from config.firebase import get_firestore_client
from services.firestore_service import get_collection, get_document
from utils.response import error_response


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _sanitize_payload(payload: dict) -> dict:
    updates: dict = {}

    for field in ("name", "scientificName", "categoryId", "description", "acquiredAt"):
        if field in payload and payload[field] is not None:
            value = payload[field]
            updates[field] = value.strip() if isinstance(value, str) else value

    if "wateringFrequencyDays" in payload and payload["wateringFrequencyDays"] is not None:
        watering_days = max(1, int(payload["wateringFrequencyDays"]))
        updates["wateringFrequencyDays"] = watering_days

    if "careFrequencyPerWeek" in payload and payload["careFrequencyPerWeek"] is not None:
        care_per_week = max(1, int(payload["careFrequencyPerWeek"]))
        updates.setdefault("wateringFrequencyDays", max(1, round(7 / care_per_week)))

    if "favorite" in payload and payload["favorite"] is not None:
        updates["favorite"] = bool(payload["favorite"])

    if "nickname" in payload and payload["nickname"] is not None:
        nickname = payload["nickname"]
        updates["nickname"] = nickname.strip() if isinstance(nickname, str) else nickname

    return updates


def _build_plant_payload(user_id: str, payload: dict, order: int, category: dict[str, Any] | None = None) -> dict:
    now = _now_iso()
    name = (payload.get("name") or "").strip()
    scientific_name = (payload.get("scientificName") or "").strip()
    description = (payload.get("description") or "").strip()
    category_id = payload.get("categoryId")
    acquired_at = payload.get("acquiredAt")
    care_frequency = payload.get("careFrequencyPerWeek")
    watering_days_raw = payload.get("wateringFrequencyDays")
    if watering_days_raw is not None:
        watering_days = max(1, int(watering_days_raw))
    else:
        safe_care = max(1, int(care_frequency or 1))
        watering_days = max(1, round(7 / safe_care))

    icon_key = (category or {}).get("iconKey") or "leaf"
    icon_set = (category or {}).get("iconSet") or "feather"
    icon_emoji = (category or {}).get("iconEmoji") or None

    return {
        "userId": user_id,
        "categoryId": category_id,
        "name": name,
        "nickname": name,
        "scientificName": scientific_name,
        "iconKey": icon_key,
        "iconSet": icon_set,
        "iconEmoji": icon_emoji,
        "healthStatus": 100,
        "progress": 0,
        "favorite": False,
        "wateringFrequencyDays": watering_days,
        "lastWatered": now,
        "description": description,
        "order": order,
        "createdAt": now,
        "updatedAt": now,
        "acquiredAt": acquired_at,
        "progressMetric": "health",
    }


def _create_plant_sync(user_id: str, payload: dict) -> str:
    db = get_firestore_client()

    plants_query = db.collection("plants").where("userId", "==", user_id).stream()
    order = 1
    for item in plants_query:
        current_order = (item.to_dict() or {}).get("order") or 0
        if isinstance(current_order, int):
            order = max(order, current_order + 1)

    category = None
    category_id = payload.get("categoryId")
    if isinstance(category_id, str) and category_id:
        category_snapshot = db.collection("categories").document(category_id).get()
        if category_snapshot.exists:
            category = category_snapshot.to_dict() or {}

    plant_payload = _build_plant_payload(user_id, payload, order, category)
    plant_ref = db.collection("plants").document()
    plant_payload["id"] = plant_ref.id
    plant_ref.set(plant_payload)
    return plant_ref.id


def _delete_plant_sync(plant_id: str) -> None:
    db = get_firestore_client()
    plant_ref = db.collection("plants").document(plant_id)
    snapshot = plant_ref.get()

    if not snapshot.exists:
        error_response(404, f"No se encontro la planta '{plant_id}'.")

    tags_query = db.collection("plantTags").where("plantId", "==", plant_id).stream()
    for tag in tags_query:
        tag.reference.delete()

    issues_query = db.collection("plantIssues").where("plantId", "==", plant_id).stream()
    for issue in issues_query:
        issue.reference.delete()

    plant_ref.delete()


def _update_plant_sync(plant_id: str, payload: dict) -> None:
    db = get_firestore_client()
    plant_ref = db.collection("plants").document(plant_id)
    snapshot = plant_ref.get()

    if not snapshot.exists:
        error_response(404, f"No se encontro la planta '{plant_id}'.")

    updates = _sanitize_payload(payload)
    if not updates:
        return

    updates["updatedAt"] = _now_iso()
    plant_ref.update(updates)


async def get_user_plants(user_id: str) -> list[dict]:
    plants = await get_collection("plants", filters=[("userId", "==", user_id)])
    return sorted(plants, key=lambda plant: plant.get("order") or 0)


async def get_plant_detail(plant_id: str) -> dict:
    plant = await get_document("plants", plant_id)
    tags = await get_collection("plantTags", filters=[("plantId", "==", plant_id)])
    tags = sorted(tags, key=lambda tag: tag.get("order") or 0)
    issues = await get_collection("plantIssues", filters=[("plantId", "==", plant_id)])
    issues = sorted(issues, key=lambda issue: issue.get("detectedAt") or "")
    return {"plant": plant, "tags": tags, "issues": issues}


async def update_plant(plant_id: str, payload: dict) -> dict:
    await run_in_threadpool(_update_plant_sync, plant_id, payload)
    return await get_plant_detail(plant_id)


async def create_plant(user_id: str, payload: dict) -> dict:
    plant_id = await run_in_threadpool(_create_plant_sync, user_id, payload)
    return await get_plant_detail(plant_id)


async def delete_plant(plant_id: str) -> dict:
    await run_in_threadpool(_delete_plant_sync, plant_id)
    return {"deleted": True, "plantId": plant_id}
