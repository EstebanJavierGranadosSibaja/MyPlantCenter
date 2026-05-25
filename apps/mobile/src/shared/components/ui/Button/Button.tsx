import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, Text, ViewStyle } from 'react-native';
import { useButtonTheme } from './Button.styles';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconName?: React.ComponentProps<typeof Feather>['name'];
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

const SIZE_STYLE = { sm: 'sizeSm', md: 'sizeMd', lg: 'sizeLg' } as const;
const LABEL_SIZE = { sm: 'labelSm', md: 'labelMd', lg: 'labelLg' } as const;
const LABEL_VARIANT = {
  primary:     'labelPrimary',
  secondary:   'labelSecondary',
  ghost:       'labelGhost',
  destructive: 'labelDestructive',
} as const;
const PRESSED_VARIANT = {
  primary:     'primaryPressed',
  secondary:   'secondaryPressed',
  ghost:       'ghostPressed',
  destructive: 'destructivePressed',
} as const;

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  iconName,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}) => {
  const { theme, styles } = useButtonTheme();

  const iconSize =
    size === 'sm' ? theme.typography.size.sm :
    size === 'lg' ? theme.typography.size.xl :
    theme.typography.size.base;

  const iconColor =
    variant === 'secondary' ? theme.colors.accent :
    variant === 'ghost'     ? theme.colors.textSecondary :
    theme.colors.textInverse;

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        styles[SIZE_STYLE[size]],
        styles[variant],
        pressed && !isDisabled && styles[PRESSED_VARIANT[variant]],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <>
          {iconName && iconPosition === 'left' && (
            <Feather name={iconName} size={iconSize} color={iconColor} />
          )}
          <Text style={[styles.labelBase, styles[LABEL_SIZE[size]], styles[LABEL_VARIANT[variant]]]}>
            {label}
          </Text>
          {iconName && iconPosition === 'right' && (
            <Feather name={iconName} size={iconSize} color={iconColor} />
          )}
        </>
      )}
    </Pressable>
  );
};
