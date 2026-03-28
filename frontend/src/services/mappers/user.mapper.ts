import {
  EditProfileDTO,
  FavoritePlant,
  UserProfile,
  UserUpdateDTO,
} from 'src/types-dtos/user.types';

import { mapCategoryFromApi } from './category.mapper';

interface RawLevelConfig {
  id: string;
  level: number;
  title: string;
  xpRequired: number;
  xpMax: number;
  badge: string;
  iconKey: string;
  iconSet?: string;
  createdAt: string;
  updatedAt: string;
}

interface RawUserStats {
  plantsCount: number;
  friendsCount: number;
  wateredToday: number;
  activeDays: number;
}

interface RawUserPrivacy {
  showStreak: boolean;
  showBirthday: boolean;
  allowRequests: boolean;
}

interface RawUserNotifications {
  wateringReminders: boolean;
  healthAlerts: boolean;
  newFriends: boolean;
  achievementsUnlocked: boolean;
}

interface RawUser {
  id: string;
  authUserId: string;
  name?: string;
  displayName?: string;
  nickname: string;
  friendCode: string;
  description?: string | null;
  avatarUrl?: string | null;
  birthday?: string | null;
  location?: string | null;
  visibility: 'public' | 'private';
  favoritePlantId?: string | null;
  streakDays: number;
  bestStreak: number;
  lastActivityDate?: string;
  lastActiveAt?: string;
  streakFrozenUntil?: string | null;
  level: number;
  xp: number;
  stats?: RawUserStats;
  registeredAt: string;
  updatedAt: string;
  privacy?: RawUserPrivacy;
  notifications?: RawUserNotifications;
  notificationPrefs?: RawUserNotifications;
}

interface RawPlant {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  nickname: string;
  scientificName: string;
  iconKey: string;
  iconSet?: string;
  iconEmoji?: string;
  healthStatus: number;
  progress: number;
  favorite: boolean;
  careFrequencyPerWeek: number;
  lastWatered: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface RawCategory {
  id: string;
  name: string;
  iconKey: string;
  iconSet?: string;
  iconEmoji?: string;
  color: string;
  count?: number;
  order: number;
  createdAt: string;
}

export interface RawUserProfileResponse {
  user: RawUser;
  categories: RawCategory[];
  favoritePlant?: RawPlant | null;
}

function addNicknamePrefix(nickname: string): string {
  return nickname.startsWith('@') ? nickname : `@${nickname}`;
}

function stripNicknamePrefix(nickname: string): string {
  return nickname.replace(/^@+/, '').trim();
}

function normalizeId(rawId: string): string {
  return rawId.replace(/-/g, '_');
}

function formatBirthdayForDisplay(isoDate?: string | null): string | undefined {
  if (!isoDate) {
    return undefined;
  }

  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return parsed.toLocaleDateString('es-CR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function mapFavoritePlant(raw?: RawPlant | null): FavoritePlant | undefined {
  if (!raw) {
    return undefined;
  }

  return {
    id: normalizeId(raw.id),
    name: raw.name,
    iconName: 'feather',
    category: raw.categoryId,
  };
}

export function mapUserFromApi(
  raw: RawUserProfileResponse,
  levelConfig?: RawLevelConfig | null,
): UserProfile {
  const user = raw.user;
  const stats = user.stats ?? {
    plantsCount: 0,
    friendsCount: 0,
    wateredToday: 0,
    activeDays: 0,
  };
  const notifications = user.notificationPrefs ?? user.notifications ?? {
    wateringReminders: true,
    healthAlerts: true,
    newFriends: true,
    achievementsUnlocked: true,
  };
  const privacy = user.privacy ?? {
    showStreak: true,
    showBirthday: false,
    allowRequests: true,
  };
  const resolvedName = user.displayName ?? user.name ?? '';

  return {
    id: normalizeId(user.id),
    name: resolvedName,
    nickname: addNicknamePrefix(user.nickname),
    description: user.description ?? '',
    avatarUrl: user.avatarUrl ?? undefined,
    birthday: formatBirthdayForDisplay(user.birthday),
    birthdayIso: user.birthday ?? undefined,
    location: user.location ?? undefined,
    registeredAt: user.registeredAt,
    level: {
      level: user.level,
      title: levelConfig?.title ?? `Nivel ${user.level}`,
      xp: user.xp,
      xpMax: levelConfig?.xpMax ?? user.xp,
    },
    stats: {
      plantsCount: stats.plantsCount,
      friendsCount: stats.friendsCount,
      streak: user.streakDays,
      bestStreak: user.bestStreak,
      wateredToday: stats.wateredToday,
      activeDays: stats.activeDays,
    },
    favoritePlant: mapFavoritePlant(raw.favoritePlant),
    categories: raw.categories.map(mapCategoryFromApi),
    achievements: [],
    privacy: {
      publicProfile: user.visibility === 'public',
      showStreak: privacy.showStreak,
      showBirthday: privacy.showBirthday,
      allowRequests: privacy.allowRequests,
    },
    notifications: {
      wateringReminders: notifications.wateringReminders,
      healthAlerts: notifications.healthAlerts,
      newFriends: notifications.newFriends,
      achievementsUnlocked: notifications.achievementsUnlocked,
    },
  };
}

export function mapUserToApi(profile: Partial<UserProfile> | EditProfileDTO): Partial<UserUpdateDTO> {
  const draft = profile as Partial<UserProfile>;
  const editDraft = profile as EditProfileDTO;

  const nickname = draft.nickname ?? editDraft.nickname;
  const birthday = draft.birthdayIso ?? editDraft.birthday ?? draft.birthday;

  return {
    name: draft.name ?? editDraft.name,
    nickname: nickname ? stripNicknamePrefix(nickname) : undefined,
    description: draft.description ?? editDraft.description,
    birthday: birthday ?? null,
    location: draft.location ?? editDraft.location ?? null,
    visibility: draft.privacy
      ? (draft.privacy.publicProfile ? 'public' : 'private')
      : undefined,
    privacy: draft.privacy,
    notifications: draft.notifications,
  };
}
