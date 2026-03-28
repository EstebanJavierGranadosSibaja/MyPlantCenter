/**
 * firestore-import-seed.js
 * Purpose: import normalized seed into Firestore with merge=true.
 * Input: db.normalized.seed.json (repo root)
 * Output: writes/merges seed documents into Firestore
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

async function importSeed() {
  for (const [collectionName, docs] of Object.entries(seed)) {
    if (!docs || typeof docs !== "object" || Array.isArray(docs)) {
      continue;
    }

    for (const [docId, rawDoc] of Object.entries(docs)) {
      const docData = toFirestoreFriendly(rawDoc);
      await db.collection(collectionName).doc(docId).set(docData, { merge: true });
      console.log(`✔ ${collectionName}/${docId}`);
    }
  }

  console.log(`Import completo (seed) desde ${seedPath}`);
}

importSeed().catch(error => {
  console.error("Error importando seed:", error);
  process.exitCode = 1;
});
