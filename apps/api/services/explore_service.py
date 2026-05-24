from datetime import datetime
from typing import List

from google.cloud import firestore

from config.firebase import get_firestore_client
from models.explore_model import ExploreResponse, RecentActivity, TrendingPlant


def _coerce_text(value: object, fallback: str) -> str:
    if isinstance(value, str):
        cleaned = value.strip()
        if cleaned:
            return cleaned
    return fallback


def _normalize_id(value: str) -> str:
    return "".join(char if char.isalnum() else "_" for char in value.lower()).strip("_") or "plant"


def _parse_timestamp(value: object) -> str:
    if isinstance(value, str) and value.strip():
        return value
    if isinstance(value, datetime):
        return value.isoformat()
    return datetime.utcnow().isoformat()


class ExploreService:
    def __init__(self) -> None:
        self.db = get_firestore_client()

    def _build_trending_from_detections(self, detections: list[dict]) -> List[TrendingPlant]:
        by_scientific: dict[str, dict] = {}

        for detection in detections:
            predictions = detection.get("predictions") or []
            primary = predictions[0] if predictions else {}
            scientific_name = _coerce_text(
                primary.get("scientificName") or detection.get("topPrediction"),
                "Planta",
            )
            common_name = primary.get("commonName")
            display_name = common_name.strip() if isinstance(common_name, str) and common_name.strip() else scientific_name
            last_detected = _parse_timestamp(detection.get("createdAt"))

            entry = by_scientific.get(scientific_name)
            if not entry:
                entry = {
                    "id": _normalize_id(scientific_name),
                    "name": display_name,
                    "scientificName": scientific_name,
                    "imageUrl": None,
                    "detectionCount": 0,
                    "lastDetected": last_detected,
                }
                by_scientific[scientific_name] = entry

            entry["detectionCount"] += 1
            if last_detected > entry["lastDetected"]:
                entry["lastDetected"] = last_detected

        sorted_plants = sorted(
            by_scientific.values(),
            key=lambda item: (item["detectionCount"], item["lastDetected"]),
            reverse=True,
        )
        return [TrendingPlant(**plant) for plant in sorted_plants[:5]]

    def _load_recent_detections(self, limit: int = 60) -> list[dict]:
        query = (
            self.db.collection("plantDetections")
            .order_by("createdAt", direction=firestore.Query.DESCENDING)
            .limit(limit)
        )
        return [snapshot.to_dict() or {} for snapshot in query.stream()]

    def _load_recent_plants(self, limit: int = 40) -> list[dict]:
        query = (
            self.db.collection("plants")
            .order_by("createdAt", direction=firestore.Query.DESCENDING)
            .limit(limit)
        )
        return [snapshot.to_dict() or {} for snapshot in query.stream()]

    def _resolve_user_nickname(self, user_id: str, cache: dict[str, str]) -> str:
        cached = cache.get(user_id)
        if cached:
            return cached

        snapshot = self.db.collection("users").document(user_id).get()
        if not snapshot.exists:
            cache[user_id] = "usuario"
            return cache[user_id]

        payload = snapshot.to_dict() or {}
        nickname = _coerce_text(payload.get("nickname"), "")
        display = _coerce_text(payload.get("displayName") or payload.get("name"), "usuario")
        resolved = nickname or display
        cache[user_id] = resolved
        return resolved

    def get_trending_plants(self) -> List[TrendingPlant]:
        detections = self._load_recent_detections()
        return self._build_trending_from_detections(detections)

    def get_recent_activity(self) -> List[RecentActivity]:
        detections = self._load_recent_detections()
        plants = self._load_recent_plants()

        nickname_cache: dict[str, str] = {}
        activity: list[dict] = []

        for detection in detections:
            user_id = _coerce_text(detection.get("userId"), "unknown")
            predictions = detection.get("predictions") or []
            primary = predictions[0] if predictions else {}
            scientific_name = _coerce_text(
                primary.get("scientificName") or detection.get("topPrediction"),
                "Planta",
            )
            common_name = primary.get("commonName")
            plant_name = common_name.strip() if isinstance(common_name, str) and common_name.strip() else scientific_name
            timestamp = _parse_timestamp(detection.get("createdAt"))
            confidence = detection.get("confidence") or primary.get("confidence")

            activity.append(
                {
                    "id": f"det_{_coerce_text(detection.get('id'), scientific_name)}",
                    "userId": user_id,
                    "userNickname": self._resolve_user_nickname(user_id, nickname_cache),
                    "plantName": plant_name,
                    "plantScientificName": scientific_name,
                    "actionType": "detected",
                    "timestamp": timestamp,
                    "confidence": confidence,
                }
            )

        for plant in plants:
            user_id = _coerce_text(plant.get("userId"), "unknown")
            plant_name = _coerce_text(plant.get("name"), "Planta")
            scientific_name = _coerce_text(plant.get("scientificName"), plant_name)
            timestamp = _parse_timestamp(plant.get("createdAt"))

            activity.append(
                {
                    "id": f"plant_{_coerce_text(plant.get('id'), plant_name)}",
                    "userId": user_id,
                    "userNickname": self._resolve_user_nickname(user_id, nickname_cache),
                    "plantName": plant_name,
                    "plantScientificName": scientific_name,
                    "actionType": "added",
                    "timestamp": timestamp,
                    "confidence": None,
                }
            )

        activity_sorted = sorted(
            activity,
            key=lambda item: item["timestamp"],
            reverse=True,
        )
        return [RecentActivity(**item) for item in activity_sorted[:15]]

    def get_explore_data(self) -> ExploreResponse:
        return ExploreResponse(
            trendingPlants=self.get_trending_plants(),
            recentActivity=self.get_recent_activity(),
        )
