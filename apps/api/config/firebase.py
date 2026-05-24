from functools import lru_cache
import json
from pathlib import Path
from threading import Lock
import os

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials, firestore

API_DIR = Path(__file__).resolve().parents[1]
REPO_ROOT = Path(__file__).resolve().parents[3]
load_dotenv(API_DIR / ".env")
_firebase_init_lock = Lock()


def _resolve_service_account_path(configured_path: str | None) -> Path:
    raw_path = (configured_path or "serviceAccountKey.json").strip() or "serviceAccountKey.json"
    path = Path(raw_path).expanduser()

    if path.is_absolute():
        if path.exists():
            return path
        raise FileNotFoundError(
            "No se encontro el archivo de credenciales de Firebase en "
            f"{path}"
        )

    # Relative paths are interpreted from apps/api to match .env location.
    candidate_paths = [
        (API_DIR / path).resolve(),
        (REPO_ROOT / path).resolve(),
    ]

    # Legacy fallback for local setups that moved credentials under /secrets.
    if raw_path == "serviceAccountKey.json":
        candidate_paths.append((REPO_ROOT / "secrets" / "service-account.json").resolve())

    for candidate in candidate_paths:
        if candidate.exists():
            return candidate

    attempted_paths = "\n- ".join(str(candidate) for candidate in candidate_paths)
    raise FileNotFoundError(
        "No se encontro el archivo de credenciales de Firebase. Rutas intentadas:\n- "
        f"{attempted_paths}"
    )


def _service_account_credentials() -> credentials.Certificate:
    service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
    if service_account_json:
        return credentials.Certificate(json.loads(service_account_json))

    service_account_path = _resolve_service_account_path(
        os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
    )
    return credentials.Certificate(str(service_account_path))


@lru_cache(maxsize=1)
def get_firestore_client() -> firestore.Client:
    if not firebase_admin._apps:
        credential = _service_account_credentials()
        with _firebase_init_lock:
            if not firebase_admin._apps:
                firebase_admin.initialize_app(credential)

    return firestore.client()
