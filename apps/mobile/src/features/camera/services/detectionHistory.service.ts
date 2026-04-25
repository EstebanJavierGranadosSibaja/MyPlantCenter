import AsyncStorage from '@react-native-async-storage/async-storage';

import { PlantDetectionCare, PlantDetectionResult } from './plantDetection.service';

const STORAGE_KEY = '@myplantcenter:detection_history_v1';

export type DetectionStatus = 'pending' | 'synced' | 'failed';

export interface DetectionRecord {
  id: string;
  imageUri: string;
  plantName: string;
  scientificName: string;
  confidence: number;
  careInfo: PlantDetectionCare;
  timestamp: string;
  status: DetectionStatus;
}

const MAX_HISTORY_RECORDS = 100;

const safeParseHistory = (value: string | null): DetectionRecord[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
};

const readHistory = async (): Promise<DetectionRecord[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return safeParseHistory(raw);
};

const writeHistory = async (history: DetectionRecord[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

const createId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const detectionHistoryService = {
  async getAll(): Promise<DetectionRecord[]> {
    return readHistory();
  },

  async add(
    imageUri: string,
    result: PlantDetectionResult,
    status: DetectionStatus = 'synced',
  ): Promise<DetectionRecord> {
    const history = await readHistory();

    const record: DetectionRecord = {
      id: createId(),
      imageUri,
      plantName: result.commonName ?? result.scientificName,
      scientificName: result.scientificName,
      confidence: result.confidence,
      careInfo: result.care,
      timestamp: new Date().toISOString(),
      status,
    };

    history.unshift(record);

    if (history.length > MAX_HISTORY_RECORDS) {
      history.splice(MAX_HISTORY_RECORDS);
    }

    await writeHistory(history);

    return record;
  },

  async addPending(imageUri: string): Promise<DetectionRecord> {
    const history = await readHistory();

    const record: DetectionRecord = {
      id: createId(),
      imageUri,
      plantName: 'Pendiente',
      scientificName: '',
      confidence: 0,
      careInfo: {
        watering: '',
        light: '',
        soil: '',
        temperature: '',
        humidity: '',
      },
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    history.unshift(record);
    await writeHistory(history);

    return record;
  },

  async update(
    recordId: string,
    result: PlantDetectionResult,
    status: DetectionStatus,
  ): Promise<void> {
    const history = await readHistory();

    const index = history.findIndex((r) => r.id === recordId);
    if (index === -1) {
      return;
    }

    history[index] = {
      ...history[index],
      plantName: result.commonName ?? result.scientificName,
      scientificName: result.scientificName,
      confidence: result.confidence,
      careInfo: result.care,
      status,
    };

    await writeHistory(history);
  },

  async updateStatus(recordId: string, status: DetectionStatus): Promise<void> {
    const history = await readHistory();

    const index = history.findIndex((r) => r.id === recordId);
    if (index === -1) {
      return;
    }

    history[index].status = status;
    await writeHistory(history);
  },

  async remove(recordId: string): Promise<void> {
    const history = await readHistory();
    const next = history.filter((r) => r.id !== recordId);
    await writeHistory(next);
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },

  async getPending(): Promise<DetectionRecord[]> {
    const history = await readHistory();
    return history.filter((r) => r.status === 'pending');
  },

  async getSynced(): Promise<DetectionRecord[]> {
    const history = await readHistory();
    return history.filter((r) => r.status === 'synced');
  },
};