import httpClient from 'src/core/http/client';
import { ApiResponse } from 'src/features/profile/types/user.types';
import { TrendingPlant, RecentActivity, ExploreData } from '../types/explore.types';

interface RawTrendingPlant {
  id: string;
  name: string;
  scientificName: string;
  imageUrl?: string;
  detectionCount: number;
  lastDetected: string; // ISO date string
}

interface RawRecentActivity {
  id: string;
  userId: string;
  userNickname: string;
  plantName: string;
  plantScientificName: string;
  actionType: string;
  timestamp: string; // ISO date string
  confidence?: number;
}

function mapTrendingPlantFromApi(raw: RawTrendingPlant): TrendingPlant {
  return {
    id: raw.id,
    name: raw.name,
    scientificName: raw.scientificName,
    imageUrl: raw.imageUrl,
    detectionCount: raw.detectionCount,
    lastDetected: raw.lastDetected,
  };
}

function mapRecentActivityFromApi(raw: RawRecentActivity): RecentActivity {
  return {
    id: raw.id,
    userId: raw.userId,
    userNickname: raw.userNickname,
    plantName: raw.plantName,
    plantScientificName: raw.plantScientificName,
    actionType: raw.actionType as 'detected' | 'added' | 'updated',
    timestamp: raw.timestamp,
    confidence: raw.confidence,
  };
}

export const exploreService = {
  async getTrendingPlants(): Promise<TrendingPlant[]> {
    const response = await httpClient.get<ApiResponse<RawTrendingPlant[]>>('/api/explore/trending-plants');

    if (!response.data.success) {
      throw new Error(response.data.error ?? 'No se pudieron cargar las plantas en tendencia');
    }

    return response.data.data.map(mapTrendingPlantFromApi);
  },

  async getRecentActivity(): Promise<RecentActivity[]> {
    const response = await httpClient.get<ApiResponse<RawRecentActivity[]>>('/api/explore/recent-activity');

    if (!response.data.success) {
      throw new Error(response.data.error ?? 'No se pudo cargar la actividad reciente');
    }

    return response.data.data.map(mapRecentActivityFromApi);
  },

  async getExploreData(): Promise<ExploreData> {
    const [trendingPlants, recentActivity] = await Promise.all([
      this.getTrendingPlants(),
      this.getRecentActivity()
    ]);

    return {
      trendingPlants,
      recentActivity
    };
  }
};