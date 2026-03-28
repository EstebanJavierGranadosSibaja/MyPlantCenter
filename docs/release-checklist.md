# Checklist de Entrega

## 1. Freeze
- [ ] Congelar cambios funcionales.
- [ ] Permitir solo fixes de release/blockers.

## 2. Validaciones tecnicas
- [ ] `npm --prefix frontend run lint`
- [ ] `npm --prefix frontend exec tsc --noEmit`
- [ ] `npm run data:check:seed`
- [ ] `npm run data:import:seed:clean`
- [ ] `npm run data:check:firestore-schema`
- [ ] `npm run backend:check:firestore-contract`
- [ ] `npm run data:check:firestore-freshness`

## 3. Firebase
- [ ] Deploy de indices:
  - `npx firebase-tools deploy --only firestore:indexes --project myplantcenterdb --non-interactive`
- [ ] Confirmar sin errores en consola.

## 4. Snapshot de evidencia
- [ ] Guardar salida de comandos de validacion.
- [ ] Guardar evidencia de deploy de indices.
- [ ] Registrar fecha/hora de verificacion final.

## 5. Riesgos residuales
- [ ] Listar riesgos abiertos (si existen).
- [ ] Definir owner y fecha objetivo por riesgo.

## 6. Tag y cierre
- [ ] Crear tag de release (ejemplo: `v1.0.0-db-ready`).
- [ ] Publicar nota de release con cambios y validaciones.
