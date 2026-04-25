import logging
import os
import time
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from routers import register_routers


logger = logging.getLogger("myplantcenter.api")
if not logger.handlers:
    logging.basicConfig(level=logging.INFO)


def _cors_origins() -> list[str]:
    raw_cors_origins = os.getenv("CORS_ORIGINS", "*")
    return [origin.strip() for origin in raw_cors_origins.split(",") if origin.strip()] or ["*"]


app = FastAPI(
    title="Plant Project API",
    version="1.0.0",
    description="API en FastAPI sobre Firebase Firestore para la app de plantas.",
)

@app.get("/")
def root():
    return {"status": "MAIN_ACTUAL_V2"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def tracing_middleware(request: Request, call_next):
    trace_id = request.headers.get("x-trace-id") or f"trace_{uuid4().hex[:12]}"
    start = time.perf_counter()

    response = await call_next(request)

    elapsed_ms = int((time.perf_counter() - start) * 1000)
    response.headers["x-trace-id"] = trace_id
    logger.info(
        "[API][%s] %s %s -> %s (%sms)",
        trace_id,
        request.method,
        request.url.path,
        response.status_code,
        elapsed_ms,
    )

    return response


register_routers(app)