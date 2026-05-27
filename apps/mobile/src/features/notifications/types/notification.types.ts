export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  data?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}
