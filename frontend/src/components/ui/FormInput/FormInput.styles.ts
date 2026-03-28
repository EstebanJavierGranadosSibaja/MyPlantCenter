import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';
import { AppTheme } from 'src/theme/designSystem';

export const createFormInputStyles = (theme: AppTheme) => StyleSheet.create({

  wrapper: {
    width: '100%',
  },

  label: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.base,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },

  labelRequired: {
    color: theme.colors.error,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.base,
  },

  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.thick,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },

  fieldRowFocused: {
    borderColor: theme.colors.primary,
  },

  fieldRowError: {
    borderColor: theme.colors.error,
  },

  fieldRowDisabled: {
    backgroundColor: theme.colors.backgroundAlt,
  },

  input: {
    flex: 1,
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.lg,
    color: theme.colors.textPrimary,
    paddingVertical: theme.spacing.md,
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },

  errorText: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.sm,
    color: theme.colors.error,
    flex: 1,
  },

  helperText: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },

  disabledOverlay: {
    opacity: theme.opacity.disabled,
  },

});

export function useFormInputTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createFormInputStyles(theme) };
}
