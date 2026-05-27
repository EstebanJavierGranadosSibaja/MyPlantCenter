import httpClient from 'src/core/http/client';
import { ApiResponse } from 'src/features/profile/types/user.types';
import { AppNotification } from '../types/notification.types';

export const notificationService = {
  async getByUser(userId: string): Promise<AppNotification[]> {
    const response = await httpClient.get<AppNotification[] | ApiResponse<AppNotification[]>>(
      `/api/users/${userId}/notifications`,
    );
    const data = response.data;
    if (Array.isArray(data)) return data;
    if ('data' in data && Array.isArray(data.data)) return data.data;
    return [];
  },
};
