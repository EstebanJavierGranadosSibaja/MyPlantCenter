import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';


export const createProfileTabsStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({

  wrapper: {
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop:        theme.spacing.lg,
    paddingBottom:     theme.spacing.xs,
  },

  container: {
    flexDirection:   'row',
    backgroundColor: theme.colors.tabBg,
    borderRadius:    theme.radius.md,
    padding:         theme.spacing.xs,
    gap:             theme.spacing.xs - 2,
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
    shadowColor:     theme.colors.primary,
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.15,
    shadowRadius:    theme.spacing.xs,
    elevation:       2,
  },

  tabText: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize:   theme.typography.size.sm,
    color:      theme.colors.tabInactive,
  },

  tabTextActive: {
    color: theme.colors.textInverse,
  },

});

export function useProfileTabsTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createProfileTabsStyles(theme) };
}