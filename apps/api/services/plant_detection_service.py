import base64
import binascii
import hashlib
import json
import logging
import os
import re
from datetime import datetime, timezone
from urllib import error, request

from fastapi.concurrency import run_in_threadpool

from config.firebase import get_firestore_client
from utils.response import error_response

_DEFAULT_MODEL = "gemini-2.0-flash"
_DEFAULT_CONFIDENCE = 0.35
_MAX_IMAGE_BYTES = 8 * 1024 * 1024

# OpenAI-compatible provider (works with OpenRouter / HuggingFace router / Groq /
# Together / etc. — they all speak the same chat-completions + vision format).
# Configure via env: AI_PROVIDER, AI_BASE_URL, AI_API_KEY, AI_MODEL.
_DEFAULT_AI_BASE_URL = "https://openrouter.ai/api/v1"
_DEFAULT_VISION_MODEL = "meta-llama/llama-3.2-11b-vision-instruct:free"

logger = logging.getLogger("myplantcenter.api.plant_detection")


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _coerce_text(value: object, fallback: str) -> str:
    if isinstance(value, str):
        candidate = value.strip()
        if candidate:
            return candidate
    return fallback


def _coerce_confidence(value: object) -> float:
    try:
        confidence = float(value)
    except (TypeError, ValueError):
        confidence = _DEFAULT_CONFIDENCE

    if confidence > 1 and confidence <= 100:
        confidence = confidence / 100

    return max(0.0, min(1.0, confidence))


def _extract_image_parts(image_base64: str, image_mime_type: str | None) -> tuple[str, str, bytes]:
    if not image_base64:
        error_response(400, "Debes enviar la imagen en base64.")

    mime_type = (image_mime_type or "image/jpeg").strip() or "image/jpeg"
    payload = image_base64.strip()

    if payload.startswith("data:"):
        match = re.match(r"^data:(?P<mime>[\w.+\-/]+);base64,(?P<data>[\s\S]+)$", payload)
        if not match:
            error_response(400, "El formato data URI de la imagen no es valido.")

        mime_type = match.group("mime")
        payload = match.group("data").strip()

    try:
        decoded = base64.b64decode(payload, validate=True)
    except (binascii.Error, ValueError):
        error_response(400, "La imagen base64 es invalida.")

    if not decoded:
        error_response(400, "La imagen enviada esta vacia.")

    if len(decoded) > _MAX_IMAGE_BYTES:
        error_response(413, "La imagen supera el tamano maximo permitido de 8MB.")

    return payload, mime_type, decoded


def _extract_text_from_gemini(payload: dict) -> str:
    candidates = payload.get("candidates") or []

    for candidate in candidates:
        if not isinstance(candidate, dict):
            continue

        content = candidate.get("content") or {}
        parts = content.get("parts") or []

        texts = []
        for part in parts:
            if isinstance(part, dict) and isinstance(part.get("text"), str):
                texts.append(part["text"])

        if texts:
            return "\n".join(texts).strip()

    return ""


def _strip_code_fence(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```") and cleaned.endswith("```"):
        cleaned = re.sub(r"^```(?:json)?", "", cleaned, flags=re.IGNORECASE).strip()
        cleaned = re.sub(r"```$", "", cleaned).strip()
    return cleaned


def _normalize_predictions(payload: object, scientific_name: str, common_name: str | None, confidence: float) -> list[dict]:
    predictions: list[dict] = []

    if isinstance(payload, list):
        for item in payload[:3]:
            if not isinstance(item, dict):
                continue

            prediction_scientific = _coerce_text(
                item.get("scientificName") or item.get("scientific_name"),
                scientific_name,
            )
            prediction_common_raw = item.get("commonName") or item.get("common_name")
            prediction_common = prediction_common_raw.strip() if isinstance(prediction_common_raw, str) else None
            prediction_confidence = _coerce_confidence(item.get("confidence"))

            predictions.append(
                {
                    "scientificName": prediction_scientific,
                    "commonName": prediction_common,
                    "confidence": prediction_confidence,
                }
            )

    if not predictions:
        predictions.append(
            {
                "scientificName": scientific_name,
                "commonName": common_name,
                "confidence": confidence,
            }
        )

    return predictions


def _parse_ai_payload(raw_text: str) -> dict:
    cleaned = _strip_code_fence(raw_text)

    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{[\s\S]*\}", cleaned)
        if not match:
            error_response(502, "La respuesta del proveedor IA no tuvo formato JSON valido.")

        try:
            parsed = json.loads(match.group(0))
        except json.JSONDecodeError:
            error_response(502, "No se pudo interpretar el JSON de la respuesta IA.")

    if not isinstance(parsed, dict):
        error_response(502, "La respuesta IA no tiene estructura valida.")

    scientific_name = _coerce_text(
        parsed.get("scientificName") or parsed.get("scientific_name"),
        "Planta no identificada",
    )

    common_raw = parsed.get("commonName") or parsed.get("common_name")
    common_name = common_raw.strip() if isinstance(common_raw, str) and common_raw.strip() else None

    confidence = _coerce_confidence(parsed.get("confidence"))

    care_payload = parsed.get("care") if isinstance(parsed.get("care"), dict) else {}

    care = {
        "watering": _coerce_text(
            care_payload.get("watering") or parsed.get("watering"),
            "Riego moderado, validar especie exacta.",
        ),
        "light": _coerce_text(
            care_payload.get("light") or parsed.get("light"),
            "Luz indirecta brillante en la mayoria de casos.",
        ),
        "soil": _coerce_text(
            care_payload.get("soil") or parsed.get("soil"),
            "Sustrato drenante con materia organica.",
        ),
        "temperature": _coerce_text(
            care_payload.get("temperature") or parsed.get("temperature"),
            "Temperatura templada, evitar extremos.",
        ),
        "humidity": _coerce_text(
            care_payload.get("humidity") or parsed.get("humidity"),
            "Humedad media, evitar sequedad prolongada.",
        ),
    }

    summary = _coerce_text(
        parsed.get("summary"),
        "Identificacion preliminar generada con IA. Confirmar con observacion adicional.",
    )

    predictions = _normalize_predictions(
        parsed.get("predictions"),
        scientific_name,
        common_name,
        confidence,
    )

    return {
        "scientificName": scientific_name,
        "commonName": common_name,
        "confidence": confidence,
        "care": care,
        "summary": summary,
        "predictions": predictions,
    }


def _serialize_detection_history_item(document: dict) -> dict:
    top_prediction = _coerce_text(document.get("topPrediction"), "Planta no identificada")
    confidence = _coerce_confidence(document.get("confidence"))
    raw_predictions = document.get("predictions") if isinstance(document.get("predictions"), list) else []

    predictions: list[dict] = []
    for item in raw_predictions[:3]:
        if not isinstance(item, dict):
            continue

        common_raw = item.get("commonName") or item.get("common_name")
        common_name = common_raw.strip() if isinstance(common_raw, str) and common_raw.strip() else None

        predictions.append(
            {
                "scientificName": _coerce_text(
                    item.get("scientificName") or item.get("scientific_name"),
                    top_prediction,
                ),
                "commonName": common_name,
                "confidence": _coerce_confidence(item.get("confidence")),
            }
        )

    if not predictions:
        predictions = [
            {
                "scientificName": top_prediction,
                "commonName": None,
                "confidence": confidence,
            }
        ]

    care_payload = document.get("care") if isinstance(document.get("care"), dict) else {}
    care = {
        "watering": _coerce_text(care_payload.get("watering"), "Riego moderado."),
        "light": _coerce_text(care_payload.get("light"), "Luz indirecta brillante."),
        "soil": _coerce_text(care_payload.get("soil"), "Sustrato drenante."),
        "temperature": _coerce_text(care_payload.get("temperature"), "Temperatura templada."),
        "humidity": _coerce_text(care_payload.get("humidity"), "Humedad media."),
    }

    return {
        "detectionId": _coerce_text(document.get("id"), ""),
        "scientificName": predictions[0]["scientificName"],
        "commonName": predictions[0]["commonName"],
        "confidence": confidence,
        "care": care,
        "summary": _coerce_text(
            document.get("summary"),
            "Identificacion preliminar generada con IA.",
        ),
        "predictions": predictions,
        "provider": _coerce_text(document.get("provider"), "gemini"),
        "modelVersion": _coerce_text(document.get("modelVersion"), _DEFAULT_MODEL),
        "source": _coerce_text(document.get("source"), "camera"),
        "status": _coerce_text(document.get("status"), "completed"),
        "createdAt": _coerce_text(document.get("createdAt"), _now_iso()),
        "updatedAt": _coerce_text(document.get("updatedAt"), _now_iso()),
    }


def _list_user_plant_detections_sync(user_id: str) -> list[dict]:
    db = get_firestore_client()
    snapshots = db.collection("plantDetections").where("userId", "==", user_id).stream()

    detections: list[dict] = []
    for snapshot in snapshots:
        payload = snapshot.to_dict() or {}
        payload.setdefault("id", snapshot.id)
        detections.append(payload)

    detections.sort(key=lambda item: item.get("createdAt") or "", reverse=True)
    return [_serialize_detection_history_item(item) for item in detections]


def _build_prompt() -> str:
    return (
        "Analiza la imagen de una planta y responde SOLO con JSON valido, sin markdown ni texto adicional. "
        "Debe tener esta estructura exacta: "
        "{\"scientificName\":string,\"commonName\":string|null,\"confidence\":number,"
        "\"care\":{\"watering\":string,\"light\":string,\"soil\":string,\"temperature\":string,\"humidity\":string},"
        "\"summary\":string,\"predictions\":[{\"scientificName\":string,\"commonName\":string|null,\"confidence\":number}]}. "
        "confidence debe estar entre 0 y 1. "
        "Los cuidados deben ser concretos y cortos en espanol."
    )


def _get_fallback_detection() -> dict:
    return {
        "scientificName": "Planta identificada (fallback)",
        "commonName": "Planta de Interior",
        "confidence": 0.7,
        "care": {
            "watering": "Riego semanal moderado",
            "light": "Luz indirecta brillante",
            "soil": "Sustrato drenaje médio",
            "temperature": "18-25°C",
            "humidity": "40-60%",
        },
        "summary": "Identificación basada en respuesta de respaldo. Consultar para validación.",
        "predictions": [
            {"scientificName": "Planta identificada (fallback)", "commonName": "Planta de Interior", "confidence": 0.7}
        ],
    }


def _call_gemini_sync(image_base64: str, image_mime_type: str) -> tuple[dict, str]:
    api_key = os.getenv("GEMINI_API_KEY")
    model_version = os.getenv("GEMINI_MODEL", _DEFAULT_MODEL)

    if not api_key:
        error_response(
            503,
            "No se configuro GEMINI_API_KEY en el backend. Agregalo al archivo .env para usar deteccion IA.",
        )

    endpoint = (
        f"https://generativelanguage.googleapis.com/v1beta/models/{model_version}:generateContent"
        f"?key={api_key}"
    )

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {"text": _build_prompt()},
                    {
                        "inline_data": {
                            "mime_type": image_mime_type,
                            "data": image_base64,
                        }
                    },
                ],
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 700,
        },
    }

    req = request.Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=45) as response:
            raw = response.read().decode("utf-8")
    except error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        error_response(502, f"El proveedor IA respondio con error: {detail or exc.reason}")
    except error.URLError as exc:
        reason = str(exc.reason) if exc.reason else "sin detalle"
        error_response(503, f"No se pudo conectar con el proveedor IA: {reason}")

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        error_response(502, "El proveedor IA devolvio una respuesta no valida.")

    text = _extract_text_from_gemini(parsed)
    if not text:
        error_response(502, "No se recibio texto util desde el proveedor IA.")

    return _parse_ai_payload(text), model_version


def _extract_text_from_openai(payload: dict) -> str:
    choices = payload.get("choices") or []

    for choice in choices:
        if not isinstance(choice, dict):
            continue

        message = choice.get("message") or {}
        content = message.get("content")

        if isinstance(content, str) and content.strip():
            return content.strip()

        # Some providers return content as a list of parts.
        if isinstance(content, list):
            texts = [part.get("text", "") for part in content if isinstance(part, dict)]
            joined = "\n".join(t for t in texts if t).strip()
            if joined:
                return joined

    return ""


def _ai_models() -> list[str]:
    """Lista de modelos a intentar, en orden. AI_MODEL puede ser un solo
    modelo o varios separados por comas (fallback automatico)."""
    raw = os.getenv("AI_MODEL", _DEFAULT_VISION_MODEL)
    models = [m.strip() for m in raw.split(",") if m.strip()]
    return models or [_DEFAULT_VISION_MODEL]


def _request_openai_model(
    endpoint: str,
    headers: dict,
    prompt: str,
    data_uri: str,
    model: str,
) -> dict:
    """Un intento contra UN modelo. Devuelve la deteccion parseada o lanza
    una excepcion (HTTP, conexion, JSON invalido o sin texto) para que el
    llamador pueda probar el siguiente modelo."""
    payload = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": data_uri}},
                ],
            }
        ],
        "temperature": 0.2,
        "max_tokens": 700,
    }

    req = request.Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )

    try:
        with request.urlopen(req, timeout=60) as response:
            raw = response.read().decode("utf-8")
    except error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise RuntimeError(f"HTTP {exc.code}: {detail or exc.reason}")
    except error.URLError as exc:
        reason = str(exc.reason) if exc.reason else "sin detalle"
        raise RuntimeError(f"conexion: {reason}")

    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        raise RuntimeError("respuesta no es JSON valido")

    text = _extract_text_from_openai(parsed)
    if not text:
        raise RuntimeError("respuesta sin texto util")

    # _parse_ai_payload puede lanzar HTTPException si el JSON del modelo es
    # invalido; se propaga y el llamador prueba el siguiente modelo.
    return _parse_ai_payload(text)


def _call_openai_compatible_sync(image_base64: str, image_mime_type: str) -> tuple[dict, str]:
    """Vision chat-completions call against any OpenAI-compatible provider
    (OpenRouter, HuggingFace router, Groq, ...). Prueba los modelos de AI_MODEL
    en orden hasta que uno responda. Returns (detection, model)."""
    api_key = os.getenv("AI_API_KEY")
    base_url = os.getenv("AI_BASE_URL", _DEFAULT_AI_BASE_URL).rstrip("/")
    models = _ai_models()

    if not api_key:
        error_response(
            503,
            "No se configuro AI_API_KEY en el backend. Agrega la API key de tu "
            "proveedor (OpenRouter / HuggingFace) para usar la deteccion IA.",
        )

    endpoint = f"{base_url}/chat/completions"
    data_uri = f"data:{image_mime_type};base64,{image_base64}"
    prompt = _build_prompt()

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        # Recommended by OpenRouter; harmless for other providers.
        "HTTP-Referer": "https://myplantcenter.onrender.com",
        "X-Title": "MyPlantCenter",
    }

    last_error: Exception | None = None
    for model in models:
        try:
            detection = _request_openai_model(endpoint, headers, prompt, data_uri, model)
            logger.info("[PlantDetection] modelo OK: %s", model)
            return detection, model
        except Exception as exc:  # noqa: BLE001 — probamos el siguiente modelo
            last_error = exc
            logger.warning(
                "[PlantDetection] modelo fallo (%s): %s — probando siguiente",
                model, exc,
            )
            continue

    # Ningun modelo respondio: lo reporta el llamador (cae a fallback).
    error_response(
        502,
        f"Todos los modelos IA fallaron ({', '.join(models)}). Ultimo error: {last_error}",
    )


def _persist_detection_sync(
    user_id: str,
    payload: dict,
    image_hash: str,
    detection: dict,
    model_version: str,
) -> dict:
    db = get_firestore_client()
    detection_ref = db.collection("plantDetections").document()
    now = _now_iso()

    document = {
        "id": detection_ref.id,
        "userId": user_id,
        "plantId": payload.get("plantId"),
        "imageUrl": f"inline://{image_hash[:24]}",
        "imageHash": image_hash,
        "source": payload.get("source") or "camera",
        "status": "completed",
        "topPrediction": detection["scientificName"],
        "confidence": detection["confidence"],
        "modelVersion": model_version,
        "createdAt": now,
        "updatedAt": now,
        "predictions": detection["predictions"],
        "care": detection["care"],
        "summary": detection["summary"],
        "provider": model_version,
    }

    detection_ref.set(document)
    return document


async def analyze_plant_image(user_id: str, payload: dict) -> dict:
    logger.info("[PlantDetection] start userId=%s source=%s", user_id, payload.get("source") or "camera")

    image_base64, image_mime_type, image_bytes = _extract_image_parts(
        image_base64=payload.get("imageBase64") or "",
        image_mime_type=payload.get("imageMimeType"),
    )

    # Provider selection: "gemini" uses Google's native API; anything else
    # (default) uses the OpenAI-compatible client (OpenRouter / HuggingFace / …).
    provider = os.getenv("AI_PROVIDER", "openai").strip().lower()

    try:
        if provider == "gemini":
            detection, model_version = await run_in_threadpool(
                _call_gemini_sync,
                image_base64,
                image_mime_type,
            )
        else:
            detection, model_version = await run_in_threadpool(
                _call_openai_compatible_sync,
                image_base64,
                image_mime_type,
            )
    except Exception as e:
        logger.error("[PlantDetection] AI call failed (provider=%s): %s", provider, e)
        detection, model_version = _get_fallback_detection(), "fallback"

    image_hash = hashlib.sha256(image_bytes).hexdigest()

    stored = await run_in_threadpool(
        _persist_detection_sync,
        user_id,
        payload,
        image_hash,
        detection,
        model_version,
    )

    logger.info(
        "[PlantDetection] success userId=%s detectionId=%s confidence=%.2f",
        user_id,
        stored["id"],
        detection["confidence"],
    )

    return {
        "detectionId": stored["id"],
        "scientificName": detection["scientificName"],
        "commonName": detection["commonName"],
        "confidence": detection["confidence"],
        "care": detection["care"],
        "summary": detection["summary"],
        "predictions": detection["predictions"],
        "provider": stored["provider"],
        "modelVersion": stored["modelVersion"],
    }


async def list_user_plant_detections(user_id: str) -> dict:
    items = await run_in_threadpool(_list_user_plant_detections_sync, user_id)
    return {"items": items}
