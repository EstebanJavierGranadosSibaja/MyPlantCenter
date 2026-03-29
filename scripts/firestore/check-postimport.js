/**
 * check-firestore-postimport.js
 * Purpose: verify Firestore post-import schema constraints (required/forbidden fields).
 * Input: current Firestore data via service account
 * Output: SCHEMA_ISSUES report, non-zero exit on failures
 */

const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = path.join(process.cwd(), "secrets", "service-account.json");
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const forbidden = {
  users: ["name", "notifications", "lastActivityDate"],
  achievements: ["goal", "category"],
};

const required = {
  users: ["displayName", "notificationPrefs", "lastActiveAt"],
  achievements: ["type"],
};

async function checkCollectionFields(collection, fieldNames, mode) {
  const issues = [];
  const snapshot = await db.collection(collection).get();

  for (const doc of snapshot.docs) {
    const data = doc.data();

    for (const fieldName of fieldNames) {
      const hasField = Object.prototype.hasOwnProperty.call(data, fieldName);
      if (mode === "forbidden" && hasField) {
        issues.push(`FORBIDDEN ${collection}/${doc.id}.${fieldName}`);
      }

      if (mode === "required" && !hasField) {
        issues.push(`MISSING ${collection}/${doc.id}.${fieldName}`);
      }
    }
  }

  return issues;
}

async function main() {
  const issues = [];

  for (const [collection, fields] of Object.entries(forbidden)) {
    issues.push(...(await checkCollectionFields(collection, fields, "forbidden")));
  }

  for (const [collection, fields] of Object.entries(required)) {
    issues.push(...(await checkCollectionFields(collection, fields, "required")));
  }

  console.log(`SCHEMA_ISSUES ${issues.length}`);
  for (const issue of issues) {
    console.log(issue);
  }

  if (issues.length > 0) {
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
