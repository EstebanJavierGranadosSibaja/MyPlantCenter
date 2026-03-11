import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';

export const createCategoryBadgeStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: theme.spacing.xs + 2,
    elevation: 2,
  },

  iconContainer: {
    width: theme.layout.categoryIconSize,
    height: theme.layout.categoryIconSize,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  icon: {
    fontSize: theme.typography.size['3xl'],
    lineHeight: theme.typography.lineHeight.snug,
  },

  content: {
    flex: 1,
    gap: theme.spacing.xs - 2,
  },

  name: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size.md,
    color: theme.colors.textPrimary,
    lineHeight: theme.typography.lineHeight.tight,
  },

  track: {
    height: theme.spacing.xs,
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.xs,
    overflow: 'hidden',
  },

  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%' as any,
    borderRadius: theme.radius.xs,
  },

  count: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size['4xl'],
    flexShrink: 0,
    lineHeight: theme.typography.lineHeight.normal,
  },

});


export function useCategoryBadgeTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createCategoryBadgeStyles(theme) };
}