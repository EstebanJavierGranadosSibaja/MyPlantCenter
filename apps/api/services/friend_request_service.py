from datetime import datetime, timezone

from fastapi.concurrency import run_in_threadpool

from config.firebase import get_firestore_client
from services.firestore_service import get_collection
from utils.response import error_response


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _create_friend_request_sync(from_user_id: str, to_code: str) -> dict:
    db = get_firestore_client()
    normalized_code = (to_code or "").strip().upper()
    if not normalized_code:
        error_response(400, "Debes indicar un codigo valido.")

    users_query = db.collection("users").where("friendCode", "==", normalized_code).limit(1).stream()
    to_user_id = None
    for item in users_query:
        to_user_id = item.id
        break

    if not to_user_id:
        error_response(404, "No se encontro un usuario con ese codigo.")

    if to_user_id == from_user_id:
        error_response(400, "No puedes enviarte una solicitud a ti mismo.")

    friendships = db.collection("friendships").where("participants", "array_contains", from_user_id).stream()
    for friendship in friendships:
        participants = (friendship.to_dict() or {}).get("participants") or []
        if to_user_id in participants:
            error_response(409, "Ya son amigos.")

    existing_requests = db.collection("friendRequests").where("fromUserId", "==", from_user_id).where("toUserId", "==", to_user_id).where("status", "==", "pending").stream()
    for _ in existing_requests:
        error_response(409, "Ya tienes una solicitud pendiente con este usuario.")

    reverse_pending = db.collection("friendRequests").where("fromUserId", "==", to_user_id).where("toUserId", "==", from_user_id).where("status", "==", "pending").stream()
    for _ in reverse_pending:
        error_response(409, "Ya recibiste una solicitud de este usuario. Revisala en pendientes.")

    now = _now_iso()
    request_ref = db.collection("friendRequests").document()
    payload = {
        "id": request_ref.id,
        "fromUserId": from_user_id,
        "toUserId": to_user_id,
        "toCode": normalized_code,
        "status": "pending",
        "acceptedAt": None,
        "createdAt": now,
        "updatedAt": now,
    }
    request_ref.set(payload)
    return payload


def _resolve_friend_request_sync(request_id: str, user_id: str, status: str) -> dict:
    db = get_firestore_client()
    normalized_status = (status or "").strip().lower()
    if normalized_status not in {"accepted", "rejected"}:
        error_response(400, "El estado debe ser 'accepted' o 'rejected'.")

    request_ref = db.collection("friendRequests").document(request_id)
    snapshot = request_ref.get()
    if not snapshot.exists:
        error_response(404, "No se encontro la solicitud.")

    payload = snapshot.to_dict() or {}
    if payload.get("toUserId") != user_id:
        error_response(403, "Solo el usuario receptor puede responder la solicitud.")

    if payload.get("status") != "pending":
        return {"id": request_id, **payload}

    now = _now_iso()
    updates = {
        "status": normalized_status,
        "updatedAt": now,
        "acceptedAt": now if normalized_status == "accepted" else None,
    }
    request_ref.update(updates)

    if normalized_status == "accepted":
        from_user_id = payload.get("fromUserId")
        to_user_id = payload.get("toUserId")
        participants = sorted([from_user_id, to_user_id])

        existing_friendships = db.collection("friendships").where("participants", "array_contains", from_user_id).stream()
        already_friends = False
        for friendship in existing_friendships:
            friendship_participants = sorted((friendship.to_dict() or {}).get("participants") or [])
            if friendship_participants == participants:
                already_friends = True
                break

        if not already_friends:
            friendship_ref = db.collection("friendships").document()
            friendship_ref.set(
                {
                    "id": friendship_ref.id,
                    "participants": participants,
                    "createdAt": now,
                    "updatedAt": now,
                }
            )

    return {"id": request_id, **payload, **updates}


async def get_user_friend_requests(user_id: str) -> list[dict]:
    incoming = await get_collection(
        "friendRequests",
        filters=[("toUserId", "==", user_id)],
    )
    outgoing = await get_collection(
        "friendRequests",
        filters=[("fromUserId", "==", user_id)],
    )

    deduped: dict[str, dict] = {request["id"]: request for request in incoming}
    for request in outgoing:
        deduped[request["id"]] = request

    return sorted(deduped.values(), key=lambda item: item.get("createdAt", ""))


async def create_friend_request(from_user_id: str, to_code: str) -> dict:
    return await run_in_threadpool(_create_friend_request_sync, from_user_id, to_code)


async def resolve_friend_request(request_id: str, user_id: str, status: str) -> dict:
    return await run_in_threadpool(_resolve_friend_request_sync, request_id, user_id, status)
