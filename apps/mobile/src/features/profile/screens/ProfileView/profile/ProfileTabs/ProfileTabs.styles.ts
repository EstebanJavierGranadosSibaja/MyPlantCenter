import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';


export const createProfileTabsStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({

  wrapper: {
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop:        theme.spacing.lg,
    paddingBottom:     theme.spacing.sm,
  },

  container: {
    flexDirection:   'row',
    backgroundColor: theme.colors.tabBg,
    borderRadius:    theme.radius.md,
    padding:         theme.spacing.xs,
    gap:             theme.spacing.xs - 2,
    borderWidth:     theme.borders.thin,
    borderColor:     theme.colors.border,
  },

  tab: {
    flex:            1,
    borderRadius:    theme.radius.sm,
    paddingVertical: theme.spacing.sm + 1,
    alignItems:      'center',
    justifyContent:  'center',
  },

  tabActive: {
    backgroundColor: theme.colors.tabActive,
    shadowColor:     theme.shadows.sm.color,
    shadowOffset:    theme.shadows.sm.offset,
    shadowOpacity:   theme.shadows.sm.opacity,
    shadowRadius:    theme.shadows.sm.radius,
    elevation:       theme.shadows.sm.elevation,
  },

  tabText: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize:   theme.typography.size.sm,
    color:      theme.colors.tabInactive,
    letterSpacing: theme.spacing['4xs'],
  },

  tabTextActive: {
    color: theme.colors.textInverse,
  },

});

export function useProfileTabsTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createProfileTabsStyles(theme) };
}