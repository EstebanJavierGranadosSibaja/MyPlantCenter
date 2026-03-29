/**
 * normalize-db.mjs
 * Purpose: normalize data/seed/db.json into a clean, load-ready seed contract.
 * Input: data/seed/db.json
 * Output: data/seed/db.normalized.seed.json
 */

import fs from 'node:fs';
import path from 'node:path';

const inputPath = path.resolve('data/seed/db.json');
const loadReadyPath = path.resolve('data/seed/db.normalized.seed.json');

const raw = fs.readFileSync(inputPath, 'utf8');
const data = JSON.parse(raw);

function toIsoFromSeconds(seconds, nanos = 0) {
  const ms = (seconds * 1000) + Math.floor((nanos || 0) / 1_000_000);
  return new Date(ms).toISOString();
}

function normalizeIsoString(value) {
  const t = Date.parse(value);
  if (Number.isNaN(t)) return value;
  return new Date(t).toISOString();
}

function normalizeTimestamps(node) {
  if (Array.isArray(node)) {
    return node.map(normalizeTimestamps);
  }

  if (node && typeof node === 'object') {
    const keys = Object.keys(node);
    const isFirestoreTs = keys.length <= 2 && keys.includes('_seconds') && keys.includes('_nanoseconds');
    if (isFirestoreTs) {
      return toIsoFromSeconds(node._seconds, node._nanoseconds);
    }

    const out = {};
    for (const [k, v] of Object.entries(node)) {
      out[k] = normalizeTimestamps(v);
    }
    return out;
  }

  if (typeof node === 'string') {
    if (/^\d{4}-\d{2}-\d{2}T/.test(node) || /^\d{4}-\d{2}-\d{2}$/.test(node)) {
      return normalizeIsoString(node);
    }
  }

  return node;
}

function ensureIdByMap(mapObj) {
  if (!mapObj || typeof mapObj !== 'object' || Array.isArray(mapObj)) return;
  for (const [id, doc] of Object.entries(mapObj)) {
    if (doc && typeof doc === 'object') {
      doc.id = id;
    }
  }
}

function toHandle(input, fallback = 'user') {
  const text = (input || '').trim().toLowerCase();
  if (!text) return fallback;

  const tokens = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s_]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (!tokens.length) return fallback;

  if (tokens.length >= 2) {
    return `${tokens[0]}_${tokens[tokens.length - 1]}`.slice(0, 20);
  }

  return tokens[0].slice(0, 20);
}

function shortCodeFromId(id) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let seed = 0;
  for (const ch of id) {
    seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  }

  let out = '';
  let s = seed || 123456;
  for (let i = 0; i < 6; i++) {
    s = (1664525 * s + 1013904223) >>> 0;
    out += chars[s % chars.length];
  }
  return out;
}

function syncXpMaxFromLevelConfig(fixed) {
  const levelByNumber = {};
  for (const level of Object.values(fixed.levelConfig || {})) {
    if (typeof level.level === 'number') {
      levelByNumber[level.level] = level;
    }
  }

  for (const user of Object.values(fixed.users || {})) {
    const levelCfg = levelByNumber[user.level];
    if (levelCfg && typeof levelCfg.xpMax === 'number') {
      user.xpMax = levelCfg.xpMax;
    }
  }
}

function removeRedundantIconSet(node) {
  if (Array.isArray(node)) {
    node.forEach(removeRedundantIconSet);
    return;
  }

  if (!node || typeof node !== 'object') {
    return;
  }

  if (typeof node.iconSet === 'string' && node.iconSet.toLowerCase() === 'feather') {
    delete node.iconSet;
  }

  for (const value of Object.values(node)) {
    removeRedundantIconSet(value);
  }
}

function normalizeTemplateTiers(template) {
  if (!template || typeof template !== 'object' || !Array.isArray(template.tiers)) {
    return;
  }

  const tierMap = {};
  for (const tierEntry of template.tiers) {
    if (!tierEntry || typeof tierEntry !== 'object' || typeof tierEntry.tier !== 'string') {
      continue;
    }

    tierMap[tierEntry.tier] = {
      goal: Number(tierEntry.goal) || 0,
      xpReward: Number(tierEntry.xpReward) || 0,
    };
  }

  template.tiers = tierMap;
}

function inferAchievementType(template) {
  const category = String(template?.category || '').toLowerCase();
  if (category === 'care') return 'watering_count';
  if (category === 'social') return 'social_count';
  if (category === 'health') return 'health_event_count';
  return 'event_count';
}

const fixed = normalizeTimestamps(data);

for (const collectionName of Object.keys(fixed)) {
  if (fixed[collectionName] && typeof fixed[collectionName] === 'object' && !Array.isArray(fixed[collectionName])) {
    ensureIdByMap(fixed[collectionName]);
  }
}

const extractedCategories = {};
for (const [userId, userDoc] of Object.entries(fixed.users || {})) {
  if (userDoc.categories && typeof userDoc.categories === 'object') {
    for (const [catId, catDoc] of Object.entries(userDoc.categories)) {
      extractedCategories[catId] = {
        id: catId,
        userId,
        ...catDoc,
      };
    }
    delete userDoc.categories;
  }
}
if (fixed.categories && typeof fixed.categories === 'object') {
  const categoryEntries = Object.entries(fixed.categories);
  const nestedByUser = categoryEntries.some(([key, value]) =>
    String(key).startsWith('user_') && value && typeof value === 'object' && !Array.isArray(value)
  );

  if (nestedByUser) {
    for (const [userId, categoryMap] of categoryEntries) {
      if (!categoryMap || typeof categoryMap !== 'object' || Array.isArray(categoryMap)) continue;
      for (const [catId, catDoc] of Object.entries(categoryMap)) {
        extractedCategories[catId] = {
          id: catId,
          userId,
          ...catDoc,
        };
      }
    }
  } else {
    for (const [catId, catDoc] of categoryEntries) {
      if (!catDoc || typeof catDoc !== 'object' || Array.isArray(catDoc)) continue;
      extractedCategories[catId] = {
        id: catId,
        ...catDoc,
      };
    }
  }
}

fixed.categories = extractedCategories;

for (const plant of Object.values(fixed.plants || {})) {
  if (plant.careFrequencyPerWeek && !plant.wateringFrequencyDays) {
    const v = Number(plant.careFrequencyPerWeek);
    if (v > 0) {
      plant.wateringFrequencyDays = Math.max(1, Math.round(7 / v));
    }
  }

  if (plant.wateringFrequencyDays != null) {
    const days = Number(plant.wateringFrequencyDays);
    if (Number.isFinite(days) && days > 0) {
      plant.wateringFrequencyDays = Math.max(1, Math.round(days));
    } else {
      plant.wateringFrequencyDays = 7;
    }
  }

  delete plant.careFrequencyPerWeek;

  if (plant.iconEmoji && plant.iconKey && String(plant.iconEmoji) === String(plant.iconKey)) {
    delete plant.iconEmoji;
  }
  if (plant.iconSet && String(plant.iconSet).toLowerCase() === 'feather') {
    delete plant.iconSet;
  }
}

for (const user of Object.values(fixed.users || {})) {
  if (user.privacy && Object.prototype.hasOwnProperty.call(user.privacy, 'publicProfile')) {
    if (!user.visibility) {
      user.visibility = user.privacy.publicProfile ? 'public' : 'private';
    }
    delete user.privacy.publicProfile;
  }
  if (user.notifications) {
    user.notificationPrefs = user.notifications;
    delete user.notifications;
  }

  if (typeof user.nickname === 'string') {
    user.nickname = toHandle(user.nickname, user.id || 'user');
  }

  if (!user.displayName && typeof user.name === 'string') {
    user.displayName = user.name;
  }

  if (user.displayName == null || String(user.displayName).trim() === '') {
    user.displayName = user.nickname || user.id || 'User';
  }

  if (Object.prototype.hasOwnProperty.call(user, 'name')) {
    delete user.name;
  }

  if (Object.prototype.hasOwnProperty.call(user, 'stats')) {
    delete user.stats;
  }

  if (typeof user.lastActivityDate === 'string' && !user.lastActiveAt) {
    user.lastActiveAt = user.lastActivityDate;
  }
  if (Object.prototype.hasOwnProperty.call(user, 'lastActivityDate')) {
    delete user.lastActivityDate;
  }
}

const usedNicknames = new Set();
for (const [userId, user] of Object.entries(fixed.users || {})) {
  const base = toHandle(user.nickname || user.displayName || userId, userId);
  let candidate = base;
  let i = 2;
  while (usedNicknames.has(candidate)) {
    const suffix = `_${i}`;
    const maxBaseLen = Math.max(1, 20 - suffix.length);
    candidate = `${base.slice(0, maxBaseLen)}${suffix}`;
    i += 1;
  }
  usedNicknames.add(candidate);
  user.nickname = candidate;
}

for (const authUser of Object.values(fixed.authUsers || {})) {
  const profile = fixed.users?.[authUser.profileId];
  const fallback = authUser.id || 'user';

  authUser.nickname = toHandle(
    authUser.nickname || profile?.nickname || profile?.displayName || authUser.fullName,
    fallback,
  );
}

const usedCodes = new Set();
for (const user of Object.values(fixed.users || {})) {
  let code = String(user.friendCode || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (code.length !== 6) {
    code = shortCodeFromId(user.id || user.authUserId || 'USER00');
  }
  while (usedCodes.has(code)) {
    code = shortCodeFromId(code + Math.random().toString(36).slice(2, 6));
  }
  usedCodes.add(code);
  user.friendCode = code;
}

const templatesById = fixed.achievementTemplates || {};
for (const template of Object.values(templatesById)) {
  normalizeTemplateTiers(template);
}

for (const ach of Object.values(fixed.achievements || {})) {
  const tpl = templatesById[ach.templateId];

  if (tpl && tpl.tiers && typeof tpl.tiers === 'object') {
    if (!ach.tier || !Object.prototype.hasOwnProperty.call(tpl.tiers, ach.tier)) {
      const firstTier = Object.keys(tpl.tiers)[0];
      if (firstTier) {
        ach.tier = firstTier;
      }
    }

    if (!ach.type) {
      ach.type = inferAchievementType(tpl);
    }
  }

  if (Object.prototype.hasOwnProperty.call(ach, 'goal')) {
    delete ach.goal;
  }

  if (Object.prototype.hasOwnProperty.call(ach, 'title')) {
    delete ach.title;
  }
  if (Object.prototype.hasOwnProperty.call(ach, 'description')) {
    delete ach.description;
  }
  if (Object.prototype.hasOwnProperty.call(ach, 'iconKey')) {
    delete ach.iconKey;
  }
  if (Object.prototype.hasOwnProperty.call(ach, 'category')) {
    delete ach.category;
  }
}

syncXpMaxFromLevelConfig(fixed);

const categoriesById = fixed.categories || {};
for (const category of Object.values(categoriesById)) {
  if (Object.prototype.hasOwnProperty.call(category, 'count')) {
    delete category.count;
  }

  if (category.iconEmoji && category.iconKey && String(category.iconEmoji) === String(category.iconKey)) {
    delete category.iconEmoji;
  }
}

const userIds = new Set(Object.keys(fixed.users || {}));

for (const plant of Object.values(fixed.plants || {})) {
  if (!userIds.has(plant.userId)) {
    plant.userId = null;
  }

  const category = categoriesById[plant.categoryId];
  if (!category || category.userId !== plant.userId) {
    plant.categoryId = null;
  }

  if (typeof plant.progress === 'number' && !plant.progressMetric) {
    plant.progressMetric = 'growth_percent';
  }
}

for (const ach of Object.values(fixed.achievements || {})) {
  if (!userIds.has(ach.userId)) {
    ach.userId = null;
  }
  if (!templatesById[ach.templateId]) {
    ach.templateId = null;
  }
}

removeRedundantIconSet(fixed);


fs.writeFileSync(loadReadyPath, JSON.stringify(fixed, null, 2));
console.log(`Load-ready seed written to ${loadReadyPath}`);
