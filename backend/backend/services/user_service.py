from datetime import datetime, timezone

from fastapi.concurrency import run_in_threadpool

from backend.config.firebase import get_firestore_client
from backend.services.category_service import get_user_categories
from backend.services.firestore_service import get_document
from backend.services.plant_service import get_user_plants
from backend.utils.response import error_response


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _sanitize_nickname(nickname: str) -> str:
    return nickname.lstrip("@").strip()


def _build_default_user_payload(payload: dict) -> dict:
    now = _now_iso()
    nickname = _sanitize_nickname(payload["nickname"])

    return {
        "authUserId": payload["authUserId"],
        "name": payload["name"].strip(),
        "nickname": nickname,
        "friendCode": payload["id"],
        "description": "",
        "avatarUrl": None,
        "birthday": None,
        "location": None,
        "visibility": "public",
        "favoritePlantId": None,
        "streakDays": 0,
        "bestStreak": 0,
        "lastActivityDate": now,
        "streakFrozenUntil": None,
        "level": 1,
        "xp": 0,
        "stats": {
            "plantsCount": 0,
            "friendsCount": 0,
            "wateredToday": 0,
            "activeDays": 0,
        },
        "registeredAt": now,
        "updatedAt": now,
        "privacy": {
            "showStreak": True,
            "showBirthday": False,
            "allowRequests": True,
        },
        "notifications": {
            "wateringReminders": True,
            "healthAlerts": True,
            "newFriends": True,
            "achievementsUnlocked": True,
        },
    }


def _build_default_auth_user_payload(payload: dict) -> dict:
    now = _now_iso()
    email = (payload.get("email") or "").strip().lower()
    nickname = _sanitize_nickname(payload["nickname"])

    return {
        "id": payload["authUserId"],
        "profileId": payload["id"],
        "fullName": payload["name"].strip(),
        "email": email,
        "emailLower": email,
        "nickname": nickname,
        "method": payload.get("method") or "email",
        "provider": payload.get("provider") or "password",
        "emailVerified": bool(payload.get("emailVerified", False)),
        "status": "active",
        "lastLoginAt": now,
        "createdAt": now,
        "updatedAt": now,
    }


def _create_user_sync(payload: dict) -> None:
    db = get_firestore_client()
    user_ref = db.collection("users").document(payload["id"])
    auth_user_ref = db.collection("authUsers").document(payload["authUserId"])

    user_exists = user_ref.get().exists

    if user_exists:
        if payload.get("email") and not auth_user_ref.get().exists:
            auth_user_ref.set(_build_default_auth_user_payload(payload))
        return

    user_ref.set(_build_default_user_payload(payload))

    if payload.get("email"):
        if not auth_user_ref.get().exists:
            auth_user_ref.set(_build_default_auth_user_payload(payload))


def _update_user_sync(user_id: str, payload: dict) -> None:
    db = get_firestore_client()
    user_ref = db.collection("users").document(user_id)
    snapshot = user_ref.get()

    if not snapshot.exists:
        error_response(404, f"No se encontro el usuario '{user_id}'.")

    updates: dict = {}

    for field in ("name", "description", "birthday", "location", "visibility"):
        if field in payload and payload[field] is not None:
            updates[field] = payload[field]

    if "nickname" in payload and payload["nickname"] is not None:
        updates["nickname"] = _sanitize_nickname(payload["nickname"])

    privacy_payload = payload.get("privacy") or {}
    for key, value in privacy_payload.items():
        if value is not None:
            updates[f"privacy.{key}"] = value

    notifications_payload = payload.get("notifications") or {}
    for key, value in notifications_payload.items():
        if value is not None:
            updates[f"notifications.{key}"] = value

    if not updates:
        return

    updates["updatedAt"] = _now_iso()
    user_ref.update(updates)


async def get_user(user_id: str) -> dict:
    return await get_document("users", user_id)


async def create_user(payload: dict) -> dict:
    await run_in_threadpool(_create_user_sync, payload)
    return await get_user(payload["id"])


async def update_user(user_id: str, payload: dict) -> dict:
    await run_in_threadpool(_update_user_sync, user_id, payload)
    return await get_user(user_id)


async def get_user_profile(user_id: str) -> dict:
    user = await get_user(user_id)
    categories = await get_user_categories(user_id)

    favorite_plant = None
    favorite_plant_id = user.get("favoritePlantId")
    if isinstance(favorite_plant_id, str) and favorite_plant_id:
        favorite_plant = await get_document("plants", favorite_plant_id)

    return {
        "user": user,
        "categories": categories,
        "favoritePlant": favorite_plant,
    }


async def get_user_stats(user_id: str) -> dict:
    user = await get_user(user_id)
    return user.get("stats", {})


async def get_user_info_tiles(user_id: str) -> list[dict]:
    user = await get_user(user_id)
    stats = user.get("stats", {})

    return [
        {"key": "location", "label": "Ubicacion", "value": user.get("location") or "No definida"},
        {"key": "friendCode", "label": "Codigo de amistad", "value": user.get("friendCode") or "N/A"},
        {"key": "plantsCount", "label": "Plantas", "value": str(stats.get("plantsCount", 0))},
        {"key": "friendsCount", "label": "Amistades", "value": str(stats.get("friendsCount", 0))},
    ]


async def get_user_plants_list(user_id: str) -> list[dict]:
    return await get_user_plants(user_id)
