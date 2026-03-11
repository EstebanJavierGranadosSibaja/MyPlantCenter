import type { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type FeatherIconName = ComponentProps<typeof Feather>['name'];

// Data interfaces
export interface PlantCategory {
  id: string;
  name: string;
  iconName: FeatherIconName;
  color: string;
  amount: number;
}

export interface FavoritePlant {
  id: string;
  name: string;
  iconName: FeatherIconName;
  category: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: FeatherIconName;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface PrivacySettings {
  publicProfile: boolean;
  showStreak: boolean;
  showBirthday: boolean;
  allowRequests: boolean;
}

export interface NotificationSettings {
  wateringReminders: boolean;
  healthAlerts: boolean;
  newFriends: boolean;
  achievementsUnlocked: boolean;
}

export interface UserStats {
  plantsCount: number;
  friendsCount: number;
  streak: number;
  bestStreak: number;
  wateredToday: number;
  activeDays: number;
}

export interface UserLevel {
  level: number;
  title: string;
  xp: number;
  xpMax: number;
}

export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  description: string;
  avatarUrl?: string;
  birthday?: string;
  location?: string;
  registeredAt: string;

  level: UserLevel;
  stats: UserStats;
  favoritePlant?: FavoritePlant;
  categories: PlantCategory[];
  achievements: Achievement[];
  privacy: PrivacySettings;
  notifications: NotificationSettings;
}

// DTOs
export interface EditProfileDTO {
  name: string;
  nickname: string;
  description: string;
  birthday?: string;
  location?: string;
}

export interface UpdatePrivacyDTO {
  privacy: Partial<PrivacySettings>;
}

export interface UpdateNotificationsDTO {
  notifications: Partial<NotificationSettings>;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}