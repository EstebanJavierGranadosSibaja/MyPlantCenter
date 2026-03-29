import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';

export const createProgressBarStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({

  track: {
    width: '100%' as any,
    overflow: 'hidden',
  },

  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },

  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs + 2,
  },

  labelText: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textMuted,
    letterSpacing: theme.spacing['3xs'],
    textTransform: 'uppercase' as const,
  },

});

export function useProgressBarTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createProgressBarStyles(theme) };
}