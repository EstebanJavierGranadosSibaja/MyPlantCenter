import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createSectionHeaderStyles = (theme: AppTheme) => StyleSheet.create({

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },

  left: {
    flex: 1,
    gap: theme.spacing['4xs'],
  },

  title: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    lineHeight: theme.typography.lineHeight.tight,
    color: theme.colors.textMuted,
    letterSpacing: theme.typography.letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },

  subtitle: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.xs,
    lineHeight: theme.typography.lineHeight.tight,
    color: theme.colors.textTertiary,
  },

  action: {
    paddingLeft: theme.spacing.sm,
  },

  actionPressed: {
    opacity: theme.opacity.disabled,
  },

  actionLabel: {
    fontFamily: theme.typography.family.bodyMedium,
    fontSize: theme.typography.size.sm,
    color: theme.colors.accent,
  },

});

export function useSectionHeaderTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createSectionHeaderStyles(theme) };
}
