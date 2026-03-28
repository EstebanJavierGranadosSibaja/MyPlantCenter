/**
 * check-seed-structure.js
 * Purpose: validate required collections and key fields in normalized seed.
 * Input: db.normalized.seed.json (repo root)
 * Output: JSON summary with missing collections/issues, non-zero exit on failure
 */

const fs = require("fs");
const path = require("path");

const seedPath = path.join(process.cwd(), "db.normalized.seed.json");
const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));

const requiredCollections = [
  "achievementTemplates",
  "achievements",
  "authUsers",
  "careHistory",
  "careSchedule",
  "categories",
  "friendRequests",
  "friendships",
  "levelConfig",
  "notifications",
  "plantDetections",
  "plantIssues",
  "plantTags",
  "plants",
  "users",
];

const missingCollections = requiredCollections.filter(name => !(name in seed));
const issues = [];

for (const [id, user] of Object.entries(seed.users || {})) {
  if (!Object.prototype.hasOwnProperty.call(user, "displayName")) {
    issues.push(`MISSING users/${id}.displayName`);
  }

  if (!Object.prototype.hasOwnProperty.call(user, "notificationPrefs")) {
    issues.push(`MISSING users/${id}.notificationPrefs`);
  }

  if (!Object.prototype.hasOwnProperty.call(user, "lastActiveAt")) {
    issues.push(`MISSING users/${id}.lastActiveAt`);
  }
}

for (const [id, achievement] of Object.entries(seed.achievements || {})) {
  if (!Object.prototype.hasOwnProperty.call(achievement, "type")) {
    issues.push(`MISSING achievements/${id}.type`);
  }

  if (Object.prototype.hasOwnProperty.call(achievement, "goal")) {
    issues.push(`FORBIDDEN achievements/${id}.goal`);
  }

  if (Object.prototype.hasOwnProperty.call(achievement, "category")) {
    issues.push(`FORBIDDEN achievements/${id}.category`);
  }
}

for (const [id, detection] of Object.entries(seed.plantDetections || {})) {
  if (!Object.prototype.hasOwnProperty.call(detection, "userId")) {
    issues.push(`MISSING plantDetections/${id}.userId`);
  }

  if (!Object.prototype.hasOwnProperty.call(detection, "topPrediction")) {
    issues.push(`MISSING plantDetections/${id}.topPrediction`);
  }

  if (!Object.prototype.hasOwnProperty.call(detection, "confidence")) {
    issues.push(`MISSING plantDetections/${id}.confidence`);
  }

  const confidence = Number(detection.confidence);
  if (Number.isNaN(confidence) || confidence < 0 || confidence > 1) {
    issues.push(`INVALID plantDetections/${id}.confidence`);
  }

  if (!Array.isArray(detection.predictions) || detection.predictions.length === 0) {
    issues.push(`MISSING plantDetections/${id}.predictions`);
  }
}

console.log(JSON.stringify({
  seedPath,
  missingCollections,
  issueCount: issues.length,
  issues,
}, null, 2));

if (missingCollections.length || issues.length) {
  process.exitCode = 1;
}
