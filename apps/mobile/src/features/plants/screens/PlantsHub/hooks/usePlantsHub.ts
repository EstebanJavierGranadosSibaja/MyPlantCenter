import { useCallback, useEffect, useMemo, useState } from 'react';
import { plantService } from 'src/features/plants/services/plant.service';
import { Plant } from 'src/features/plants/types/plant.types';
import { detectionHistoryService, DetectionRecord } from 'src/features/camera/services/detectionHistory.service';

export type PlantSort = 'updated' | 'name' | 'watering';

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function toCategoryLabel(rawId: string): string {
  const normalized = rawId.trim();
  if (!normalized) {
    return 'Sin categoria';
  }

  if (normalized.toLowerCase() === 'general') {
    return 'General';
  }

  if (normalized.startsWith('cat_')) {
    return 'Categoria';
  }

  return normalized
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, match => match.toUpperCase());
}

function mapDetectionToPlant(record: DetectionRecord, userId: string): Plant {
  const wateringInfo = record.careInfo?.watering ?? '';
  let wateringDays = 7;
  if (wateringInfo) {
    const parsed = parseInt(wateringInfo.replace(/\D/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) {
      wateringDays = parsed;
    }
  }

  return {
    id: record.id,
    name: record.plantName || 'Planta detectada',
    species: record.scientificName || '',
    categoryId: '',
    wateringFrequencyDays: wateringDays,
    notes: record.careInfo
      ? `Riego: ${wateringInfo || 'N/A'} | Luz: ${record.careInfo.light || 'N/A'} | Suelo: ${record.careInfo.soil || 'N/A'}`
      : '',
    acquiredAt: record.timestamp,
    ownerId: userId,
    createdAt: record.timestamp,
    updatedAt: record.timestamp,
  };
}

function mergePlants(remotePlants: Plant[], localDetections: DetectionRecord[], userId: string): Plant[] {
  const plantsMap = new Map<string, Plant>();

  for (const remote of remotePlants) {
    plantsMap.set(remote.id, remote);
  }

  const localAddedUris = new Set<string>();
  for (const [, plant] of plantsMap) {
    if (plant.notes) {
      localAddedUris.add(plant.notes);
    }
  }

  for (const local of localDetections) {
    const isPending = local.status === 'pending';
    const isSyncedFailed = local.status === 'synced' || local.status === 'failed';

    if (isSyncedFailed) {
      if (localAddedUris.has(local.imageUri)) {
        continue;
      }
    }

    const mapped = mapDetectionToPlant(local, userId);

    if (!isPending && local.imageUri) {
      localAddedUris.add(local.imageUri);
    }

    const key = `local-${local.id}`;
    plantsMap.set(key, mapped);
  }

  return Array.from(plantsMap.values()).sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return dateB - dateA;
  });
}

export function usePlantsHub(userId?: string) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<PlantSort>('updated');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlants = useCallback(async () => {
    if (!userId) {
      setPlants([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let remotePlants: Plant[] = [];
    let localDetections: DetectionRecord[] = [];

    try {
      remotePlants = await plantService.getByUser(userId);
    } catch {
      console.warn('[PlantsHub] Backend unavailable, using local data only');
    }

    try {
      localDetections = await detectionHistoryService.getAll();
    } catch {
      console.warn('[PlantsHub] Local detection history unavailable');
    }

    const merged = mergePlants(remotePlants, localDetections, userId);

    if (merged.length > 0) {
      setPlants(merged);
      setError(null);
    } else {
      setPlants([]);
      setError('No tienes plantas aún');
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadPlants();
  }, [loadPlants]);

  const categories = useMemo(() => {
    const buckets = new Map<string, number>();
    for (const plant of plants) {
      const key = plant.categoryId || 'Sin categoría';
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }

    return Array.from(buckets.entries())
      .map(([id, count]) => ({ id, label: toCategoryLabel(id), count }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [plants]);

  const filteredPlants = useMemo(() => {
    const normalizedQuery = normalize(query);

    let result = plants.filter(plant => {
      const byCategory = categoryFilter === 'all' || plant.categoryId === categoryFilter;
      if (!byCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        plant.name,
        plant.species,
        plant.notes,
        plant.categoryId,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });

    result = [...result].sort((left, right) => {
      if (sortBy === 'name') {
        return left.name.localeCompare(right.name);
      }

      if (sortBy === 'watering') {
        return left.wateringFrequencyDays - right.wateringFrequencyDays;
      }

      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    });

    return result;
  }, [plants, query, categoryFilter, sortBy]);

  return {
    loading,
    error,
    query,
    setQuery,
    plants,
    filteredPlants,
    categories,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    reload: loadPlants,
  };
}
