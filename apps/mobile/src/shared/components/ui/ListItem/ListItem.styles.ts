import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createListItemStyles = (theme: AppTheme) => StyleSheet.create({

  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
    minHeight: theme.layout.buttonHeightLg,
  },

  pressed: {
    backgroundColor: theme.colors.elevated,
  },

  iconWrap: {
    width: theme.layout.iconLg,
    height: theme.layout.iconLg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.xs,
    flexShrink: 0,
  },

  labelGroup: {
    flex: 1,
    gap: theme.spacing['5xs'],
  },

  label: {
    fontFamily: theme.typography.family.bodyMedium,
    fontSize: theme.typography.size.base,
    lineHeight: theme.typography.lineHeight.snug,
    color: theme.colors.textPrimary,
  },

  labelDestructive: {
    color: theme.colors.error,
  },

  sublabel: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.sm,
    lineHeight: theme.typography.lineHeight.snug,
    color: theme.colors.textMuted,
  },

  right: {
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  divider: {
    height: theme.borders.base,
    backgroundColor: theme.colors.divider,
    marginLeft: theme.spacing.lg + theme.layout.iconLg + theme.spacing.md,
  },

});

export function useListItemTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createListItemStyles(theme) };
}
