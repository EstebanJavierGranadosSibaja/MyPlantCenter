import { CHAT_API_URL } from '../config/chat.config';
import { ChatMessage, ChatUser, JoinResponse } from '../types/chat.types';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${CHAT_API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = (body as { detail?: { message?: string } | string }).detail;
    const msg =
      typeof detail === 'string'
        ? detail
        : (detail as { message?: string })?.message ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export const chatApiService = {
  async join(nickname: string): Promise<JoinResponse> {
    return request<JoinResponse>('/api/chat/join', {
      method: 'POST',
      body: JSON.stringify({ nickname }),
    });
  },

  async logout(token: string): Promise<void> {
    await request('/api/chat/logout', {
      method: 'POST',
      headers: authHeaders(token),
    });
  },

  async registerPublicKey(token: string, publicKey: string): Promise<void> {
    await request('/api/chat/users/me/public-key', {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ public_key: publicKey }),
    });
  },

  async getOnlineUsers(token: string): Promise<ChatUser[]> {
    return request<ChatUser[]>('/api/chat/users', {
      headers: authHeaders(token),
    });
  },

  async getGroupMessages(token: string, limit = 50): Promise<ChatMessage[]> {
    return request<ChatMessage[]>(`/api/chat/messages?limit=${limit}`, {
      headers: authHeaders(token),
    });
  },

  async getDmHistory(token: string, otherId: string): Promise<ChatMessage[]> {
    return request<ChatMessage[]>(`/api/chat/messages/dm/${otherId}`, {
      headers: authHeaders(token),
    });
  },
};
