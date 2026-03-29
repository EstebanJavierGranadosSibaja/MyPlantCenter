import httpClient from 'src/core/http/client';
import { FriendRequest, Friendship } from 'src/features/friends/types/friends.types';
import { ApiResponse } from 'src/features/profile/types/user.types';

export const socialService = {
  async getFriendships(userId: string): Promise<Friendship[]> {
    const response = await httpClient.get<ApiResponse<Friendship[]>>(`/api/users/${userId}/friendships`);

    if (!response.data.success) {
      throw new Error(response.data.error ?? 'No se pudieron cargar las amistades.');
    }

    return response.data.data;
  },

  async getFriendRequests(userId: string): Promise<FriendRequest[]> {
    const response = await httpClient.get<ApiResponse<FriendRequest[]>>(`/api/users/${userId}/friend-requests`);

    if (!response.data.success) {
      throw new Error(response.data.error ?? 'No se pudieron cargar las solicitudes.');
    }

    return response.data.data;
  },

  async sendFriendRequest(userId: string, toCode: string): Promise<FriendRequest> {
    const response = await httpClient.post<ApiResponse<FriendRequest>>(
      `/api/users/${userId}/friend-requests`,
      { toCode: toCode.trim().toUpperCase() },
    );

    if (!response.data.success) {
      throw new Error(response.data.error ?? 'No se pudo enviar la solicitud.');
    }

    return response.data.data;
  },

  async resolveFriendRequest(requestId: string, userId: string, status: 'accepted' | 'rejected'): Promise<FriendRequest> {
    const response = await httpClient.patch<ApiResponse<FriendRequest>>(
      `/api/friend-requests/${requestId}`,
      { userId, status },
    );

    if (!response.data.success) {
      throw new Error(response.data.error ?? 'No se pudo responder la solicitud.');
    }

    return response.data.data;
  },
};
