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

// Encola un análisis para sincronizarlo luego. Si tenemos el base64, guardamos
// la imagen en almacenamiento estable y encolamos ESE uri — así la sync podrá
// leerla aunque el archivo temporal de cámara/galería ya no exista.
async function queueOffline(payload: PlantDetectionRequest, userId: string): Promise<void> {
  let imageUri = payload.imageUri;
  if (payload.imageBase64) {
    try {
      imageUri = await fileStorageService.saveImage(payload.imageBase64);
    } catch {
      // Si falla el guardado, encolamos el uri original como mejor esfuerzo.
    }
  }
  await plantJobService.createJob(imageUri, userId);
}

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
    try {
      let imageBase64 = payload.imageBase64;

      if (!imageBase64) {
        imageBase64 = await fileStorageService.readImage(payload.imageUri);
      }

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

      await plantLocalService.addPlant(createLocalPlantFromResult(result, payload.imageUri));

      return result;
    } catch (error) {
      if (isAxiosError(error)) {
        if (!error.response) {
          await queueOffline(payload, userId);
          throw OFFLINE_QUEUE_ERROR;
        }

        const status = error.response.status;
        if (isRetryableStatus(status)) {
          await queueOffline(payload, userId);
          throw OFFLINE_QUEUE_ERROR;
        }
      }

      const pendingJobs = await plantJobService.getPendingJobs();
      const matchingJob = pendingJobs.find(j => j.imageUri === payload.imageUri);
      if (matchingJob) {
        await plantJobService.updateJobStatus(matchingJob.id, 'failed', error instanceof Error ? error.message : 'Unknown error');
      }

      throw error;
    }
  },
};
