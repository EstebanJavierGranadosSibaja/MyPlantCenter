# Utilities

Estructura limpia y funcional para tareas de datos/Firestore.

## Estructura

- `scripts/normalize-db.mjs`: normaliza `db.json` y genera `db.normalized.seed.json` en la raiz.
- `scripts/firestore-export.js`: exporta Firestore a `utils/data/backup.json`.
- `scripts/firestore-import.js`: importa `utils/data/import.data.json` a Firestore.
- `data/import.data.json`: archivo fuente para importaciones puntuales.
- `data/backup.json`: backup generado por el script de export.
- `docs/db_schema_erd.html`: diagrama ERD de referencia.
- `secrets/service-account.json`: credencial de servicio Firebase (ignorada por git).

## Comandos (desde raiz)

- `npm run data:normalize`
- `npm run data:export`
- `npm run data:import`
- `npm run data:import:seed`

## Flujo recomendado

1. Exportar backup: `npm run data:export`
2. Ajustar dataset en `db.json`
3. Normalizar: `npm run data:normalize`
4. Para importar cambios puntuales: `npm run data:import`
5. Para subir el seed completo validado (`db.normalized.seed.json`): `npm run data:import:seed`
