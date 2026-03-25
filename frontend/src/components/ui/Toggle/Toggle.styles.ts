import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';

export const createToggleStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  textGroup: {
    flex: 1,
    marginRight: theme.spacing.md,
  },

  label: {
    fontFamily: theme.typography.family.bodyMedium,
    fontSize: theme.typography.size.lg,
    color: theme.colors.textPrimary,
    fontWeight: '500' as const,
  },

  description: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.base,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs - 2,
  },

  track: {
    width: theme.layout.toggleTrackW,
    height: theme.layout.toggleTrackH,
    borderRadius: theme.layout.toggleTrackH / 2,
    justifyContent: 'center',
    flexShrink: 0,
  },

  thumb: {
    position: 'absolute',
    width: theme.layout.toggleThumbSz,
    height: theme.layout.toggleThumbSz,
    borderRadius: theme.layout.toggleThumbSz / 2,
    shadowColor: theme.shadows.sm.color,
    shadowOffset: theme.shadows.sm.offset,
    shadowOpacity: theme.shadows.sm.opacity,
    shadowRadius: theme.shadows.sm.radius,
    elevation: theme.shadows.sm.elevation,
  },

  disabled: {
    opacity: theme.opacity.disabled,
  },

});

export function useToggleTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createToggleStyles(theme) };
}