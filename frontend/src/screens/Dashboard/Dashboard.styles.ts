import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';
import { AppTheme } from 'src/theme/designSystem';

export const createDashboardStyles = (theme: AppTheme) => StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: theme.colors.backgroundAlt,
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
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
  },

  greetingIcon: {
    fontSize: theme.typography.size['6xl'] * 2,
    lineHeight: theme.typography.lineHeight.loose * 2,
    textAlign: 'center' as const,
  },

  greetingTitle: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size['4xl'],
    color: theme.colors.textPrimary,
    textAlign: 'center' as const,
  },

  greetingSubtitle: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.lg,
    color: theme.colors.textMuted,
    textAlign: 'center' as const,
    lineHeight: theme.typography.lineHeight.snug,
  },
});

export function useDashboardTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createDashboardStyles(theme) };
}