import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';

export const createFriendsHomeStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.backgroundAlt,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.md,
  },

  card: {
    backgroundColor: theme.colors.cardBg,
    borderColor: theme.colors.cardBorder,
    borderWidth: theme.borders.thin,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },

  sectionTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size['2xl'],
  },

  sectionSubtitle: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.lg,
  },

  codeText: {
    color: theme.colors.accent,
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size['4xl'],
    letterSpacing: theme.spacing['2xs'],
  },

  codeHint: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.base,
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
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
  },

  navButtonPrimary: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },

  navButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.base,
  },

  navButtonTextPrimary: {
    color: theme.colors.textInverse,
  },

  summaryPill: {
    flex: 1,
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    gap: theme.spacing['3xs'],
  },

  summaryValue: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size['3xl'],
  },

  summaryLabel: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.family.bodyMedium,
    fontSize: theme.typography.size.base,
  },

  requestRow: {
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.heroInputBgSubtle,
    padding: theme.spacing.sm,
    gap: theme.spacing['2xs'],
  },

  requestTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xl,
  },

  requestMeta: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.base,
  },

  requestAction: {
    alignSelf: 'flex-start',
    borderRadius: theme.radius.sm,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing['2xs'],
    marginTop: theme.spacing['2xs'],
  },

  requestActionText: {
    color: theme.colors.accent,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.base,
  },
});

export function useFriendsHomeTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createFriendsHomeStyles(theme) };
}
