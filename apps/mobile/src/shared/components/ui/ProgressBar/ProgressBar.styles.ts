import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createProgressBarStyles = (theme: AppTheme) => StyleSheet.create({

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
    letterSpacing: theme.typography.letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },

});

export function useProgressBarTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createProgressBarStyles(theme) };
}