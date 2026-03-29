# Runbook de Validacion y Criterios de Pase

## 1. Preparacion de entorno

### Backend
1. Crear archivo local desde plantilla:
   - `copy apps/api/.env.example apps/api/.env`
2. Ajustar valores en `apps/api/.env`.
3. Instalar dependencias:
   - `npm run backend:install`

### Frontend
1. Crear archivo local desde plantilla:
   - `copy apps/mobile/.env.example apps/mobile/.env.local`
2. Ajustar valores en `apps/mobile/.env.local`.
3. Instalar dependencias:
   - `npm run frontend:install`

## 2. Verificacion de seguridad de secretos

1. Verificar que no hay `.env` reales trackeados:
   - `git ls-files "*.env" "*.env.*"`
2. Verificar que `apps/mobile/.env.example` cubre todas las variables `EXPO_PUBLIC_*`:
   - `node scripts/firestore/check-structure.js` (estructura de seed)
   - Verificacion de variables en CI/manual con grep de `EXPO_PUBLIC_` en `apps/mobile/src/**`.

Criterio de pase:
- No hay secretos en commits.
- Solo se versionan archivos `*.env.example`.

## 3. Flujo de seed y migracion limpia de Firestore

1. Normalizar seed:
   - `npm run data:normalize`
2. Validar estructura del seed:
   - `npm run data:check:seed`
3. Respaldar Firestore actual:
   - `npm run data:export`
4. Importar seed limpio (sin merge):
   - `npm run data:import:seed:clean`
5. Verificar ausencia de campos legacy y presencia de nuevos:
   - `npm run data:check:firestore-schema`
6. Validar contrato con modelos backend sobre Firestore real:
   - `npm run backend:check:firestore-contract`

Criterio de pase:
- `SCHEMA_ISSUES 0`
- `CONTRACT_ERRORS 0`

## 4. Validaciones backend/frontend

1. Lint frontend:
   - `npm --prefix apps/mobile run lint`
2. TypeScript frontend:
   - `npm --prefix apps/mobile run tsc --noEmit`
3. Levantar backend:
   - `npm run backend:start:local`
4. Health:
   - `Invoke-RestMethod -Uri "http://127.0.0.1:8000/health"`
5. Usuario:
   - `Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/users/user_001"`
6. Perfil:
   - `Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/users/user_001/profile"`
7. Planta:
   - `Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/plants/plant_001"`

Criterio de pase:
- Endpoints responden 200.
- Sin errores de contrato/lint/TS.

## 5. Validacion de mappers con datos reales

Comando usado en validacion tecnica:
- Ejecutar script temporal TypeScript con `npx tsx` que consume:
  - `/api/users/{id}/profile`
  - `/api/users/{id}/categories`
  - `/api/users/{id}/achievements`
  - `/api/achievement-templates`
  - `/api/level-config`
- Aplicar `mapUserFromApi`, `mapCategoryFromApi`, `mapAchievementFromApi`.

Criterio de pase:
- Sin errores runtime en mappers.
- Sin `undefined` en campos criticos de vista (name, notifications, privacy, iconName).

## 6. Smoke test integrado final

Recorrido minimo:
1. Backend arriba.
2. Frontend en ejecucion (`npm --prefix apps/mobile run start`).
3. Flujo tecnico verificado:
   - Health OK
   - Consulta usuario/perfil/planta OK
   - Persistencia profile (PATCH user) y relectura OK
   - Persistencia planta y relectura OK

Criterio de pase:
- No hay errores criticos en backend ni frontend.
- Los cambios persisten y son re-leibles.

## 7. Definition of Done

- [ ] Entorno reproducible con `.env.example` (backend y frontend).
- [ ] Cero secretos en commits.
- [ ] Seed normalizado vigente.
- [ ] Firestore importado en modo limpio (sin merge legacy).
- [ ] `SCHEMA_ISSUES 0`.
- [ ] `CONTRACT_ERRORS 0`.
- [ ] Frontend lint sin warnings/errores.
- [ ] Frontend TypeScript sin errores.
- [ ] Endpoints clave de backend en 200.
- [ ] Mappers validados con datos reales.
- [ ] Smoke integrado completado.

## 8. Pendiente manual obligatorio

Google login/register con redirect nativo requiere prueba en dispositivo/emulador (Expo) por dependencia de OAuth interactivo.

## 9. Estado de ejecucion (2026-03-28)

### Hecho en esta corrida
- Se elimino fallback de escritura directa en Firestore para actualizacion de plantas en frontend; backend queda como unica fuente de verdad.
- Se ajustaron validadores de fecha para aceptar explicitamente formato `DD/MM/AAAA` (ademas de formato ISO).
- Lint de frontend ejecutado sin errores reportados.
- Se agrego `firebase.json` en raiz para deploy de indices desde `firestore.indexes.json`.

### Bloqueado
- Deploy de indices Firestore bloqueado por permisos IAM en proyecto `myplantcenterdb`.
- Error recibido: falta permiso `serviceusage.services.use` (rol `roles/serviceusage.serviceUsageConsumer`) para la cuenta usada por CLI.

### Proximos pasos exactos
1. Otorgar rol IAM requerido a la cuenta de servicio usada en deploy.
2. Reintentar: `npx firebase-tools deploy --only firestore:indexes --project myplantcenterdb --non-interactive`.
3. Ejecutar pipeline final:
   - `npm run data:check:seed`
   - `npm run data:import:seed:clean`
   - `npm run data:check:firestore-schema`
   - `npm run backend:check:firestore-contract`
   - `npm run data:check:firestore-freshness`
4. Verificacion TS frontend:
   - `npm --prefix apps/mobile exec tsc --noEmit`
