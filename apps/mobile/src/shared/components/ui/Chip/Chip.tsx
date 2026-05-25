import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { useChipTheme } from './Chip.styles';

interface ChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  iconName?: React.ComponentProps<typeof Feather>['name'];
  disabled?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  active = false,
  onPress,
  iconName,
  disabled = false,
}) => {
  const { theme, styles } = useChipTheme();

  const iconColor = active ? theme.colors.textPrimary : theme.colors.textSecondary;
  const iconSize = theme.typography.size.sm;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      accessibilityRole={onPress ? 'button' : 'none'}
      accessibilityLabel={label}
      accessibilityState={{ selected: active, disabled }}
      style={({ pressed }) => [
        styles.base,
        active ? styles.active : styles.idle,
        pressed && !disabled && (active ? styles.activePressed : styles.idlePressed),
        disabled && styles.disabled,
      ]}
    >
      {iconName && (
        <Feather name={iconName} size={iconSize} color={iconColor} />
      )}
      <Text style={[styles.labelBase, active ? styles.labelActive : styles.labelIdle]}>
        {label}
      </Text>
    </Pressable>
  );
};
