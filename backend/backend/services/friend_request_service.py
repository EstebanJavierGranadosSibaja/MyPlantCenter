from backend.services.firestore_service import get_collection


async def get_user_friend_requests(user_id: str) -> list[dict]:
    incoming = await get_collection(
        "friendRequests",
        filters=[("toUserId", "==", user_id)],
        order_by="createdAt",
    )
    outgoing = await get_collection(
        "friendRequests",
        filters=[("fromUserId", "==", user_id)],
        order_by="createdAt",
    )

    deduped: dict[str, dict] = {request["id"]: request for request in incoming}
    for request in outgoing:
        deduped[request["id"]] = request

    return sorted(deduped.values(), key=lambda item: item.get("createdAt", ""))
