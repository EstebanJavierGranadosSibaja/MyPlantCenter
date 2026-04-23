import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { useTabAjustesTheme } from '../TabAjustes.styles';

interface AccountActionItemProps {
  label: string;
  iconName: React.ComponentProps<typeof Feather>['name'];
  color: string;
  onPress: () => void;
}

export const AccountActionItem: React.FC<AccountActionItemProps> = ({
  label,
  iconName,
  color,
  onPress,
}) => {
  const { theme, styles } = useTabAjustesTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionButton,
        { marginBottom: theme.spacing.sm },
        pressed && styles.actionButtonPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Feather name={iconName} size={theme.typography.size.lg} color={color} />
      <Text style={[styles.actionLabel, { color }]}>{label}</Text>
      <Feather name="chevron-right" size={theme.typography.size.lg} color={theme.colors.textMuted} />
    </Pressable>
  );
};
