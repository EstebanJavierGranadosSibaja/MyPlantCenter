import httpClient from 'src/core/http/client';
import { CareHistoryCreatePayload, CareHistoryItem } from 'src/features/care/types/care.types';
import { ApiResponse } from 'src/features/profile/types/user.types';

export const careHistoryService = {
  async getUserHistory(userId: string): Promise<CareHistoryItem[]> {
    const response = await httpClient.get<ApiResponse<CareHistoryItem[]>>(`/api/users/${userId}/care-history`);

    if (!response.data.success) {
      throw new Error(response.data.error ?? 'No se pudo cargar el historial de cuidado.');
    }

    return response.data.data;
  },

  async logCare(userId: string, payload: CareHistoryCreatePayload): Promise<CareHistoryItem> {
    const response = await httpClient.post<ApiResponse<CareHistoryItem>>(
      `/api/users/${userId}/care-history`,
      payload,
    );

    if (!response.data.success) {
      throw new Error(response.data.error ?? 'No se pudo registrar el cuidado.');
    }

    return response.data.data;
  },

  async logWatering(
    userId: string,
    plantId: string,
    completedAt?: string,
    idempotencyKey?: string,
  ): Promise<CareHistoryItem> {
    const resolvedCompletedAt = completedAt ?? new Date().toISOString();
    const resolvedKey = idempotencyKey ?? `${plantId}:${resolvedCompletedAt}`;

    return careHistoryService.logCare(userId, {
      plantId,
      type: 'watering',
      completedAt: resolvedCompletedAt,
      idempotencyKey: resolvedKey,
    });
  },
};
