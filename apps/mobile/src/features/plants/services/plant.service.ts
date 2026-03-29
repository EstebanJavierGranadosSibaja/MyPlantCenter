import httpClient from 'src/core/http/client';
import { ApiResponse } from 'src/features/profile/types/user.types';
import { EditPlantDTO, Plant } from 'src/features/plants/types/plant.types';

interface RawPlant {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  scientificName?: string;
  wateringFrequencyDays?: number;
  careFrequencyPerWeek?: number;
  description?: string;
  acquiredAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface RawPlantDetailResponse {
  plant: RawPlant;
}

interface RawDeletePlantResponse {
  deleted: boolean;
  plantId: string;
}

function careFrequencyPerWeekToDays(value?: number): number {
  if (!value || value <= 0) {
    return 7;
  }

  return Math.max(1, Math.round(7 / value));
}

function mapPlantFromApi(raw: RawPlant): Plant {
  const wateringDays =
    typeof raw.wateringFrequencyDays === 'number' && raw.wateringFrequencyDays > 0
      ? Math.round(raw.wateringFrequencyDays)
      : careFrequencyPerWeekToDays(raw.careFrequencyPerWeek);

  return {
    id: raw.id,
    name: raw.name,
    species: raw.scientificName ?? '',
    categoryId: raw.categoryId,
    wateringFrequencyDays: wateringDays,
    notes: raw.description ?? '',
    acquiredAt: raw.acquiredAt,
    ownerId: raw.userId,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function mapEditPlantToApi(dto: EditPlantDTO): Record<string, unknown> {
  const wateringDays = Math.max(1, Math.round(dto.wateringFrequencyDays));

  return {
    name: dto.name,
    scientificName: dto.species ?? '',
    categoryId: dto.categoryId,
    wateringFrequencyDays: wateringDays,
    description: dto.notes ?? '',
    acquiredAt: dto.acquiredAt,
  };
}

export const plantService = {
  async getByUser(userId: string): Promise<Plant[]> {
    const response = await httpClient.get<ApiResponse<RawPlant[]>>(`/api/users/${userId}/plants`);

    if (!response.data.success) {
      throw new Error(response.data.error ?? 'No se pudieron cargar las plantas del usuario.');
    }

    return response.data.data.map(mapPlantFromApi);
  },

  async getById(plantId: string): Promise<Plant> {
    const response = await httpClient.get<ApiResponse<RawPlantDetailResponse>>(`/api/plants/${plantId}`);

    if (!response.data.success) {
      throw new Error(response.data.error ?? 'No se pudo cargar la planta.');
    }

    return mapPlantFromApi(response.data.data.plant);
  },

  async update(plantId: string, dto: EditPlantDTO): Promise<void> {
    const payload = mapEditPlantToApi(dto);

    const response = await httpClient.patch<ApiResponse<unknown>>(
      `/api/plants/${plantId}`,
      payload,
    );

    if (!response.data.success) {
      throw new Error(response.data.error ?? 'No se pudo actualizar la planta.');
    }
  },

  async createByUser(userId: string, dto: EditPlantDTO): Promise<Plant> {
    const payload = mapEditPlantToApi(dto);

    const response = await httpClient.post<ApiResponse<RawPlantDetailResponse>>(
      `/api/users/${userId}/plants`,
      payload,
    );

    if (!response.data.success) {
      throw new Error(response.data.error ?? 'No se pudo crear la planta.');
    }

    return mapPlantFromApi(response.data.data.plant);
  },

  async removeById(plantId: string): Promise<void> {
    const response = await httpClient.delete<ApiResponse<RawDeletePlantResponse>>(`/api/plants/${plantId}`);

    if (!response.data.success) {
      throw new Error(response.data.error ?? 'No se pudo eliminar la planta.');
    }
  },
};
