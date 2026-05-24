export type CareType = 'watering' | 'pruning' | 'fertilizing' | 'health';

export interface CareHistoryItem {
  id: string;
  userId: string;
  plantId: string;
  scheduleId?: string | null;
  type: CareType | string;
  createdAt: string;
  completedAt: string;
  notes?: string | null;
  updatedAt: string;
}

export interface CareHistoryCreatePayload {
  plantId: string;
  type?: CareType | string;
  completedAt?: string;
  scheduleId?: string | null;
  notes?: string | null;
  idempotencyKey?: string;
}
