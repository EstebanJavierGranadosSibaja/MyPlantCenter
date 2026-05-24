# Backend API (FastAPI + Firestore)

API de MyPlantCenter construida con FastAPI y Firebase Admin sobre Firestore.

## Estructura

```text
apps/api/
|-- main.py                  # App FastAPI y middlewares (CORS + tracing)
|-- config/
|   `-- firebase.py          # Inicializacion singleton de Firestore
|-- routers/                 # Endpoints por dominio
|-- services/                # Logica de negocio y consultas
|-- models/                  # Contratos Pydantic
|-- utils/                   # Utilidades compartidas
|-- requirements.txt
`-- .env.example
```

## Variables De Entorno

Copia `.env.example` a `.env` dentro de `apps/api` y ajusta:

```env
API_HOST=0.0.0.0
API_PORT=8000
API_ENV=development
PORT=
FIREBASE_SERVICE_ACCOUNT_JSON=
FIREBASE_SERVICE_ACCOUNT_PATH=serviceAccountKey.json
CORS_ORIGINS=http://localhost:8081,http://localhost:19006
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash
```

Notas:

- Si `FIREBASE_SERVICE_ACCOUNT_PATH` es relativo, se resuelve desde `apps/api` y tambien desde la raiz del repo.
- Si no se encuentra `serviceAccountKey.json`, existe un fallback legacy a `secrets/service-account.json`.
- `GEMINI_API_KEY` habilita la identificacion de plantas por imagen usando el tier gratuito de Gemini.

## Instalacion

Desde la raiz del repo:

```bash
npm run backend:install
```

Alternativa dentro de `apps/api`:

```bash
pip install -r requirements.txt
```

## Ejecutar

Desde la raiz del repo:

```bash
npm run backend:start
```

En Render, define `PORT` y `FIREBASE_SERVICE_ACCOUNT_JSON` como variables de entorno.

Solo localhost:

```bash
npm run backend:start:local
```

Directo dentro de `apps/api`:

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## Endpoints Utiles

- `GET /health`
- `GET /api/collections/{collection_path}`
- `POST /api/users/{user_id}/plant-detections/analyze`
- `POST /api/users/{user_id}/care-history`

Routers de dominio activos:

- auth_users, users, plants, plant_tags, plant_issues, categories
- care_schedule, care_history, achievements, achievement_templates
- level_config, friend_requests, friendships, notifications

## Scripts De Mantenimiento (Desde La Raiz)

Validacion de contrato Firestore:

```bash
npm run backend:check:firestore-contract
```

Migracion de frecuencia de riego (legacy `careFrequencyPerWeek` -> `wateringFrequencyDays`):

```bash
python scripts/migrations/migrate_watering_frequency.py
python scripts/migrations/migrate_watering_frequency.py --apply
python scripts/migrations/migrate_watering_frequency.py --apply --user-id user_001
```
