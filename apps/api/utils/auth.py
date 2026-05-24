from dataclasses import dataclass
import os

from fastapi import HTTPException, Request, status
from firebase_admin import auth as firebase_auth

from config.firebase import get_firestore_client


@dataclass(frozen=True)
class AuthContext:
    uid: str
    claims: dict
    token: str


def _auth_required() -> bool:
    raw = os.getenv("API_REQUIRE_AUTH", "true")
    return raw.strip().lower() not in {"0", "false", "no"}


def _admin_routes_enabled() -> bool:
    raw = os.getenv("API_ALLOW_ADMIN_ROUTES")
    if raw is None:
        return True
    return raw.strip().lower() in {"1", "true", "yes"}


def _allow_public_profile_read() -> bool:
    raw = os.getenv("API_ALLOW_PUBLIC_PROFILE_READ", "true")
    return raw.strip().lower() in {"1", "true", "yes"}


def _admin_uids() -> set[str]:
    raw = os.getenv("ADMIN_UIDS", "")
    return {uid.strip() for uid in raw.split(",") if uid.strip()}


def _parse_bearer_token(request: Request) -> str | None:
    header = request.headers.get("authorization") or request.headers.get("Authorization")
    if not header:
        return None
    prefix = "bearer "
    if header.lower().startswith(prefix):
        return header[len(prefix):].strip()
    return None


def _verify_token(id_token: str) -> AuthContext:
    # Ensure Firebase Admin is initialized.
    get_firestore_client()
    decoded = firebase_auth.verify_id_token(id_token)
    uid = decoded.get("uid")
    if not uid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalido.")
    return AuthContext(uid=uid, claims=decoded, token=id_token)


async def require_auth(request: Request) -> AuthContext:
    if not _auth_required():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Autenticacion deshabilitada en el servidor.",
        )

    token = _parse_bearer_token(request)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Falta token de autenticacion.")

    try:
        ctx = _verify_token(token)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalido.")

    request.state.user = ctx
    return ctx


async def require_admin(request: Request) -> AuthContext:
    if not _admin_routes_enabled():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Ruta admin deshabilitada.")

    ctx = await require_auth(request)
    admin_claim = bool(ctx.claims.get("admin"))
    if admin_claim or ctx.uid in _admin_uids():
        return ctx
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acceso restringido.")


def ensure_user_match(ctx: AuthContext, user_id: str) -> None:
    if ctx.uid != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acceso denegado.")


def ensure_payload_user(ctx: AuthContext, user_id: str) -> None:
    if ctx.uid != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Usuario no autorizado.")


def ensure_public_profile_or_owner(ctx: AuthContext, user_id: str, *, is_public: bool) -> None:
    if ctx.uid == user_id:
        return
    if not _allow_public_profile_read():
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acceso denegado.")
    if not is_public:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acceso denegado.")
