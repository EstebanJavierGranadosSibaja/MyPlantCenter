from pathlib import Path
import sys

import firebase_admin
from firebase_admin import credentials, firestore

sys.path.insert(0, str(Path("backend").resolve()))

from backend.models.auth_user_model import AuthUserModel
from backend.models.user_model import UserModel
from backend.models.plant_model import PlantModel
from backend.models.category_model import CategoryModel
from backend.models.achievement_model import AchievementModel
from backend.models.achievement_template_model import AchievementTemplateModel
from backend.models.care_schedule_model import CareScheduleModel
from backend.models.care_history_model import CareHistoryModel
from backend.models.level_config_model import LevelConfigModel
from backend.models.notification_model import NotificationModel
from backend.models.plant_issue_model import PlantIssueModel
from backend.models.plant_detection_model import PlantDetectionModel
from backend.models.plant_tag_model import PlantTagModel
from backend.models.friend_request_model import FriendRequestModel
from backend.models.friendship_model import FriendshipModel


def normalize(value):
    if hasattr(value, "isoformat"):
        return value.isoformat()

    if isinstance(value, list):
        return [normalize(item) for item in value]

    if isinstance(value, dict):
        return {key: normalize(item) for key, item in value.items()}

    return value


def main() -> int:
    service_account_path = Path("utils/secrets/service-account.json").resolve()
    credential = credentials.Certificate(str(service_account_path))

    if not firebase_admin._apps:
        firebase_admin.initialize_app(credential)

    db = firestore.client()

    model_map = {
        "authUsers": AuthUserModel,
        "users": UserModel,
        "plants": PlantModel,
        "categories": CategoryModel,
        "achievements": AchievementModel,
        "achievementTemplates": AchievementTemplateModel,
        "careSchedule": CareScheduleModel,
        "careHistory": CareHistoryModel,
        "levelConfig": LevelConfigModel,
        "notifications": NotificationModel,
        "plantIssues": PlantIssueModel,
        "plantDetections": PlantDetectionModel,
        "plantTags": PlantTagModel,
        "friendRequests": FriendRequestModel,
        "friendships": FriendshipModel,
    }

    errors = []

    for collection, model in model_map.items():
        for document in db.collection(collection).stream():
            payload = normalize(document.to_dict() or {})
            try:
                model.model_validate(payload)
            except Exception as exc:  # noqa: BLE001
                errors.append((collection, document.id, str(exc).splitlines()[0]))

    print(f"CONTRACT_ERRORS {len(errors)}")
    for collection, doc_id, message in errors[:50]:
        print(f"{collection}/{doc_id}: {message}")

    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
