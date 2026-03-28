import httpClient from 'src/services/http/client';
import { ApiResponse } from 'src/types-dtos/user.types';
import { EditPlantDTO, Plant } from 'src/types-dtos/plant.types';

interface RawPlant {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  scientificName?: string;
  careFrequencyPerWeek?: number;
  description?: string;
  acquiredAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface RawPlantDetailResponse {
  plant: RawPlant;
}

function careFrequencyPerWeekToDays(value?: number): number {
  if (!value || value <= 0) {
    return 7;
  }

  return Math.max(1, Math.round(7 / value));
}

function wateringFrequencyDaysToPerWeek(value: number): number {
  const safeDays = Math.max(1, value);
  return Math.max(1, Math.round(7 / safeDays));
}

function mapPlantFromApi(raw: RawPlant): Plant {
  return {
    id: raw.id,
    name: raw.name,
    species: raw.scientificName ?? '',
    categoryId: raw.categoryId,
    wateringFrequencyDays: careFrequencyPerWeekToDays(raw.careFrequencyPerWeek),
    notes: raw.description ?? '',
    acquiredAt: raw.acquiredAt,
    ownerId: raw.userId,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

function mapEditPlantToApi(dto: EditPlantDTO): Record<string, unknown> {
  return {
    name: dto.name,
    scientificName: dto.species ?? '',
    categoryId: dto.categoryId,
    careFrequencyPerWeek: wateringFrequencyDaysToPerWeek(dto.wateringFrequencyDays),
    description: dto.notes ?? '',
    acquiredAt: dto.acquiredAt,
  };
}

export const plantService = {
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
};
