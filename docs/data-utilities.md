# Utilities

Estructura limpia y funcional para tareas de datos/Firestore.

## Estructura

- `scripts/firestore/normalize-db.mjs`: normaliza `data/seed/db.json` y genera `data/seed/db.normalized.seed.json`.
- `scripts/firestore/export.js`: exporta Firestore a `data/backup/backup.json`.
- `scripts/firestore/import.js`: importa `data/backup/import.data.json` a Firestore.
- `data/backup/import.data.json`: archivo fuente para importaciones puntuales.
- `data/backup/backup.json`: backup generado por el script de export.
- `docs/db_schema_erd.html`: diagrama ERD de referencia.
- `secrets/service-account.json`: credencial de servicio Firebase (ignorada por git).

## Comandos (desde raiz)

- `npm run data:normalize`
- `npm run data:export`
- `npm run data:import`
- `npm run data:import:seed`

## Flujo recomendado

1. Exportar backup: `npm run data:export`
2. Ajustar dataset en `data/seed/db.json`
3. Normalizar: `npm run data:normalize`
4. Para importar cambios puntuales: `npm run data:import`
5. Para subir el seed completo validado (`data/seed/db.normalized.seed.json`): `npm run data:import:seed`
