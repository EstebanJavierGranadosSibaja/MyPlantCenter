import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FeatherIconName } from 'src/features/profile/types/user.types';
import { useEmptyStateTheme } from './EmptyState.styles';

interface EmptyStateProps {
  iconName: FeatherIconName;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconName,
  title,
  subtitle,
  actionLabel,
  onAction,
}) => {
  const { theme, styles } = useEmptyStateTheme();

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Feather
          name={iconName}
          size={theme.spacing['3xl']}
          color={theme.colors.textMuted}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        {!!actionLabel && !!onAction && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onAction}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
          >
            <Text style={styles.actionLabel}>{actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
