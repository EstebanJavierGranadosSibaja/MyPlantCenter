import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';

export const createFriendsHomeStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.md,
  },

  card: {
    backgroundColor: theme.colors.cardBg,
    borderColor: theme.colors.cardBorder,
    borderWidth: theme.borders.thin,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    shadowColor: theme.shadows.md.color,
    shadowOffset: theme.shadows.md.offset,
    shadowOpacity: theme.shadows.md.opacity,
    shadowRadius: theme.shadows.md.radius,
    elevation: theme.shadows.md.elevation,
  },

  sectionTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xl,
  },

  sectionSubtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.base,
  },

  codeText: {
    color: theme.colors.accent,
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size['3xl'],
    letterSpacing: theme.spacing['2xs'],
  },

  codeHint: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.sm,
  },

  summaryRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  navRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  navButton: {
    flex: 1,
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },

  navButtonPressed: {
    backgroundColor: theme.colors.elevated,
  },

  navButtonPrimary: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },

  navButtonPrimaryPressed: {
    backgroundColor: '#33B07A',
    borderColor: '#33B07A',
  },

  navButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.sm,
  },

  navButtonTextPrimary: {
    color: theme.colors.textInverse,
  },

  summaryPill: {
    flex: 1,
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.elevated,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    gap: theme.spacing['3xs'],
    shadowColor: theme.shadows.sm.color,
    shadowOffset: theme.shadows.sm.offset,
    shadowOpacity: theme.shadows.sm.opacity,
    shadowRadius: theme.shadows.sm.radius,
    elevation: theme.shadows.sm.elevation,
  },

  summaryValue: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size['2xl'],
  },

  summaryLabel: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.family.bodyMedium,
    fontSize: theme.typography.size.sm,
  },

  requestRow: {
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.elevated,
    padding: theme.spacing.md,
    gap: theme.spacing['2xs'],
  },

  requestTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.lg,
  },

  requestMeta: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.sm,
  },

  requestAction: {
    alignSelf: 'flex-start',
    borderRadius: theme.radius.sm,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginTop: theme.spacing['2xs'],
  },

  requestActionPressed: {
    backgroundColor: theme.colors.elevated,
  },

  requestActionText: {
    color: theme.colors.accent,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.sm,
  },
});

export function useFriendsHomeTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createFriendsHomeStyles(theme) };
}
