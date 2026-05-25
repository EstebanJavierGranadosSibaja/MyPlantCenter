import * as Haptics from 'expo-haptics';
import React, { useCallback, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useUITheme } from '../../theme/UIThemeContext';
import { UITheme } from '../../tokens';
import { Text } from '../Text/Text';

// ─────────────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize    = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress?: () => void | Promise<void>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Style factory — called once per theme, cached in useMemo.

interface ButtonStyles {
  container: ViewStyle;
  pressed:   ViewStyle;
  label:     { color: string; opacity?: number };
  indicator: { color: string };
}

const makeVariantStyles = (
  theme: UITheme,
  variant: ButtonVariant,
  size: ButtonSize,
): ButtonStyles => {
  const height =
    size === 'sm' ? theme.layout.buttonHeightSm :
    size === 'lg' ? theme.layout.buttonHeightLg :
    theme.layout.buttonHeightMd;

  const paddingH =
    size === 'sm' ? theme.spacing.md  :
    size === 'lg' ? theme.spacing.xl  :
    theme.spacing.lg;

  const base: ViewStyle = {
    height,
    borderRadius: theme.layout.buttonRadius,
    paddingHorizontal: paddingH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  };

  switch (variant) {
    case 'primary':
      return {
        container: { ...base, backgroundColor: theme.colors.accent },
        pressed:   { backgroundColor: theme.colors.accentPressed },
        label:     { color: theme.colors.textOnAccent },
        indicator: { color: theme.colors.textOnAccent },
      };

    case 'secondary':
      return {
        container: {
          ...base,
          backgroundColor: theme.colors.accentSoft,
          borderWidth: 1,
          borderColor: theme.colors.accentMuted,
        },
        pressed: { backgroundColor: theme.colors.accentMuted },
        label:   { color: theme.colors.accentForeground },
        indicator: { color: theme.colors.accentForeground },
      };

    case 'ghost':
      return {
        container: { ...base, backgroundColor: 'transparent' },
        pressed:   { backgroundColor: theme.colors.accentSoft },
        label:     { color: theme.colors.accentForeground },
        indicator: { color: theme.colors.accentForeground },
      };

    case 'destructive':
      return {
        container: { ...base, backgroundColor: theme.colors.errorSoft },
        pressed:   { opacity: 0.75 },
        label:     { color: theme.colors.error },
        indicator: { color: theme.colors.error },
      };
  }
};

// ─────────────────────────────────────────────────────────────────────────────

export const Button = React.memo(function Button({
  label,
  onPress,
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  disabled = false,
  leftSlot,
  rightSlot,
  fullWidth = false,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const theme = useUITheme();

  const variantStyles = useMemo(
    () => makeVariantStyles(theme, variant, size),
    [theme, variant, size],
  );

  // Native-driver scale animation — runs entirely on the UI thread.
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue:         0.97,
      useNativeDriver: true,
      damping:         18,
      stiffness:       300,
    }).start();
  }, [scale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue:         1,
      useNativeDriver: true,
      damping:         18,
      stiffness:       300,
    }).start();
  }, [scale]);

  const handlePress = useCallback(async () => {
    if (disabled || loading) return;
    Haptics.impactAsync(
      variant === 'primary'
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Light,
    ).catch(() => {});
    await onPress?.();
  }, [disabled, loading, variant, onPress]);

  const isInactive = disabled || loading;

  const containerStyle = useMemo<ViewStyle>(
    () => ({
      ...variantStyles.container,
      ...(fullWidth ? { alignSelf: 'stretch' } : { alignSelf: 'flex-start' }),
      ...(isInactive ? { opacity: 0.5 } : null),
    }),
    [variantStyles.container, fullWidth, isInactive],
  );

  const textVariant =
    size === 'sm' ? 'buttonSm' as const :
    'button' as const;

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isInactive}
        style={({ pressed }) => [
          containerStyle,
          pressed && !isInactive ? variantStyles.pressed : null,
        ]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ disabled: isInactive, busy: loading }}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variantStyles.indicator.color}
          />
        ) : (
          <>
            {leftSlot}
            <Text
              variant={textVariant}
              color={variantStyles.label.color}
              numberOfLines={1}
            >
              {label}
            </Text>
            {rightSlot}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
});
