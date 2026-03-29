import type { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type FeatherIconName = ComponentProps<typeof Feather>['name'];

export interface Plant {
  id: string;
  name: string;
  species: string;
  categoryId: string;
  wateringFrequencyDays: number;
  notes: string;
  acquiredAt?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditPlantDTO {
  name: string;
  species?: string;
  categoryId: string;
  wateringFrequencyDays: number;
  notes?: string;
  acquiredAt?: string;
}

export interface ApiPlantResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}
