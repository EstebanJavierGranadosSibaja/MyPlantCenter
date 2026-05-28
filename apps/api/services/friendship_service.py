from fastapi import HTTPException

from services.firestore_service import get_collection, get_document


async def get_user_friendships(user_id: str) -> list[dict]:
    friendships = await get_collection(
        "friendships",
        filters=[("participants", "array_contains", user_id)],
    )
    return sorted(friendships, key=lambda item: item.get("createdAt", ""))


def _map_friend_summary(user: dict, friend_id: str, friendship: dict) -> dict:
    nickname = user.get("nickname") or ""
    name = user.get("displayName") or user.get("name") or nickname or "Usuario"
    stats = user.get("stats") or {}

    return {
        "id": friend_id,
        "name": name,
        "nickname": nickname,
        "avatarUrl": user.get("avatarUrl"),
        "level": int(user.get("level") or 1),
        "visibility": user.get("visibility") or "public",
        "plantsCount": int(stats.get("plantsCount") or 0),
        "streakDays": int(user.get("streakDays") or 0),
        "friendshipId": friendship.get("id") or "",
        "friendsSince": friendship.get("createdAt"),
    }


async def get_user_friends(user_id: str) -> list[dict]:
    friendships = await get_user_friendships(user_id)

    friends: list[dict] = []
    for friendship in friendships:
        participants = friendship.get("participants") or []
        friend_id = next((p for p in participants if p != user_id), None)
        if not friend_id:
            continue

        try:
            user = await get_document("users", friend_id)
        except HTTPException as exc:
            if exc.status_code == 404:
                continue
            raise

        friends.append(_map_friend_summary(user, friend_id, friendship))

    return sorted(friends, key=lambda item: item["name"].lower())
