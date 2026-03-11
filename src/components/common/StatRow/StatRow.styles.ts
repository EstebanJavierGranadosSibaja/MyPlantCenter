import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';

export const createStatRowStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({

  row: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: theme.spacing.lg,
    elevation: 4,
  },

  pill: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  divider: {
    width: 1,
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