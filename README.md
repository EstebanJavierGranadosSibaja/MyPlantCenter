# MyPlantCenter Monorepo

Estructura final del proyecto:

```text
MyPlantCenter/
├── apps/mobile/   # Expo React Native app
└── apps/api/   # FastAPI backend
```

## Comandos desde la raiz

```bash
# Frontend
npm run frontend:install
npm run frontend:start

# Backend
npm run backend:install
npm run backend:start
```

Para correr backend solo en localhost:

```bash
npm run backend:start:local
```

## Variables de entorno

- Frontend: usa `apps/mobile/.env.local`.
- Backend: copia `apps/api/.env.example` a `apps/api/.env`.
- Credenciales Firebase Admin: coloca `serviceAccountKey.json` dentro de `apps/api/`.
