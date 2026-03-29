from __future__ import annotations

import argparse
from pathlib import Path
import sys
from typing import Any

from firebase_admin import firestore

SCRIPT_DIR = Path(__file__).resolve().parent
BACKEND_PROJECT_DIR = SCRIPT_DIR.parents[1] / "apps" / "api"
sys.path.insert(0, str(BACKEND_PROJECT_DIR))

from config.firebase import get_firestore_client


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Migra plantas para usar wateringFrequencyDays como campo canonico. "
            "Por defecto corre en dry-run (sin escribir cambios)."
        )
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Aplica cambios en Firestore. Si no se envia, solo reporta.",
    )
    parser.add_argument(
        "--user-id",
        help="Migra solo plantas de un usuario especifico.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Limita la cantidad de plantas procesadas (0 = sin limite).",
    )
    return parser.parse_args()


def to_int(value: Any) -> int | None:
    if value is None:
        return None

    try:
        numeric = float(value)
    except (TypeError, ValueError):
        return None

    if numeric <= 0:
        return None

    return max(1, round(numeric))


def resolve_days(payload: dict[str, Any]) -> int | None:
    from_days = to_int(payload.get("wateringFrequencyDays"))
    if from_days is not None:
        return from_days

    care_week = to_int(payload.get("careFrequencyPerWeek"))
    if care_week is None:
        return None

    return max(1, round(7 / care_week))


def main() -> int:
    args = parse_args()
    db = get_firestore_client()

    query = db.collection("plants")
    if args.user_id:
        query = query.where("userId", "==", args.user_id)

    dry_run = not args.apply
    scanned = 0
    updated = 0
    skipped_no_data = 0
    already_clean = 0
    failures = 0

    for snapshot in query.stream():
        if args.limit and scanned >= args.limit:
            break

        scanned += 1
        plant = snapshot.to_dict() or {}
        plant_id = snapshot.id

        resolved_days = resolve_days(plant)
        has_legacy_weekly = "careFrequencyPerWeek" in plant

        if resolved_days is None:
            skipped_no_data += 1
            print(f"SKIP {plant_id}: sin datos de frecuencia validos")
            continue

        current_days = to_int(plant.get("wateringFrequencyDays"))
        needs_days_update = current_days != resolved_days

        if not needs_days_update and not has_legacy_weekly:
            already_clean += 1
            continue

        updates: dict[str, Any] = {"wateringFrequencyDays": resolved_days}
        if has_legacy_weekly:
            updates["careFrequencyPerWeek"] = firestore.DELETE_FIELD

        if dry_run:
            updated += 1
            print(
                "PLAN "
                f"{plant_id}: wateringFrequencyDays {current_days} -> {resolved_days}, "
                f"delete careFrequencyPerWeek={has_legacy_weekly}"
            )
            continue

        try:
            snapshot.reference.update(updates)
            updated += 1
            print(
                "OK "
                f"{plant_id}: wateringFrequencyDays={resolved_days}, "
                f"legacyDeleted={has_legacy_weekly}"
            )
        except Exception as exc:  # noqa: BLE001
            failures += 1
            print(f"ERROR {plant_id}: {exc}")

    mode = "APPLY" if args.apply else "DRY_RUN"
    print("---")
    print(f"MODE {mode}")
    print(f"SCANNED {scanned}")
    print(f"UPDATED {updated}")
    print(f"ALREADY_CLEAN {already_clean}")
    print(f"SKIPPED_NO_DATA {skipped_no_data}")
    print(f"FAILURES {failures}")

    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
