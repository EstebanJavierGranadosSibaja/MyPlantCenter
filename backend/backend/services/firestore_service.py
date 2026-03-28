from typing import Any

from fastapi.concurrency import run_in_threadpool
from google.cloud.firestore_v1.base_query import FieldFilter

from backend.config.firebase import get_firestore_client
from backend.utils.response import error_response, serialize_document


def _resolve_collection_path(collection_path: str):
    db = get_firestore_client()
    segments = [segment.strip() for segment in collection_path.split("/") if segment.strip()]

    if len(segments) % 2 == 0:
        error_response(400, f"La ruta de coleccion '{collection_path}' no es valida.")

    ref: Any = db
    for index, segment in enumerate(segments):
        if index % 2 == 0:
            ref = ref.collection(segment)
        else:
            ref = ref.document(segment)

    return ref


def _read_document_sync(collection_path: str, document_id: str) -> dict[str, Any]:
    collection_ref = _resolve_collection_path(collection_path)
    snapshot = collection_ref.document(document_id).get()

    if not snapshot.exists:
        error_response(
            404,
            f"No se encontro el documento '{document_id}' en '{collection_path}'.",
        )

    return serialize_document(snapshot)


def _read_collection_sync(
    collection_path: str,
    *,
    filters: list[tuple[str, str, Any]] | None = None,
    order_by: str | None = None,
) -> list[dict[str, Any]]:
    query = _resolve_collection_path(collection_path)

    for field_name, operator, value in filters or []:
        query = query.where(filter=FieldFilter(field_name, operator, value))

    if order_by:
        query = query.order_by(order_by)

    return [serialize_document(document) for document in query.stream()]


async def get_document(collection_path: str, document_id: str) -> dict[str, Any]:
    try:
        return await run_in_threadpool(_read_document_sync, collection_path, document_id)
    except Exception as exc:  # noqa: BLE001
        if hasattr(exc, "status_code"):
            raise
        error_response(500, f"Error consultando Firestore: {exc}")


async def get_collection(
    collection_path: str,
    *,
    filters: list[tuple[str, str, Any]] | None = None,
    order_by: str | None = None,
) -> list[dict[str, Any]]:
    try:
        return await run_in_threadpool(
            _read_collection_sync,
            collection_path,
            filters=filters,
            order_by=order_by,
        )
    except Exception as exc:  # noqa: BLE001
        if hasattr(exc, "status_code"):
            raise
        error_response(500, f"Error consultando Firestore: {exc}")
