import httpClient from 'src/core/http/client';
import { ApiResponse } from 'src/features/profile/types/user.types';
import { isAxiosError } from 'axios';
import { cameraSyncQueueService } from './cameraSyncQueue.service';
import { detectionHistoryService } from './detectionHistory.service';
import { fileStorageService } from './fileStorage.service';

export interface PlantDetectionCare {
  watering: string;
  light: string;
  soil: string;
  temperature: string;
  humidity: string;
}

export interface PlantDetectionPrediction {
  scientificName: string;
  commonName?: string | null;
  confidence: number;
}

export interface PlantDetectionResult {
  detectionId: string;
  scientificName: string;
  commonName?: string | null;
  confidence: number;
  care: PlantDetectionCare;
  summary: string;
  predictions: PlantDetectionPrediction[];
  provider: string;
  modelVersion: string;
}

export interface PlantDetectionRequest {
  imageUri: string;
  imageMimeType?: string;
  plantId?: string;
  source?: string;
}

export const OFFLINE_QUEUE_ERROR = new Error('OFFLINE_QUEUE');

const isRetryableStatus = (status?: number): boolean => {
  if (!status) return false;
  return status === 429 || (status >= 500 && status < 600);
};

const handleRetryableError = async (
  userId: string,
  payload: PlantDetectionRequest,
  errorMessage: string,
): Promise<never> => {
  const historyRecord = await detectionHistoryService.addPending(payload.imageUri);
  await cameraSyncQueueService.addToQueue(historyRecord.id, userId, payload);
  throw OFFLINE_QUEUE_ERROR;
};

export const plantDetectionService = {
  async analyze(userId: string, payload: PlantDetectionRequest): Promise<PlantDetectionResult> {
    try {
      const imageBase64 = await fileStorageService.readImage(payload.imageUri);
      if (!imageBase64) {
        throw new Error('Image not found in local storage.');
      }

      const requestPayload = {
        ...payload,
        imageBase64,
      };

      const response = await httpClient.post<ApiResponse<PlantDetectionResult>>(
        `/api/users/${userId}/plant-detections/analyze`,
        requestPayload,
      );

      if (!response.data.success) {
        throw new Error(response.data.error ?? 'No se pudo analizar la imagen de la planta.');
      }

      const result = response.data.data;
      await detectionHistoryService.add(payload.imageUri, result, 'synced');

      return result;
    } catch (error) {
      if (isAxiosError(error)) {
        if (!error.response) {
          return handleRetryableError(userId, payload, 'Network error');
        }

        const status = error.response.status;
        if (isRetryableStatus(status)) {
          return handleRetryableError(userId, payload, `Server error: ${status}`);
        }
      }

      throw error;
    }
  },
};