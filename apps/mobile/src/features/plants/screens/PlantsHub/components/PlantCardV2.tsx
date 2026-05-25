import { Feather } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Plant } from 'src/features/plants/types/plant.types';
import { Button, Surface, Text, useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

interface PlantCardProps {
  plant: Plant;
  categoryLabel?: string;
  onEdit: (plantId: string) => void;
  onDelete: (plantId: string) => void;
}

function formatDate(value?: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─────────────────────────────────────────────────────────────────────────────

export function PlantCardV2({ plant, categoryLabel, onEdit, onDelete }: PlantCardProps) {
  const theme = useUITheme();
  const swipeRef = useRef<Swipeable>(null);
  const acquiredAt = formatDate(plant.acquiredAt);

  const handleDelete = () => {
    swipeRef.current?.close();
    onDelete(plant.id);
  };

  const renderRightActions = () => (
    <View
      style={[styles.deleteAction, { backgroundColor: theme.colors.error }]}
      accessible
      accessibilityRole="button"
      accessibilityLabel="Eliminar planta"
    >
      <Feather name="trash-2" size={theme.layout.iconMd} color="#FFFFFF" />
      <Text variant="caption" style={styles.deleteLabel}>Eliminar</Text>
    </View>
  );

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      onSwipeableOpen={() => handleDelete()}
      rightThreshold={72}
      overshootRight={false}
      friction={2}
    >
      <Surface elevation="xs" radius="lg" border="subtle" style={styles.card}>

        {/* Identity row */}
        <View style={styles.head}>
          <View style={[styles.iconBadge, { backgroundColor: theme.colors.accentSoft }]}>
            <Feather name="feather" size={theme.layout.iconMd} color={theme.colors.accent} />
          </View>
          <View style={styles.identity}>
            <Text variant="title" numberOfLines={1}>{plant.name}</Text>
            <Text variant="bodyMd" color="textSecondary" numberOfLines={1}>
              {plant.species || categoryLabel || plant.categoryId}
            </Text>
          </View>
        </View>

        {/* Meta chips */}
        <View style={styles.meta}>
          <View style={styles.metaChip}>
            <Feather name="droplet" size={theme.layout.iconSm} color={theme.colors.accent} />
            <Text variant="label" color="textSecondary">
              Cada {plant.wateringFrequencyDays} día{plant.wateringFrequencyDays === 1 ? '' : 's'}
            </Text>
          </View>

          {acquiredAt && (
            <View style={styles.metaChip}>
              <Feather name="calendar" size={theme.layout.iconSm} color={theme.colors.accent} />
              <Text variant="label" color="textSecondary">{acquiredAt}</Text>
            </View>
          )}
        </View>

        {/* Notes */}
        {plant.notes.trim().length > 0 && (
          <Text variant="bodyMd" color="textTertiary" numberOfLines={2}>
            {plant.notes}
          </Text>
        )}

        {/* Edit action */}
        <Button
          label="Editar"
          variant="primary"
          size="sm"
          onPress={() => onEdit(plant.id)}
          leftSlot={
            <Feather name="edit-2" size={theme.layout.iconSm} color={theme.colors.textOnAccent} />
          }
          fullWidth
        />

      </Surface>
    </Swipeable>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    padding: 16,
    gap: 12,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identity: {
    flex: 1,
    gap: 2,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deleteAction: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginLeft: 8,
    gap: 4,
  },
  deleteLabel: {
    color: '#FFFFFF',
    fontSize: 11,
  },
});
