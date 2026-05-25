import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createAppHeaderStyles = (theme: AppTheme) => StyleSheet.create({

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.heroBg,
    paddingHorizontal: theme.layout.screenPaddingH,
    height: theme.layout.headerHeight,
    gap: theme.spacing.sm,
    borderBottomWidth: theme.borders.thin,
    borderBottomColor: theme.colors.heroInputBorderSubtle,
    shadowColor: theme.shadows.md.color,
    shadowOffset: theme.shadows.md.offset,
    shadowOpacity: theme.shadows.md.opacity,
    shadowRadius: theme.shadows.md.radius,
    elevation: theme.shadows.md.elevation,
    zIndex: theme.zIndex.dropdown,
  },

  backButton: {
    width: theme.layout.buttonHeightSm,
    height: theme.layout.buttonHeightSm,
    borderRadius: theme.layout.buttonRadius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.heroInputBg,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.heroInputBorder,
    flexShrink: 0,
  },

  backIcon: {
    fontSize: theme.typography.size['2xl'],
    color: theme.colors.heroAccent,
    lineHeight: theme.typography.lineHeight.normal,
    textAlign: 'center' as const,
  },

  titleGroup: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size.xl,
    color: theme.colors.heroText,
    lineHeight: theme.typography.lineHeight.normal,
  },

  subtitle: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.heroTextSubtle,
    letterSpacing: theme.typography.letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },

  rightSlot: {
    flexShrink: 0,
  },

});

export function useAppHeaderTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createAppHeaderStyles(theme) };
}