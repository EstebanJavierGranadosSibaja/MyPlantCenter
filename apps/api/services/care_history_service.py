from datetime import datetime, timedelta, timezone
import hashlib

from fastapi.concurrency import run_in_threadpool

from config.firebase import get_firestore_client
from firebase_admin import firestore
from services.firestore_service import get_collection
from utils.response import error_response


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _parse_iso_datetime(value: object) -> datetime | None:
    if isinstance(value, datetime):
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)

    if isinstance(value, str):
        cleaned = value.strip()
        if not cleaned:
            return None
        try:
            normalized = cleaned.replace("Z", "+00:00") if cleaned.endswith("Z") else cleaned
            parsed = datetime.fromisoformat(normalized)
        except ValueError:
            return None
        return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)

    return None


def _build_user_stat_updates(user_payload: dict, completed_at: str, care_type: str) -> dict:
    updates: dict = {"lastActiveAt": _now_iso()}
    if care_type != "watering":
        return updates

    completed_dt = _parse_iso_datetime(completed_at) or datetime.now(timezone.utc)
    last_activity_raw = user_payload.get("lastActivityDate") or user_payload.get("lastActiveAt")
    last_activity_dt = _parse_iso_datetime(last_activity_raw)

    stats = dict(user_payload.get("stats") or {})
    watered_today = int(stats.get("wateredToday") or 0)
    active_days = int(stats.get("activeDays") or 0)

    streak_days = int(user_payload.get("streakDays") or 0)
    best_streak = int(user_payload.get("bestStreak") or 0)

    completed_date = completed_dt.date()
    last_activity_date = last_activity_dt.date() if last_activity_dt else None

    if last_activity_date is None or completed_date > last_activity_date:
        if last_activity_date and completed_date == last_activity_date + timedelta(days=1):
            streak_days += 1
        else:
            streak_days = 1
        active_days += 1
        watered_today = 1
        updates["lastActivityDate"] = completed_dt.isoformat()
    elif completed_date == last_activity_date:
        watered_today += 1

    best_streak = max(best_streak, streak_days)

    updates["stats.wateredToday"] = watered_today
    updates["stats.activeDays"] = active_days
    updates["streakDays"] = streak_days
    updates["bestStreak"] = best_streak

    return updates


def _hash_idempotency_key(user_id: str, key: str) -> str:
    return hashlib.sha256(f"{user_id}:{key}".encode("utf-8")).hexdigest()


def _create_care_history_sync(user_id: str, payload: dict) -> dict:
    db = get_firestore_client()
    plant_id = (payload.get("plantId") or "").strip()
    if not plant_id:
        error_response(400, "Debes indicar la planta a registrar.")

    care_type = (payload.get("type") or "watering").strip() or "watering"
    now = _now_iso()
    completed_at = payload.get("completedAt") or now
    idempotency_key = (payload.get("idempotencyKey") or "").strip()

    plant_ref = db.collection("plants").document(plant_id)
    user_ref = db.collection("users").document(user_id)

    history_ref = None
    if idempotency_key:
        history_ref = db.collection("careHistory").document(_hash_idempotency_key(user_id, idempotency_key))

    transaction = db.transaction()

    @firestore.transactional
    def _write(txn: firestore.Transaction) -> dict:
        # Firestore exige que TODAS las lecturas ocurran ANTES de cualquier
        # escritura dentro de una transaccion. Leemos planta, (idempotencia) y
        # usuario primero; luego escribimos.
        #
        # Python 3.14 + google-cloud-firestore >= 2.19: txn.get(doc_ref)
        # devuelve un generador incluso para una sola DocumentReference.
        # Usamos next() para extraer el snapshot.
        plant_snapshot = next(txn.get(plant_ref))
        if not plant_snapshot.exists:
            error_response(404, "No se encontro la planta indicada.")

        plant_data = plant_snapshot.to_dict() or {}
        if plant_data.get("userId") != user_id:
            error_response(403, "La planta no pertenece al usuario.")

        existing_history: dict | None = None
        if history_ref is not None:
            history_snapshot = next(txn.get(history_ref))
            if history_snapshot.exists:
                existing_history = history_snapshot.to_dict() or {}
                existing_history.setdefault("id", history_ref.id)

        user_snapshot = next(txn.get(user_ref))

        # Idempotencia: si ya existe el registro, devolvemos sin escribir.
        if existing_history is not None:
            return existing_history

        # ── A partir de aqui solo escrituras ──────────────────────────────────
        resolved_history_ref = history_ref or db.collection("careHistory").document()

        history_payload = {
            "id": resolved_history_ref.id,
            "userId": user_id,
            "plantId": plant_id,
            "scheduleId": payload.get("scheduleId"),
            "type": care_type,
            "createdAt": now,
            "completedAt": completed_at,
            "notes": payload.get("notes"),
            "updatedAt": now,
        }
        if idempotency_key:
            history_payload["idempotencyKey"] = idempotency_key

        txn.set(resolved_history_ref, history_payload)

        if care_type == "watering":
            txn.update(plant_ref, {"lastWatered": completed_at, "updatedAt": now})

        if user_snapshot.exists:
            user_payload = user_snapshot.to_dict() or {}
            updates = _build_user_stat_updates(user_payload, completed_at, care_type)
            if updates:
                txn.update(user_ref, updates)

        return history_payload

    return _write(transaction)


async def get_user_care_history(user_id: str) -> list[dict]:
    results = await get_collection(
        "careHistory",
        filters=[("userId", "==", user_id)],
    )
    return sorted(results, key=lambda r: r.get("completedAt") or "", reverse=True)


async def create_care_history(user_id: str, payload: dict) -> dict:
    return await run_in_threadpool(_create_care_history_sync, user_id, payload)
