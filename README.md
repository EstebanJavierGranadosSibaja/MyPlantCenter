# MyPlantCenter Monorepo

Monorepo de MyPlantCenter con frontend mobile y backend API.

## Estructura General

```text
MyPlantCenter/
|-- apps/
|   |-- mobile/          # Expo React Native app
|   `-- api/             # FastAPI backend
|-- scripts/
|   |-- firestore/       # Utilidades de import/export/validacion de datos
|   `-- migrations/      # Migraciones y validaciones
|-- data/                # Semillas y backups
|-- docs/                # Documentacion tecnica y operativa
`-- secrets/             # Credenciales locales
```

## Requisitos

- Node.js y npm
- Python y pip
- Credenciales Firebase:
  - Cliente para mobile (variables `EXPO_PUBLIC_*`)
  - Service account para backend (JSON de Admin SDK)

## Arranque Rapido (Desde La Raiz)

1. Instalar dependencias:

```bash
npm run frontend:install
npm run backend:install
```

2. Configurar variables de entorno:

- Frontend: completar `apps/mobile/.env.local`.
- Backend: copiar `apps/api/.env.example` a `apps/api/.env`.
- Credenciales Firebase Admin:
  - Opcion A: colocar `serviceAccountKey.json` en `apps/api/`.
  - Opcion B: definir `FIREBASE_SERVICE_ACCOUNT_PATH` en `apps/api/.env`.

3. Levantar backend:

```bash
npm run backend:start
```

4. Levantar frontend en otra terminal:

```bash
npm run frontend:start
```

Para correr backend solo en localhost:

```bash
npm run backend:start:local
```

## Comandos Disponibles (Raiz)

### Frontend

```bash
npm run frontend:install
npm run frontend:start
npm run frontend:android
npm run frontend:ios
npm run frontend:lint
```

### Backend

```bash
npm run backend:install
npm run backend:start
npm run backend:start:local
npm run backend:check:firestore-contract
```

### Datos y Firestore

```bash
npm run data:normalize
npm run data:check:seed
npm run data:export
npm run data:import
npm run data:import:seed
npm run data:import:seed:clean
npm run data:check:firestore-schema
npm run data:check:firestore-freshness
```

## README Por Modulo

- Mobile: `apps/mobile/README.md`
- API: `apps/api/README.md`
