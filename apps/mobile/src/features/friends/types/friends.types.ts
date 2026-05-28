export interface Friendship {
  id: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  toCode: string;
  status: string;
  acceptedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FriendSummary {
  id: string;
  name: string;
  nickname: string;
  avatarUrl?: string | null;
  level: number;
  visibility: string;
  plantsCount: number;
  streakDays: number;
  friendshipId: string;
  friendsSince?: string | null;
}
