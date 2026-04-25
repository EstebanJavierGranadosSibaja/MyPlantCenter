import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plant } from 'src/features/plants/types/plant.types';
import { plantLocalService, LocalPlant } from 'src/features/plants/services/plantLocal.service';

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

function mapLocalPlantToPlant(local: LocalPlant): Plant {
  const wateringInfo = local.careInfo?.watering ?? '';
  let wateringDays = 7;
  if (wateringInfo) {
    const parsed = parseInt(wateringInfo.replace(/\D/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) {
      wateringDays = parsed;
    }
  }

  return {
    id: local.id,
    name: local.name || 'Planta detectada',
    species: local.scientificName || '',
    categoryId: '',
    wateringFrequencyDays: wateringDays,
    notes: local.careInfo
      ? `Riego: ${wateringInfo || 'N/A'} | Luz: ${local.careInfo.light || 'N/A'} | Suelo: ${local.careInfo.soil || 'N/A'}`
      : '',
    acquiredAt: local.createdAt,
    ownerId: '',
    createdAt: local.createdAt,
    updatedAt: local.createdAt,
  };
}

export function usePlantsHub() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<PlantSort>('updated');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlants = useCallback(async () => {

    let localPlants: LocalPlant[] = [];

    try {
      localPlants = await plantLocalService.getPlants();
    } catch {
      console.warn('[PlantsHub] Local plant store unavailable');
    }

    const mapped = localPlants.map(mapLocalPlantToPlant);

    if (mapped.length > 0) {
      setPlants(mapped);
      setError(null);
    } else {
      setPlants([]);
      setError('No tienes plantas aún');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadPlants();
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