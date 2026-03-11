import { StyleSheet } from 'react-native';
import { AppTheme } from 'src/theme/designSystem';
import { useAppThemeContext } from 'src/context/ThemeContext';

export const createAppHeaderStyles = (theme: AppTheme) => StyleSheet.create({

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.heroBg,
    paddingHorizontal: theme.layout.screenPaddingH,
    height: theme.layout.headerHeight,
    gap: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.heroInputBorderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: theme.spacing.sm,
    elevation: 6,
    zIndex: 10,
  },

  backButton: {
    width: theme.layout.avatarSm,
    height: theme.layout.avatarSm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.heroInputBg,
    borderWidth: theme.spacing['4xs'],
    borderColor: theme.colors.heroInputBorder,
    flexShrink: 0,
  },

  backIcon: {
    fontSize: theme.typography.size['4xl'],
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
    fontSize: theme.typography.size['3xl'],
    color: theme.colors.heroText,
    lineHeight: theme.typography.lineHeight.normal,
  },

  subtitle: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.heroTextSubtle,
    letterSpacing: theme.spacing['3xs'],
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