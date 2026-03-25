import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';
import { AppTheme } from 'src/theme/designSystem';

export const createEmptyStateStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      minHeight: theme.layout.avatarLg + theme.layout.avatarSm + theme.spacing['2xl'],
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.layout.screenPaddingH,
      paddingVertical: theme.spacing.xl,
    },
    iconCircle: {
      width: theme.layout.avatarLg - theme.spacing.sm,
      height: theme.layout.avatarLg - theme.spacing.sm,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.backgroundAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      width: '100%',
      alignItems: 'center',
      marginTop: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    title: {
      fontFamily: theme.typography.family.displayBold,
      fontSize: theme.typography.size['2xl'],
      lineHeight: theme.typography.lineHeight.snug,
      color: theme.colors.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      fontFamily: theme.typography.family.bodyRegular,
      fontSize: theme.typography.size.md,
      lineHeight: theme.typography.lineHeight.snug,
      color: theme.colors.textMuted,
      textAlign: 'center',
      maxWidth: '92%',
    },
    actionButton: {
      marginTop: theme.spacing.xl,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.md + 3,
      paddingHorizontal: theme.spacing.xl,
      borderWidth: theme.borders.thick,
      borderColor: theme.colors.primary,
    },
    actionLabel: {
      fontFamily: theme.typography.family.bodySemiBold,
      fontSize: theme.typography.size.lg,
      lineHeight: theme.typography.lineHeight.snug,
      color: theme.colors.accentSoft,
      letterSpacing: 0.4,
    },
  });

export function useEmptyStateTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createEmptyStateStyles(theme) };
}
