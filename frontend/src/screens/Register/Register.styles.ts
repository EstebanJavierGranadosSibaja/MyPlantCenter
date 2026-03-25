import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';

export const createRegisterStyles = (theme: ReturnType<typeof useAppThemeContext>) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.colors.backgroundAlt,
      justifyContent: 'center',
      paddingHorizontal: theme.layout.screenPaddingH,
      gap: theme.spacing.lg,
    },
    title: {
      fontFamily: theme.typography.family.displayBold,
      fontSize: theme.typography.size['5xl'],
      color: theme.colors.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      fontFamily: theme.typography.family.bodyRegular,
      fontSize: theme.typography.size.lg,
      color: theme.colors.textMuted,
      textAlign: 'center',
      marginBottom: theme.spacing.md,
      lineHeight: theme.typography.lineHeight.snug,
    },
    input: {
      borderWidth: theme.borders.thick,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      fontFamily: theme.typography.family.bodyRegular,
      fontSize: theme.typography.size.md,
      color: theme.colors.textPrimary,
      shadowColor: theme.shadows.sm.color,
      shadowOffset: theme.shadows.sm.offset,
      shadowOpacity: theme.shadows.sm.opacity,
      shadowRadius: theme.shadows.sm.radius,
      elevation: theme.shadows.sm.elevation,
    },
    errorText: {
      color: theme.colors.error,
      fontFamily: theme.typography.family.bodyMedium,
      fontSize: theme.typography.size.sm,
      textAlign: 'center',
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.sm,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      shadowColor: theme.shadows.md.color,
      shadowOffset: theme.shadows.md.offset,
      shadowOpacity: theme.shadows.md.opacity,
      shadowRadius: theme.shadows.md.radius,
      elevation: theme.shadows.md.elevation,
    },
    buttonText: {
      fontFamily: theme.typography.family.bodySemiBold,
      fontSize: theme.typography.size.md,
      color: theme.colors.textInverse,
    },
    secondaryButton: {
      paddingVertical: theme.spacing.sm,
      alignItems: 'center',
    },
    secondaryText: {
      fontFamily: theme.typography.family.bodyMedium,
      color: theme.colors.accent,
      fontSize: theme.typography.size.md,
      letterSpacing: theme.spacing['4xs'],
    },
  });

export function useRegisterTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createRegisterStyles(theme) };
}
