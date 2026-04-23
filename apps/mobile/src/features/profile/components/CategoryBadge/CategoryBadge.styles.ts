import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createCategoryBadgeStyles = (theme: AppTheme) => StyleSheet.create({

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radius.lg,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.lg,
    shadowColor: theme.shadows.sm.color,
    shadowOffset: theme.shadows.sm.offset,
    shadowOpacity: theme.shadows.sm.opacity,
    shadowRadius: theme.shadows.sm.radius,
    elevation: theme.shadows.sm.elevation,
  },

  iconContainer: {
    width: theme.layout.categoryIconSize,
    height: theme.layout.categoryIconSize,
    borderRadius: theme.radius.full,
    borderWidth: theme.borders.thick,
    backgroundColor: theme.colors.backgroundAlt,
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
    fontSize: theme.typography.size.base,
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

  countPill: {
    minWidth: theme.spacing['3xl'],
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing['3xs'],
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.surface,
  },

  count: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size.xl,
    flexShrink: 0,
    lineHeight: theme.typography.lineHeight.normal,
  },

});


export function useCategoryBadgeTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createCategoryBadgeStyles(theme) };
}