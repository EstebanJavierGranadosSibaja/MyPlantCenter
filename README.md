# MyPlantCenter Monorepo

Estructura final del proyecto:

```text
MyPlantCenter/
├── frontend/   # Expo React Native app
└── backend/    # FastAPI backend
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

- Frontend: usa `frontend/.env.local`.
- Backend: copia `backend/.env.example` a `backend/.env`.
- Credenciales Firebase Admin: coloca `serviceAccountKey.json` dentro de `backend/`.
