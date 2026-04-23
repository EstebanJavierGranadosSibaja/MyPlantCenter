import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createEditProfileStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.md,
      paddingHorizontal: theme.layout.screenPaddingH,
      paddingTop: theme.spacing.lg,
    },
    card: {
      backgroundColor: theme.colors.cardBg,
      borderRadius: theme.radius.md,
      borderWidth: theme.borders.thick,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      shadowColor: theme.shadows.sm.color,
      shadowOffset: theme.shadows.sm.offset,
      shadowOpacity: theme.shadows.sm.opacity,
      shadowRadius: theme.shadows.sm.radius,
      elevation: theme.shadows.sm.elevation,
    },
    saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.md,
      paddingVertical: theme.spacing.md + 3,
      paddingHorizontal: theme.spacing.xl,
      marginTop: theme.spacing.sm,
      shadowColor: theme.shadows.md.color,
      shadowOffset: theme.shadows.md.offset,
      shadowOpacity: theme.shadows.md.opacity,
      shadowRadius: theme.shadows.md.radius,
      elevation: theme.shadows.md.elevation,
    },
    saveButtonDisabled: {
      opacity: theme.opacity.disabled,
    },
    saveButtonText: {
      fontFamily: theme.typography.family.bodySemiBold,
      fontSize: theme.typography.size.lg,
      color: theme.colors.textInverse,
      letterSpacing: theme.spacing['4xs'],
    },
  });

export function useEditProfileTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createEditProfileStyles(theme) };
}
