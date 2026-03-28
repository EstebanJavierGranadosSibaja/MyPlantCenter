/**
 * check-firestore-freshness.js
 * Purpose: verify recency of Firestore writes using document create/update metadata.
 * Input: current Firestore data via service account
 * Output: per-collection freshness summary and stale-count exit signal
 */

const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = path.join(process.cwd(), "utils", "secrets", "service-account.json");
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const collections = [
  "authUsers",
  "users",
  "plants",
  "categories",
  "achievements",
  "achievementTemplates",
  "careSchedule",
  "careHistory",
  "notifications",
  "plantDetections",
  "plantIssues",
  "plantTags",
  "friendRequests",
  "friendships",
  "levelConfig",
];

const maxAllowedAgeHours = Number(process.env.FIRESTORE_FRESHNESS_MAX_HOURS || "72");

function toHours(diffMs) {
  return diffMs / (1000 * 60 * 60);
}

async function summarizeCollection(name) {
  const snapshot = await db.collection(name).get();

  if (snapshot.empty) {
    return {
      name,
      count: 0,
      oldestCreate: null,
      latestCreate: null,
      latestUpdate: null,
      ageHours: null,
    };
  }

  const docs = snapshot.docs;
  const createTimes = docs
    .map(doc => doc.createTime && doc.createTime.toDate())
    .filter(Boolean);
  const updateTimes = docs
    .map(doc => doc.updateTime && doc.updateTime.toDate())
    .filter(Boolean);

  const oldestCreate = new Date(Math.min(...createTimes.map(date => date.getTime())));
  const latestCreate = new Date(Math.max(...createTimes.map(date => date.getTime())));
  const latestUpdate = new Date(Math.max(...updateTimes.map(date => date.getTime())));
  const ageHours = toHours(Date.now() - latestUpdate.getTime());

  return {
    name,
    count: docs.length,
    oldestCreate,
    latestCreate,
    latestUpdate,
    ageHours,
  };
}

async function main() {
  const summaries = [];

  for (const collection of collections) {
    summaries.push(await summarizeCollection(collection));
  }

  let staleCount = 0;

  for (const item of summaries) {
    if (item.count === 0) {
      console.log(`${item.name}: empty`);
      continue;
    }

    const staleMark = item.ageHours > maxAllowedAgeHours ? "STALE" : "OK";
    if (staleMark === "STALE") {
      staleCount += 1;
    }

    console.log(
      `${item.name}: count=${item.count} create[min]=${item.oldestCreate.toISOString()} create[max]=${item.latestCreate.toISOString()} update[max]=${item.latestUpdate.toISOString()} ageHours=${item.ageHours.toFixed(2)} status=${staleMark}`,
    );
  }

  console.log(`FRESHNESS_STALE_COLLECTIONS ${staleCount}`);

  if (staleCount > 0) {
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
