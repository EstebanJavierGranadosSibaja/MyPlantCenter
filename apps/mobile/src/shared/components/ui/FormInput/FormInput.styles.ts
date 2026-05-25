import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

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
    backgroundColor: theme.colors.surface,
    borderRadius: theme.layout.inputRadius,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.cardBorder,
    paddingHorizontal: theme.spacing.md,
    height: theme.layout.inputHeight,
    gap: theme.spacing.sm,
  },

  fieldRowFocused: {
    borderColor: theme.colors.accent,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: theme.shadows.sm.elevation,
  },

  fieldRowError: {
    borderColor: theme.colors.error,
  },

  fieldRowDisabled: {
    backgroundColor: theme.colors.elevated,
  },

  input: {
    flex: 1,
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.base,
    color: theme.colors.textPrimary,
    paddingVertical: 0,
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
  const styles = useMemo(() => createFormInputStyles(theme), [theme]);
  return { theme, styles };
}
