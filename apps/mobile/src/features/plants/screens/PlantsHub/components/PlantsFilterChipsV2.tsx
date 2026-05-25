import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { PlantSort } from '../hooks/usePlantsHub';
import { Text, useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

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
  { key: 'name',    label: 'A-Z' },
  { key: 'watering', label: 'Riego' },
];

// ─────────────────────────────────────────────────────────────────────────────
// FilterChip — local pressable pill; extracted to src/ui/patterns when needed by other screens.

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const theme = useUITheme();
  return (
    <Pressable
      style={[
        styles.chip,
        active
          ? { backgroundColor: theme.colors.accentSoft,  borderColor: theme.colors.accentMuted }
          : { backgroundColor: theme.colors.surface,     borderColor: theme.colors.borderDefault },
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text variant="label" color={active ? 'accentForeground' : 'textSecondary'}>
        {label}
      </Text>
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function PlantsFilterChipsV2({
  categories,
  categoryFilter,
  onSelectCategory,
  sortBy,
  onSelectSort,
}: PlantsFilterChipsProps) {
  return (
    <View style={styles.root}>
      {/* Category filter — horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollRow}
      >
        <FilterChip
          label="Todas"
          active={categoryFilter === 'all'}
          onPress={() => onSelectCategory('all')}
        />
        {categories.map(item => (
          <FilterChip
            key={item.id}
            label={`${item.label} (${item.count})`}
            active={categoryFilter === item.id}
            onPress={() => onSelectCategory(item.id)}
          />
        ))}
      </ScrollView>

      {/* Sort options — fixed row */}
      <View style={styles.sortRow}>
        {SORT_ITEMS.map(item => (
          <FilterChip
            key={item.key}
            label={item.label}
            active={sortBy === item.key}
            onPress={() => onSelectSort(item.key)}
          />
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    gap: 8,
  },
  scrollRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sortRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
