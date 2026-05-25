import React, { useMemo } from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { useUITheme } from '../../theme/UIThemeContext';
import type { UIColors, UIRadius, UIShadows } from '../../tokens';

// ─────────────────────────────────────────────────────────────────────────────

type ElevationKey = keyof UIShadows;
type RadiusKey    = keyof UIRadius;
type BgKey        = keyof Pick<UIColors,
  | 'bg'
  | 'bgSubtle'
  | 'surface'
  | 'surfaceElevated'
  | 'surfaceOverlay'
>;

export interface SurfaceProps extends Omit<ViewProps, 'style'> {
  /** Shadow level. Elevation is communicated by contrast + subtle shadow. */
  elevation?: ElevationKey;
  /** Border radius — semantic key or raw number. */
  radius?: RadiusKey | number;
  /** Background semantic key. Defaults to 'surface'. */
  bg?: BgKey;
  /** Optional border (defaults to none). Pass 'default' for borderDefault color. */
  border?: 'subtle' | 'default' | 'strong' | 'none';
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────

export const Surface = React.memo(function Surface({
  elevation = 'none',
  radius,
  bg = 'surface',
  border = 'none',
  style,
  children,
  ...rest
}: SurfaceProps) {
  const { colors, shadows, radius: radiusScale } = useUITheme();

  const surfaceStyle = useMemo<ViewStyle>(() => {
    const shadow = shadows[elevation];

    const resolvedRadius: number | undefined =
      radius === undefined
        ? undefined
        : typeof radius === 'number'
          ? radius
          : radiusScale[radius];

    const borderStyle: ViewStyle =
      border === 'none'
        ? {}
        : {
            borderWidth: StyleSheet.hairlineWidth,
            borderColor:
              border === 'subtle'  ? colors.borderSubtle  :
              border === 'strong'  ? colors.borderStrong  :
              colors.borderDefault,
          };

    return {
      backgroundColor: colors[bg],
      ...(resolvedRadius !== undefined ? { borderRadius: resolvedRadius } : null),
      ...borderStyle,
      // iOS shadow — only visible when backgroundColor is opaque
      shadowColor:   shadow.shadowColor,
      shadowOffset:  shadow.shadowOffset,
      shadowOpacity: shadow.shadowOpacity,
      shadowRadius:  shadow.shadowRadius,
      // Android elevation
      elevation:     shadow.elevation,
    };
  }, [colors, shadows, radiusScale, elevation, radius, bg, border]);

  return (
    <View style={[surfaceStyle, style]} {...rest}>
      {children}
    </View>
  );
});
