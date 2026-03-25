import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';

export const createStatRowStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({

  row: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
    borderWidth: theme.borders.thick,
    borderColor: theme.colors.border,
    shadowColor: theme.shadows.lg.color,
    shadowOffset: theme.shadows.lg.offset,
    shadowOpacity: theme.shadows.lg.opacity,
    shadowRadius: theme.shadows.lg.radius,
    elevation: theme.shadows.lg.elevation,
  },

  pill: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  divider: {
    width: theme.borders.base,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },

  icon: {
    fontSize: theme.typography.size['3xl'],
    color: theme.colors.accent,
  },

  value: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size['4xl'],
    color: theme.colors.textPrimary,
    lineHeight: theme.typography.lineHeight.normal,
  },

  label: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textMuted,
    letterSpacing: theme.spacing['3xs'],
    textTransform: 'uppercase' as const,
  },

});

export function useStatRowTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createStatRowStyles(theme) };
}