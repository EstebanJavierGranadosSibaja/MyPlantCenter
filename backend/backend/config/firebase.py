from functools import lru_cache
from pathlib import Path
from threading import Lock
import os

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials, firestore

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")
_firebase_init_lock = Lock()


@lru_cache(maxsize=1)
def get_firestore_client() -> firestore.Client:
    configured_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "../serviceAccountKey.json")
    service_account_path = Path(configured_path)

    if not service_account_path.is_absolute():
        service_account_path = (BASE_DIR / service_account_path).resolve()

    if not service_account_path.exists():
        raise FileNotFoundError(
            "No se encontro el archivo de credenciales de Firebase en "
            f"{service_account_path}"
        )

    if not firebase_admin._apps:
        credential = credentials.Certificate(str(service_account_path))
        with _firebase_init_lock:
            if not firebase_admin._apps:
                firebase_admin.initialize_app(credential)

    return firestore.client()
