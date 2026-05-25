import { isAxiosError } from 'axios';
import httpClient from 'src/core/http/client';
import { plantJobService } from 'src/features/plants/services/plantJob.service';
import { LocalPlant, plantLocalService } from 'src/features/plants/services/plantLocal.service';
import { ApiResponse } from 'src/features/profile/types/user.types';
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
  imageBase64?: string;
  plantId?: string;
  source?: string;
}

export const OFFLINE_QUEUE_ERROR = new Error('OFFLINE_QUEUE');

const isRetryableStatus = (status?: number): boolean => {
  if (!status) return false;
  return status === 429 || (status >= 500 && status < 600);
};

const createLocalPlantFromResult = (result: PlantDetectionResult, imageUri: string, jobId?: string): LocalPlant => ({
  id: result.detectionId,
  imageUri,
  name: result.commonName ?? result.scientificName,
  scientificName: result.scientificName,
  confidence: result.confidence,
  careInfo: result.care,
  summary: result.summary,
  createdAt: new Date().toISOString(),
  sourceJobId: jobId,
});

export const plantDetectionService = {
  async analyze(userId: string, payload: PlantDetectionRequest): Promise<PlantDetectionResult> {
    console.log('[PlantDetection] analyze called, userId:', userId, 'imageUri:', payload.imageUri);

    try {
      let imageBase64 = payload.imageBase64;

      if (!imageBase64) {
        console.log('[PlantDetection] No base64 in payload, reading from storage...');
        imageBase64 = await fileStorageService.readImage(payload.imageUri);
        console.log('[PlantDetection] Image read from storage, hasBase64:', !!imageBase64);
      } else {
        console.log('[PlantDetection] Using base64 from payload');
      }

      if (!imageBase64) {
        console.log('[PlantDetection] Throwing: Image not found');
        throw new Error('Image not found in local storage.');
      }

      const requestPayload = {
        ...payload,
        imageBase64,
      };

      console.log('[PlantDetection] Sending request to backend...');

      const response = await httpClient.post<ApiResponse<PlantDetectionResult>>(
        `/api/users/${userId}/plant-detections/analyze`,
        requestPayload,
      );

      console.log('[PlantDetection] Response received, success:', response.data.success);

      if (!response.data.success) {
        throw new Error(response.data.error ?? 'No se pudo analizar la imagen de la planta.');
      }

      const result = response.data.data;
      console.log('[PlantDetection] Result:', result.scientificName);

      await plantLocalService.addPlant(createLocalPlantFromResult(result, payload.imageUri));

      console.log('[PlantDetection] Saved to plantLocalService');

      return result;
    } catch (error) {
      console.log('[PlantDetection] Catch error:', error);
      if (isAxiosError(error)) {
        console.log('[PlantDetection] Axios error, response:', error.response?.status);
        if (!error.response) {
          console.log('[PlantDetection] Network error, queuing...');
          await plantJobService.createJob(payload.imageUri, userId);
          throw OFFLINE_QUEUE_ERROR;
        }

        const status = error.response.status;
        if (isRetryableStatus(status)) {
          console.log('[PlantDetection] Retryable status:', status);
          await plantJobService.createJob(payload.imageUri, userId);
          throw OFFLINE_QUEUE_ERROR;
        }
      }

      const pendingJobs = await plantJobService.getPendingJobs();
      const matchingJob = pendingJobs.find(j => j.imageUri === payload.imageUri);
      if (matchingJob) {
        await plantJobService.updateJobStatus(matchingJob.id, 'failed', error instanceof Error ? error.message : 'Unknown error');
      }

      console.log('[PlantDetection] Rethrowing error');
      throw error;
    }
  },
};
