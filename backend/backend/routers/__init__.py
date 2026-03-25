from fastapi import FastAPI

from .achievement_templates import router as achievement_templates_router
from .achievements import router as achievements_router
from .auth_users import router as auth_users_router
from .care_history import router as care_history_router
from .care_schedule import router as care_schedule_router
from .categories import router as categories_router
from .collections import router as collections_router
from .friend_requests import router as friend_requests_router
from .friendships import router as friendships_router
from .health import router as health_router
from .level_config import router as level_config_router
from .notifications import router as notifications_router
from .plant_issues import router as plant_issues_router
from .plant_tags import router as plant_tags_router
from .plants import router as plants_router
from .users import router as users_router


def register_routers(app: FastAPI) -> None:
    app.include_router(health_router)
    app.include_router(auth_users_router)
    app.include_router(users_router)
    app.include_router(plants_router)
    app.include_router(plant_tags_router)
    app.include_router(plant_issues_router)
    app.include_router(categories_router)
    app.include_router(care_schedule_router)
    app.include_router(care_history_router)
    app.include_router(achievements_router)
    app.include_router(achievement_templates_router)
    app.include_router(level_config_router)
    app.include_router(friend_requests_router)
    app.include_router(friendships_router)
    app.include_router(notifications_router)
    app.include_router(collections_router)
