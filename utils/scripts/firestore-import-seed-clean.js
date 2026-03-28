/**
 * firestore-import-seed-clean.js
 * Purpose: clean-import normalized seed by deleting target collections first.
 * Input: db.normalized.seed.json (repo root)
 * Output: replaces seed collections in Firestore with clean state
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");
const utilitiesRoot = path.resolve(__dirname, "..");
const serviceAccountPath = path.join(utilitiesRoot, "secrets", "service-account.json");
const seedPath = path.join(root, "db.normalized.seed.json");

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));

const TIMESTAMP_FIELDS = new Set([
  "createdAt",
  "updatedAt",
  "lastLoginAt",
  "registeredAt",
  "lastActiveAt",
  "scheduledFor",
  "completedAt",
  "detectedAt",
  "resolvedAt",
  "acceptedAt",
  "unlockedAt",
  "lastWatered",
]);

function toFirestoreFriendly(value, fieldName = "") {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(item => toFirestoreFriendly(item));
  }

  if (typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = toFirestoreFriendly(v, k);
    }
    return out;
  }

  if (typeof value === "string" && TIMESTAMP_FIELDS.has(fieldName)) {
    const t = Date.parse(value);
    if (!Number.isNaN(t)) {
      return new Date(t);
    }
  }

  return value;
}

async function deleteCollection(collectionName) {
  const snapshot = await db.collection(collectionName).get();
  if (snapshot.empty) {
    return;
  }

  const docs = snapshot.docs;
  const chunkSize = 400;

  for (let i = 0; i < docs.length; i += chunkSize) {
    const chunk = docs.slice(i, i + chunkSize);
    const batch = db.batch();

    for (const docSnap of chunk) {
      batch.delete(docSnap.ref);
    }

    await batch.commit();
  }
}

async function importSeedClean() {
  const collections = Object.keys(seed).filter(collectionName => {
    const docs = seed[collectionName];
    return docs && typeof docs === "object" && !Array.isArray(docs);
  });

  console.log(`Colecciones a limpiar/importar: ${collections.join(", ")}`);

  for (const collectionName of collections) {
    console.log(`Limpiando coleccion ${collectionName}...`);
    await deleteCollection(collectionName);
  }

  for (const collectionName of collections) {
    const docs = seed[collectionName];
    const entries = Object.entries(docs);

    const chunkSize = 300;
    for (let i = 0; i < entries.length; i += chunkSize) {
      const chunk = entries.slice(i, i + chunkSize);
      const batch = db.batch();

      for (const [docId, rawDoc] of chunk) {
        const docData = toFirestoreFriendly(rawDoc);
        batch.set(db.collection(collectionName).doc(docId), docData);
      }

      await batch.commit();
    }

    console.log(`Importada coleccion ${collectionName} (${entries.length} docs)`);
  }

  console.log(`Import limpio completado desde ${seedPath}`);
}

importSeedClean().catch(error => {
  console.error("Error importando seed limpio:", error);
  process.exitCode = 1;
});
