import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';
import { AppTheme } from 'src/theme/designSystem';

export const createDashboardStyles = (theme: AppTheme) => StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Header 
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.heroBg,
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingBottom: theme.spacing.lg,
  },

  // Saludo 
  greetingSection: {
    flex: 1,
    paddingTop: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.lg,
  },

  greetingIcon: {
    fontSize: theme.typography.size['6xl'] * 2,
    lineHeight: theme.typography.lineHeight.loose * 2,
    textAlign: 'center' as const,
  },

  greetingTitle: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size['5xl'],
    color: theme.colors.textPrimary,
    textAlign: 'center' as const,
  },

  greetingSubtitle: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.lg,
    color: theme.colors.textMuted,
    textAlign: 'center' as const,
  },

  // Avatar clickeable
  avatarButton: {
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
  },

  avatarBadge: {
    position: 'absolute',
    bottom: theme.layout.avatarBadgeOffset,
    right: theme.layout.avatarBadgeOffset,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.full,
    width: theme.spacing.lg,
    height: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: theme.spacing["2xs"],
    borderColor: theme.colors.heroBg,
  },

});

export function useDashboardTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createDashboardStyles(theme) };
}