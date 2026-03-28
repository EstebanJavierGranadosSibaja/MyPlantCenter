from datetime import datetime, timezone

from fastapi.concurrency import run_in_threadpool

from backend.config.firebase import get_firestore_client
from backend.services.firestore_service import get_collection, get_document
from backend.utils.response import error_response


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _sanitize_payload(payload: dict) -> dict:
    updates: dict = {}

    for field in ("name", "scientificName", "categoryId", "description", "acquiredAt"):
        if field in payload and payload[field] is not None:
            value = payload[field]
            updates[field] = value.strip() if isinstance(value, str) else value

    if "careFrequencyPerWeek" in payload and payload["careFrequencyPerWeek"] is not None:
        updates["careFrequencyPerWeek"] = payload["careFrequencyPerWeek"]

    if "favorite" in payload and payload["favorite"] is not None:
        updates["favorite"] = bool(payload["favorite"])

    if "nickname" in payload and payload["nickname"] is not None:
        nickname = payload["nickname"]
        updates["nickname"] = nickname.strip() if isinstance(nickname, str) else nickname

    return updates


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
