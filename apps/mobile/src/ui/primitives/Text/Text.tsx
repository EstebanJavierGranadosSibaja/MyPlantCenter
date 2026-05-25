import React, { useMemo } from 'react';
import {
  StyleProp,
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native';
import { useUITheme } from '../../theme/UIThemeContext';
import type { UIColors, UITextStyles } from '../../tokens';

// ─────────────────────────────────────────────────────────────────────────────

export interface TextProps extends Omit<RNTextProps, 'style'> {
  /** One of the semantic text presets from UITextStyles. Defaults to 'body'. */
  variant?: keyof UITextStyles;
  /** Semantic color key from UIColors, or any raw color string. */
  color?: keyof UIColors | string;
  align?: TextStyle['textAlign'];
  style?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────

export const Text = React.memo(function Text({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...rest
}: TextProps) {
  const theme = useUITheme();

  // Resolve color — semantic key or raw string, fallback to textPrimary.
  const resolvedColor = useMemo(() => {
    if (!color) return theme.colors.textPrimary;
    return color in theme.colors
      ? theme.colors[color as keyof UIColors]
      : color;
  }, [color, theme.colors]);

  // Base style is memoized — only recomputes when theme, variant, or color changes.
  // `style` (caller override) is kept outside the memo and applied via array
  // so a caller using StyleSheet refs doesn't break memoization.
  const baseStyle = useMemo<TextStyle>(() => ({
    ...theme.text[variant],
    color: resolvedColor as string,
    ...(align ? { textAlign: align } : null),
  }), [theme.text, variant, resolvedColor, align]);

  return (
    <RNText style={[baseStyle, style]} {...rest}>
      {children}
    </RNText>
  );
});
