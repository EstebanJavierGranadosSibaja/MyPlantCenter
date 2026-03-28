/**
 * firestore-import.js
 * Purpose: import a targeted dataset into Firestore with merge semantics.
 * Input: utils/data/import.data.json
 * Output: writes merged documents into Firestore
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const utilitiesRoot = path.resolve(__dirname, "..");
const serviceAccountPath = path.join(utilitiesRoot, "secrets", "service-account.json");
const inputPath = path.join(utilitiesRoot, "data", "import.data.json");
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));

async function importData() {
  for (const collectionName in data) {
    const collection = data[collectionName];

    for (const docId in collection) {
      let docData = collection[docId];

      // Convert known date fields to Date objects before write.
      if (docData.createdAt) {
        docData.createdAt = new Date(docData.createdAt);
      }
      if (docData.updatedAt) {
        docData.updatedAt = new Date(docData.updatedAt);
      }
      if (docData.lastWatered) {
        docData.lastWatered = new Date(docData.lastWatered);
      }

      await db
        .collection(collectionName)
        .doc(docId)
        .set(docData, { merge: true });

      console.log(`✔ ${collectionName}/${docId}`);
    }
  }

  console.log(`Import seguro completado desde ${inputPath}`);
}

importData();