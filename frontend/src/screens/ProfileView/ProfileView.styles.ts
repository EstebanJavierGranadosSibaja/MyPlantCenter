import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';
import { AppTheme } from 'src/theme/designSystem';

export const createProfileViewStyles = (theme: AppTheme) => StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  statsCard: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.layout.statsCardOverlap,
    zIndex: 2,
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