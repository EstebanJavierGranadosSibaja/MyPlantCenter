import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { PlantSort } from '../hooks/usePlantsHub';
import { usePlantsHubTheme } from '../PlantsHub.styles';

interface CategoryFilterItem {
  id: string;
  label: string;
  count: number;
}

interface PlantsFilterChipsProps {
  categories: CategoryFilterItem[];
  categoryFilter: string;
  onSelectCategory: (id: string) => void;
  sortBy: PlantSort;
  onSelectSort: (value: PlantSort) => void;
}

const SORT_ITEMS: { key: PlantSort; label: string }[] = [
  { key: 'updated', label: 'Recientes' },
  { key: 'name', label: 'A-Z' },
  { key: 'watering', label: 'Riego' },
];

export const PlantsFilterChips: React.FC<PlantsFilterChipsProps> = ({
  categories,
  categoryFilter,
  onSelectCategory,
  sortBy,
  onSelectSort,
}) => {
  const { styles } = usePlantsHubTheme();

  return (
    <View style={styles.filtersBlock}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
        <TouchableOpacity
          style={[styles.filterChip, categoryFilter === 'all' && styles.filterChipActive]}
          onPress={() => onSelectCategory('all')}
          activeOpacity={0.85}
        >
          <Text style={[styles.filterChipText, categoryFilter === 'all' && styles.filterChipTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>

        {categories.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[styles.filterChip, categoryFilter === item.id && styles.filterChipActive]}
            onPress={() => onSelectCategory(item.id)}
            activeOpacity={0.85}
          >
            <Text style={[styles.filterChipText, categoryFilter === item.id && styles.filterChipTextActive]}>
              {item.label} ({item.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sortRow}>
        {SORT_ITEMS.map(item => (
          <TouchableOpacity
            key={item.key}
            style={[styles.sortChip, sortBy === item.key && styles.sortChipActive]}
            onPress={() => onSelectSort(item.key)}
            activeOpacity={0.85}
          >
            <Text style={[styles.sortChipText, sortBy === item.key && styles.sortChipTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
