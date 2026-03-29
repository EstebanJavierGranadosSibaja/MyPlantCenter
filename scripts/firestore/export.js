/**
 * firestore-export.js
 * Purpose: export all Firestore collections to a local backup JSON.
 * Input: Firestore project configured by secrets/service-account.json
 * Output: data/backup/backup.json
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const serviceAccountPath = path.join(repoRoot, "secrets", "service-account.json");
const outputPath = path.join(repoRoot, "data", "backup", "backup.json");
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function exportCollection(collectionRef) {
  const snapshot = await collectionRef.get();
  const data = {};

  for (const doc of snapshot.docs) {
    data[doc.id] = doc.data();

    const subcollections = await doc.ref.listCollections();
    for (const sub of subcollections) {
      data[doc.id][sub.id] = await exportCollection(sub);
    }
  }

  return data;
}

async function exportAll() {
  const collections = await db.listCollections();
  const backup = {};

  for (const col of collections) {
    console.log(`Exportando ${col.id}...`);
    backup[col.id] = await exportCollection(col);
  }

  fs.writeFileSync(outputPath, JSON.stringify(backup, null, 2));
  console.log(`Export completo guardado en ${outputPath}`);
}

exportAll();