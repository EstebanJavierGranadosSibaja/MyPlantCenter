import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createProfileViewStyles = (theme: AppTheme) => StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  centered: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },

  errorText: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.lg,
    color: theme.colors.error,
    textAlign: 'center',
  },

  loadingText: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.lg,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.md,
  },

  loadingContainer: {
    flex: 1,
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.lg,
  },

  loadingAvatar: {
    width: theme.layout.avatarLg,
    height: theme.layout.avatarLg,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingSkeletonName: {
    height: theme.typography.lineHeight.relaxed,
    width: '60%' as const,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.backgroundAlt,
  },

  loadingSkeletonNickname: {
    height: theme.typography.lineHeight.snug,
    width: '40%' as const,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.backgroundAlt,
  },

  loadingSkeletonDescription: {
    height: theme.typography.lineHeight.snug,
    width: '80%' as const,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.backgroundAlt,
  },

  loadingStatsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  loadingStatCard: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.thick,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
  },

  loadingStatValue: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size['4xl'],
    color: theme.colors.textPrimary,
  },

  loadingStatLabel: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textMuted,
    letterSpacing: 1.4,
    textTransform: 'uppercase' as const,
  },

  xpSection: {
    gap: theme.spacing.sm,
  },

  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  xpLabel: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textMuted,
    letterSpacing: 1.4,
    textTransform: 'uppercase' as const,
  },

  xpValue: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.base,
    color: theme.colors.accent,
  },

  // Botón seguir 
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 2,
    borderWidth: theme.borders.base,
  },

  followButtonActive: {
    backgroundColor: theme.colors.cardBg,
    borderColor: theme.colors.border,
  },

  followButtonInactive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },

  followButtonText: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.sm,
  },

  followButtonTextActive: {
    color: theme.colors.textMuted,
  },

  followButtonTextInactive: {
    color: theme.colors.textInverse,
  },

});

export function useProfileViewTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createProfileViewStyles(theme) };
}