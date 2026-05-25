import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createChipStyles = (theme: AppTheme) => StyleSheet.create({

  base: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    height: theme.layout.chipHeight,
    borderRadius: theme.layout.chipRadius,
    borderWidth: theme.borders.base,
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing['4xs'],
  },

  // ─── Idle ─────────────────────────────────────────────────────────────

  idle: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.cardBorder,
  },

  idlePressed: {
    backgroundColor: theme.colors.elevated,
    borderColor: theme.colors.cardBorder,
  },

  // ─── Active ───────────────────────────────────────────────────────────

  active: {
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.accent,
  },

  activePressed: {
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.accentDark,
  },

  // ─── Labels ───────────────────────────────────────────────────────────

  labelBase: {
    fontFamily: theme.typography.family.bodyMedium,
    fontSize: theme.typography.size.sm,
    lineHeight: theme.typography.lineHeight.snug,
  },

  labelIdle:   { color: theme.colors.textSecondary },
  labelActive: { color: theme.colors.textPrimary },

  // ─── Disabled ─────────────────────────────────────────────────────────

  disabled: {
    opacity: theme.opacity.disabled,
  },

});

export function useChipTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createChipStyles(theme) };
}
