import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createButtonStyles = (theme: AppTheme) => StyleSheet.create({

  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.layout.buttonRadius,
    borderWidth: theme.borders.base,
  },

  fullWidth: {
    width: '100%' as any,
  },

  disabled: {
    opacity: theme.opacity.disabled,
  },

  // ─── Sizes ────────────────────────────────────────────────────────────

  sizeSm: {
    height: theme.layout.buttonHeightSm,
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing['3xs'],
  },

  sizeMd: {
    height: theme.layout.buttonHeightMd,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing['2xs'],
  },

  sizeLg: {
    height: theme.layout.buttonHeightLg,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.xs,
  },

  // ─── Variant — idle ───────────────────────────────────────────────────

  primary: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },

  secondary: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.accent,
  },

  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },

  destructive: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },

  // ─── Variant — pressed ────────────────────────────────────────────────

  primaryPressed: {
    backgroundColor: theme.colors.accentDark,
    borderColor: theme.colors.accentDark,
  },

  secondaryPressed: {
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.accent,
  },

  ghostPressed: {
    backgroundColor: theme.colors.elevated,
    borderColor: 'transparent',
  },

  destructivePressed: {
    opacity: 0.82,
  },

  // ─── Labels ───────────────────────────────────────────────────────────

  labelBase: {
    fontFamily: theme.typography.family.bodySemiBold,
    letterSpacing: theme.typography.letterSpacing.wide,
  },

  labelSm: {
    fontSize: theme.typography.size.sm,
    lineHeight: theme.typography.lineHeight.snug,
  },

  labelMd: {
    fontSize: theme.typography.size.base,
    lineHeight: theme.typography.lineHeight.normal,
  },

  labelLg: {
    fontSize: theme.typography.size.lg,
    lineHeight: theme.typography.lineHeight.normal,
  },

  labelPrimary:     { color: theme.colors.textInverse },
  labelSecondary:   { color: theme.colors.accent },
  labelGhost:       { color: theme.colors.textSecondary },
  labelDestructive: { color: theme.colors.textInverse },

});

export function useButtonTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createButtonStyles(theme) };
}
