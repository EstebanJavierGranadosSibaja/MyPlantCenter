# Backend API

API utilizando  FastAPI .

## Estructura

- `main.py`: inicializacion de FastAPI y registro de routers
- `config/firebase.py`: inicializacion singleton de Firestore
- `routers/`: un router por entidad
- `services/`: logica de negocio y consultas Firestore
- `models/`: contratos Pydantic v2 por entidad
- `utils/response.py`: serializacion y manejo de errores HTTP
- `main.py`: entrypoint compatible para `uvicorn main:app`

## Variables de entorno

Copia `.env.example` a `.env` dentro de esta carpeta (`MyPlantCenter/apps/api`) y ajusta:

```env
API_HOST=127.0.0.1
API_PORT=8000
API_ENV=development
FIREBASE_SERVICE_ACCOUNT_PATH=serviceAccountKey.json
CORS_ORIGINS=http://localhost:8081,http://localhost:19006
```

## Instalacion
Dentro de nuestro ambiente de python
```powershell
pip install -r .\requirements.txt
```

Si ya tienes otro entorno virtual para backend, puedes usarlo sin problema.

## Ejecutar

Desde la raiz del proyecto:

```powershell
npm run backend:start
```

Tambien puedes ejecutar directamente:

```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## Endpoints principales

- `GET /health`
- `GET /api/users/{userId}`
- `GET /api/users/{userId}/profile`
- `GET /api/users/{userId}/plants`
- `GET /api/plants/{plantId}`
- `GET /api/users/{userId}/categories`
- `GET /api/users/{userId}/plant-tags`
- `GET /api/users/{userId}/care-schedule`
- `GET /api/users/{userId}/care-history`
- `GET /api/users/{userId}/stats`
- `GET /api/users/{userId}/info-tiles`
- `GET /api/collections/{collectionName}`

## Notas

- Usa Firebase Admin, asi que consulta Firestore del lado servidor.
- Si la service account no tiene permisos, la API devolvera errores al consultar Firestore.
- El endpoint `GET /api/collections/{collectionName}` es util para desarrollo interno; cuando saques esta API del proyecto conviene restringirlo o eliminarlo.

## Notas de normalizacion de datos

- Las categorias normalizadas viven en `categories` (coleccion global) y se filtran por `userId`.
- `GET /api/users/{userId}/stats` se alimenta desde `users.stats`, no desde una coleccion separada.
- `GET /api/users/{userId}/info-tiles` se calcula a partir de datos del usuario y stats embebidos.

## Migracion de frecuencia de riego (por dias)

Para migrar plantas legacy que aun tengan `careFrequencyPerWeek` hacia `wateringFrequencyDays`:

```powershell
# Dry-run (no escribe cambios)
python .\scripts\migrations\migrate_watering_frequency.py

# Aplicar cambios
python .\scripts\migrations\migrate_watering_frequency.py --apply

# Aplicar solo a un usuario
python .\scripts\migrations\migrate_watering_frequency.py --apply --user-id user_001
```
