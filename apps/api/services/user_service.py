from datetime import datetime, timezone
from typing import Any

from fastapi import HTTPException
from fastapi.concurrency import run_in_threadpool

from config.firebase import get_firestore_client
from services.category_service import get_user_categories
from services.firestore_service import get_document
from services.plant_service import get_user_plants
from utils.response import error_response


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _sanitize_nickname(nickname: str) -> str:
    return nickname.lstrip("@").strip()


def _with_live_plants_count(user: dict[str, Any], plants_count: int) -> dict[str, Any]:
    hydrated_user = dict(user)
    stats = dict(hydrated_user.get("stats") or {})
    stats.setdefault("friendsCount", 0)
    stats.setdefault("wateredToday", 0)
    stats.setdefault("activeDays", 0)
    stats["plantsCount"] = plants_count
    hydrated_user["stats"] = stats
    return hydrated_user


async def _build_profile_categories(user_id: str, plants: list[dict[str, Any]]) -> list[dict[str, Any]]:
    categories = await get_user_categories(user_id)

    counts_by_category: dict[str, int] = {}
    for plant in plants:
        category_id = plant.get("categoryId")
        if isinstance(category_id, str) and category_id:
            counts_by_category[category_id] = counts_by_category.get(category_id, 0) + 1

    if categories:
        hydrated_categories: list[dict[str, Any]] = []
        for category in categories:
            hydrated_category = dict(category)
            hydrated_category["count"] = counts_by_category.get(hydrated_category.get("id"), 0)
            hydrated_categories.append(hydrated_category)
        return sorted(hydrated_categories, key=lambda category: category.get("order") or 0)

    if not counts_by_category:
        return []

    fallback_categories: list[dict[str, Any]] = []
    for category_id, count in counts_by_category.items():
        try:
            base_category = await get_document("categories", category_id)
        except HTTPException as exc:
            if exc.status_code != 404:
                raise
            base_category = {
                "id": category_id,
                "name": "Sin categoria",
                "iconKey": "plant",
                "iconSet": "feather",
                "iconEmoji": None,
                "color": "#6BA368",
                "order": 0,
                "createdAt": _now_iso(),
                "updatedAt": _now_iso(),
                "userId": user_id,
            }

        hydrated_category = dict(base_category)
        hydrated_category["count"] = count
        hydrated_category.setdefault("userId", user_id)
        hydrated_category.setdefault("updatedAt", hydrated_category.get("createdAt") or _now_iso())
        fallback_categories.append(hydrated_category)

    return sorted(fallback_categories, key=lambda category: category.get("order") or 0)


def _build_default_user_payload(payload: dict) -> dict:
    now = _now_iso()
    nickname = _sanitize_nickname(payload["nickname"])

    return {
        "authUserId": payload["authUserId"],
        "displayName": payload["name"].strip(),
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
        "lastActiveAt": now,
        "streakFrozenUntil": None,
        "level": 1,
        "xp": 0,
        "xpMax": 100,
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
        "notificationPrefs": {
            "wateringReminders": True,
            "healthAlerts": True,
            "newFriends": True,
            "achievementsUnlocked": True,
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

    for field in ("description", "birthday", "location", "visibility"):
        if field in payload and payload[field] is not None:
            updates[field] = payload[field]

    if "name" in payload and payload["name"] is not None:
        updates["displayName"] = payload["name"].strip()

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
            updates[f"notificationPrefs.{key}"] = value

    if not updates:
        return

    updates["updatedAt"] = _now_iso()
    user_ref.update(updates)


async def get_user(user_id: str) -> dict:
    user = await get_document("users", user_id)
    plants = await get_user_plants(user_id)
    return _with_live_plants_count(user, len(plants))


async def create_user(payload: dict) -> dict:
    await run_in_threadpool(_create_user_sync, payload)
    return await get_user(payload["id"])


async def update_user(user_id: str, payload: dict) -> dict:
    await run_in_threadpool(_update_user_sync, user_id, payload)
    return await get_user(user_id)


async def get_user_profile(user_id: str) -> dict:
    user = await get_document("users", user_id)
    plants = await get_user_plants(user_id)
    categories = await _build_profile_categories(user_id, plants)
    hydrated_user = _with_live_plants_count(user, len(plants))

    favorite_plant = None
    favorite_plant_id = hydrated_user.get("favoritePlantId")
    if isinstance(favorite_plant_id, str) and favorite_plant_id:
        favorite_plant = await get_document("plants", favorite_plant_id)

    return {
        "user": hydrated_user,
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


async def get_user_visibility(user_id: str) -> str:
    user = await get_document("users", user_id)
    visibility = user.get("visibility")
    return visibility if isinstance(visibility, str) and visibility else "public"


async def get_user_plants_list(user_id: str) -> list[dict]:
    return await get_user_plants(user_id)
