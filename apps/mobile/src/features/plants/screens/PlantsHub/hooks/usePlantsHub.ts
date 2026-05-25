import { useCallback, useEffect, useMemo, useState } from 'react';
import { plantService } from 'src/features/plants/services/plant.service';
import { Plant } from 'src/features/plants/types/plant.types';

export type PlantSort = 'updated' | 'name' | 'watering';

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function usePlantsHub(userId: string) {
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
    try {
      const apiPlants = await plantService.getByUser(userId);
      setPlants(apiPlants);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las plantas.');
      setPlants([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadPlants();
  }, [loadPlants]);

  const categories = useMemo(() => {
    const buckets = new Map<string, number>();
    for (const plant of plants) {
      const key = plant.categoryId || 'sin-categoria';
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    return Array.from(buckets.entries())
      .map(([id, count]) => ({ id, label: id, count }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [plants]);

  const filteredPlants = useMemo(() => {
    const normalizedQuery = normalize(query);

    let result = plants.filter(plant => {
      const byCategory = categoryFilter === 'all' || plant.categoryId === categoryFilter;
      if (!byCategory) return false;
      if (!normalizedQuery) return true;
      const haystack = [plant.name, plant.species, plant.notes, plant.categoryId]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });

    result = [...result].sort((left, right) => {
      if (sortBy === 'name') return left.name.localeCompare(right.name);
      if (sortBy === 'watering') return left.wateringFrequencyDays - right.wateringFrequencyDays;
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
