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
