import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createAddPlantStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    gap: theme.spacing.md,
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing['2xl'],
  },

  pageHeader: {
    marginHorizontal: -theme.layout.screenPaddingH,
    marginTop: -theme.spacing.lg,
  },

  card: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.thick,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    shadowColor: theme.shadows.sm.color,
    shadowOffset: theme.shadows.sm.offset,
    shadowOpacity: theme.shadows.sm.opacity,
    shadowRadius: theme.shadows.sm.radius,
    elevation: theme.shadows.sm.elevation,
  },

  categorySection: {
    gap: theme.spacing.xs,
  },

  categoryLabel: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.base,
    color: theme.colors.textSecondary,
  },

  chipsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },

  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: theme.borders.thick,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
  },

  chipSelected: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },

  chipText: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.base,
    color: theme.colors.textSecondary,
  },

  chipTextSelected: {
    color: theme.colors.textInverse,
  },

  emptyCategoriesText: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.sm,
    color: theme.colors.textMuted,
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },

  errorText: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.sm,
    color: theme.colors.error,
    flex: 1,
  },

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md + 3,
    paddingHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.sm,
  },

  saveButtonDisabled: {
    opacity: theme.opacity.disabled,
  },

  saveButtonText: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.lg,
    color: theme.colors.accentSoft,
    letterSpacing: theme.spacing['4xs'],
  },
});

export function useAddPlantTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createAddPlantStyles(theme) };
}
