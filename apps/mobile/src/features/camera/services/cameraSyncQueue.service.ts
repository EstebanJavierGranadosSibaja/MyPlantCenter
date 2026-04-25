import AsyncStorage from '@react-native-async-storage/async-storage';

import { PlantDetectionRequest } from './plantDetection.service';

const STORAGE_KEY = '@myplantcenter:camera_detection_queue_v1';

export interface PendingDetectionItem {
  id: string;
  historyId: string;
  userId: string;
  payload: PlantDetectionRequest;
  createdAt: string;
  attempts: number;
}

const safeParseQueue = (value: string | null): PendingDetectionItem[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.userId === 'string' &&
        typeof item.payload?.imageUri === 'string',
    );
  } catch {
    return [];
  }
};

const readQueue = async (): Promise<PendingDetectionItem[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return safeParseQueue(raw);
};

const writeQueue = async (queue: PendingDetectionItem[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
};

const createId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const cameraSyncQueueService = {
  async getQueue(): Promise<PendingDetectionItem[]> {
    return readQueue();
  },

  async addToQueue(
    historyId: string,
    userId: string,
    payload: PlantDetectionRequest,
  ): Promise<PendingDetectionItem> {
    const queue = await readQueue();
    console.log("QUEUE SIZE:", queue.length);

    const nextItem: PendingDetectionItem = {
      id: createId(),
      historyId,
      userId,
      payload,
      createdAt: new Date().toISOString(),
      attempts: 0,
    };

    await writeQueue([...queue, nextItem]);

    return nextItem;
  },

  async remove(itemId: string): Promise<void> {
    const queue = await readQueue();
    const nextQueue = queue.filter((item) => item.id !== itemId);
    await writeQueue(nextQueue);
  },

  async incrementAttempts(itemId: string): Promise<void> {
    const queue = await readQueue();

    const nextQueue = queue.map((item) =>
      item.id === itemId
        ? {
            ...item,
            attempts: item.attempts + 1,
          }
        : item,
    );

    await writeQueue(nextQueue);
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
};
