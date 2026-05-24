import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createDashboardStyles = (theme: AppTheme) => StyleSheet.create({

  root: {
    backgroundColor: theme.colors.background,
  },

  content: {
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing['4xl'],
    gap: theme.spacing.md,
  },

  heroCard: {
    backgroundColor: theme.colors.cardBg,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.cardBorder,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    shadowColor: theme.shadows.sm.color,
    shadowOffset: theme.shadows.sm.offset,
    shadowOpacity: theme.shadows.sm.opacity,
    shadowRadius: theme.shadows.sm.radius,
    elevation: theme.shadows.sm.elevation,
    gap: theme.spacing.sm,
  },

  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  greetingIconWrap: {
    width: theme.layout.avatarSm,
    height: theme.layout.avatarSm,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.favPlantIconBg,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.cardBorder,
  },

  greetingCopy: {
    flex: 1,
    gap: theme.spacing['3xs'],
  },

  greetingEyebrow: {
    fontFamily: theme.typography.family.bodyMedium,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: theme.spacing['3xs'],
  },

  greetingTitle: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size.xl,
    color: theme.colors.textPrimary,
    lineHeight: theme.typography.lineHeight.snug,
  },

  greetingSubtitle: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.snug,
  },

  metricsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  metricCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },

  metricLabel: {
    fontFamily: theme.typography.family.bodyMedium,
    fontSize: theme.typography.size.xs,
    lineHeight: theme.typography.lineHeight.tight,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: theme.spacing['3xs'],
  },

  metricValue: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.lg,
    lineHeight: theme.typography.lineHeight.snug,
    color: theme.colors.textPrimary,
  },

  summaryCard: {
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radius.lg,
    borderColor: theme.colors.cardBorder,
    borderWidth: theme.borders.thin,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },

  summaryTitle: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.base,
    lineHeight: theme.typography.lineHeight.snug,
    color: theme.colors.textPrimary,
  },

  summaryText: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.sm,
    lineHeight: theme.typography.lineHeight.snug,
    color: theme.colors.textSecondary,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderColor: theme.colors.primary,
    borderWidth: theme.borders.base,
    gap: theme.spacing.xs,
  },

  actionButtonPressed: {
    opacity: 0.88,
  },

  actionButtonText: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.sm,
    lineHeight: theme.typography.lineHeight.snug,
    color: theme.colors.textInverse,
  },

  careCard: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.lg,
    borderColor: theme.colors.cardBorder,
    borderWidth: theme.borders.thin,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },

  careHeader: {
    gap: theme.spacing['4xs'],
  },

  careTitle: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.base,
    lineHeight: theme.typography.lineHeight.snug,
    color: theme.colors.textPrimary,
  },

  careMeta: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
  },

  careRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  carePill: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing['4xs'],
  },

  careValue: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.lg,
    color: theme.colors.textPrimary,
  },

  careLabel: {
    fontFamily: theme.typography.family.bodyMedium,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: theme.spacing['4xs'],
  },

  careButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius.full,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.secondary,
  },

  careButtonPressed: {
    opacity: 0.88,
  },

  careButtonText: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.sm,
    color: theme.colors.textInverse,
  },
});

export function useDashboardTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createDashboardStyles(theme) };
}
