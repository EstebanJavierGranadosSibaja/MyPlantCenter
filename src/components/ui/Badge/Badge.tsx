import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { useBadgeTheme } from './Badge.styles';


// Props 
interface BadgeProps {
  label: string;
  iconName?: React.ComponentProps<typeof Feather>['name'];
  color?: string;
  size?: 'sm' | 'md';
}

// Componente 
export const Badge: React.FC<BadgeProps> = ({
  label,
  iconName,
  color,
  size = 'md',
}) => {
  const { theme, styles } = useBadgeTheme();

  const badgeColor = color ?? theme.colors.accent;
  const isSmall = size === 'sm';

  const fontSize = isSmall
    ? theme.typography.size.xs
    : theme.typography.size.sm;

  const paddingH = isSmall
    ? theme.spacing.sm
    : theme.spacing.md;

  const paddingV = isSmall
    ? theme.spacing.xs - 2
    : theme.spacing.xs;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: badgeColor + '18',
          borderColor: badgeColor + '44',
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
          gap: theme.spacing.xs,
        },
      ]}
    >
      {iconName && (
        <Feather name={iconName} size={fontSize} color={badgeColor} />
      )}

      <Text
        style={[
          styles.label,
          {
            fontSize,
            color: badgeColor,
          },
        ]}
      >
        {label}
      </Text>

    </View>
  );
};