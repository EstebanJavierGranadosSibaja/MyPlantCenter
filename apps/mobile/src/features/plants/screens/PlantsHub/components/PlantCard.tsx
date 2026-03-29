import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Plant } from 'src/features/plants/types/plant.types';
import { usePlantsHubTheme } from '../PlantsHub.styles';

interface PlantCardProps {
  plant: Plant;
  categoryLabel?: string;
  onEdit: (plantId: string) => void;
  onDelete: (plantId: string) => void;
}

function formatDate(value?: string): string | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toLocaleDateString('es-CR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  categoryLabel,
  onEdit,
  onDelete,
}) => {
  const { theme, styles } = usePlantsHubTheme();
  const acquiredAt = formatDate(plant.acquiredAt);

  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <View style={styles.cardIconWrap}>
          <Feather name="feather" size={theme.typography.size['2xl']} color={theme.colors.accent} />
        </View>

        <View style={styles.cardIdentity}>
          <Text style={styles.cardTitle}>{plant.name}</Text>
          <Text style={styles.cardSubtitle}>{plant.species || categoryLabel || plant.categoryId}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaPill}>
          <Feather name="droplet" size={theme.typography.size.base} color={theme.colors.accent} />
          <Text style={styles.metaText}>Riego cada {plant.wateringFrequencyDays} día{plant.wateringFrequencyDays === 1 ? '' : 's'}</Text>
        </View>

        {acquiredAt && (
          <View style={styles.metaPill}>
            <Feather name="calendar" size={theme.typography.size.base} color={theme.colors.accent} />
            <Text style={styles.metaText}>{acquiredAt}</Text>
          </View>
        )}
      </View>

      {plant.notes.trim().length > 0 && (
        <Text style={styles.cardNotes}>{plant.notes}</Text>
      )}

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.cardActionButton, styles.cardActionPrimary]}
          onPress={() => onEdit(plant.id)}
          activeOpacity={0.85}
        >
          <Feather name="edit-2" size={theme.typography.size.base} color={theme.colors.textInverse} />
          <Text style={styles.cardActionPrimaryText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardActionButton}
          onPress={() => onDelete(plant.id)}
          activeOpacity={0.85}
        >
          <Feather name="trash-2" size={theme.typography.size.base} color={theme.colors.textPrimary} />
          <Text style={styles.cardActionText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
