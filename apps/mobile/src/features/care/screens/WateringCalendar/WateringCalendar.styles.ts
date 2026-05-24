import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createWateringCalendarStyles = (theme: AppTheme) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing['6xl'],
    gap: theme.spacing.lg,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },

  sectionTitle: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size.xl,
    color: theme.colors.textPrimary,
  },

  sectionMeta: {
    fontFamily: theme.typography.family.bodyMedium,
    fontSize: theme.typography.size.sm,
    color: theme.colors.textMuted,
  },

  card: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.lg,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    shadowColor: theme.shadows.sm.color,
    shadowOffset: theme.shadows.sm.offset,
    shadowOpacity: theme.shadows.sm.opacity,
    shadowRadius: theme.shadows.sm.radius,
    elevation: theme.shadows.sm.elevation,
  },

  summaryRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  summaryPill: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing['3xs'],
  },

  summaryValue: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.lg,
    color: theme.colors.textPrimary,
  },

  summaryLabel: {
    fontFamily: theme.typography.family.bodyMedium,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: theme.spacing['3xs'],
  },

  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  streakLabel: {
    fontFamily: theme.typography.family.bodyMedium,
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
  },

  streakValue: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size['2xl'],
    color: theme.colors.textPrimary,
  },

  priorityList: {
    gap: theme.spacing.sm,
  },

  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  priorityInfo: {
    flex: 1,
    gap: theme.spacing['4xs'],
  },

  priorityName: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.lg,
    color: theme.colors.textPrimary,
  },

  priorityMeta: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
  },

  priorityActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  actionButton: {
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing['2xs'],
    paddingHorizontal: theme.spacing.sm,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.primary,
  },

  actionButtonPressed: {
    opacity: 0.9,
  },

  actionButtonText: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textInverse,
  },

  dayBlock: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },

  dayTitle: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.base,
    color: theme.colors.textPrimary,
    textTransform: 'uppercase' as const,
    letterSpacing: theme.spacing['3xs'],
  },

  dayTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },

  dayTaskInfo: {
    flex: 1,
    gap: theme.spacing['4xs'],
  },

  dayTaskName: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.md,
    color: theme.colors.textPrimary,
  },

  dayTaskMeta: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
  },

  emptyStateWrap: {
    paddingVertical: theme.spacing.xl,
  },
});

export function useWateringCalendarTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createWateringCalendarStyles(theme) };
}
