import {
  Achievement,
  ApiResponse,
  EditProfileDTO,
  UpdateNotificationsDTO,
  UpdatePrivacyDTO,
  UserProfile,
} from 'src/types-dtos/user.types';

import httpClient from 'src/services/http/client';
import { mapAchievementFromApi } from 'src/services/mappers/achievement.mapper';
import {
  mapUserFromApi,
  mapUserToApi,
  RawUserProfileResponse,
} from 'src/services/mappers/user.mapper';

interface RawAchievement {
  id: string;
  userId: string;
  templateId: string;
  tier: string;
  category: string;
  progress: number;
  goal: number;
  unlocked: boolean;
  unlockedAt?: string | null;
  notified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RawAchievementTemplate {
  id: string;
  title: string;
  description: string;
  iconKey: string;
  iconSet: string;
  emoji: string;
  category: string;
}

interface RawLevelConfig {
  id: string;
  level: number;
  title: string;
  xpRequired: number;
  xpMax: number;
  badge: string;
  iconKey: string;
  iconSet: string;
  createdAt: string;
  updatedAt: string;
}

function withError<T>(error: string): ApiResponse<T> {
  return {
    success: false,
    error,
    data: undefined as T,
  };
}

function mergeAchievements(
  achievements: RawAchievement[],
  templates: RawAchievementTemplate[],
): Achievement[] {
  const templateById = new Map(templates.map(item => [item.id, item]));
  return achievements.map(item => mapAchievementFromApi(item, templateById.get(item.templateId)));
}

async function getLevelConfig(level: number): Promise<RawLevelConfig | null> {
  const byIdResponse = await httpClient.get<ApiResponse<RawLevelConfig>>(`/api/level-config/${level}`);
  if (byIdResponse.data.success) {
    return byIdResponse.data.data;
  }

  const listResponse = await httpClient.get<ApiResponse<RawLevelConfig[]>>('/api/level-config');
  if (!listResponse.data.success) {
    return null;
  }

  return listResponse.data.data.find(item => item.level === level) ?? null;
}

export const userService = {

  async getProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    const profileResponse = await httpClient.get<ApiResponse<RawUserProfileResponse>>(`/api/users/${userId}/profile`);

    if (!profileResponse.data.success) {
      return withError<UserProfile>(profileResponse.data.error ?? 'No se pudo cargar el perfil.');
    }

    const levelConfig = await getLevelConfig(profileResponse.data.data.user.level);
    const mappedProfile = mapUserFromApi(profileResponse.data.data, levelConfig);

    const [achievementsResponse, templatesResponse] = await Promise.all([
      httpClient.get<ApiResponse<RawAchievement[]>>(`/api/users/${userId}/achievements`),
      httpClient.get<ApiResponse<RawAchievementTemplate[]>>('/api/achievement-templates'),
    ]);

    if (achievementsResponse.data.success && templatesResponse.data.success) {
      mappedProfile.achievements = mergeAchievements(
        achievementsResponse.data.data,
        templatesResponse.data.data,
      );
    }

    return {
      success: true,
      data: mappedProfile,
    };
  },

  async updateProfile(
    userId: string,
    dto: EditProfileDTO,
  ): Promise<ApiResponse<UserProfile>> {
    const payload = mapUserToApi(dto);
    const response = await httpClient.patch<ApiResponse<unknown>>(`/api/users/${userId}`, payload);

    if (!response.data.success) {
      return withError<UserProfile>(response.data.error ?? 'No se pudo actualizar el perfil.');
    }

    return userService.getProfile(userId);
  },

  async updatePrivacy(
    userId: string,
    dto: UpdatePrivacyDTO,
  ): Promise<ApiResponse<UserProfile>> {
    const response = await httpClient.patch<ApiResponse<unknown>>(`/api/users/${userId}`, {
      privacy: dto.privacy,
      visibility: dto.privacy.publicProfile !== undefined
        ? (dto.privacy.publicProfile ? 'public' : 'private')
        : undefined,
    });

    if (!response.data.success) {
      return withError<UserProfile>(response.data.error ?? 'No se pudo actualizar privacidad.');
    }

    return userService.getProfile(userId);
  },

  async updateNotifications(
    userId: string,
    dto: UpdateNotificationsDTO,
  ): Promise<ApiResponse<UserProfile>> {
    const response = await httpClient.patch<ApiResponse<unknown>>(`/api/users/${userId}`, {
      notifications: dto.notifications,
    });

    if (!response.data.success) {
      return withError<UserProfile>(response.data.error ?? 'No se pudo actualizar notificaciones.');
    }

    return userService.getProfile(userId);
  },

};