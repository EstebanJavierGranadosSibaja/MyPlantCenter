import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';


export const createProfileTabsStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({

  wrapper: {
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop:        theme.spacing.md,
    paddingBottom:     theme.spacing.sm,
  },

  container: {
    flexDirection:   'row',
    backgroundColor: theme.colors.elevated,
    borderRadius:    theme.radius.lg,
    padding:         theme.spacing.xs,
    gap:             theme.spacing.xs,
    borderWidth:     theme.borders.thin,
    borderColor:     theme.colors.cardBorder,
    shadowColor:     theme.shadows.sm.color,
    shadowOffset:    theme.shadows.sm.offset,
    shadowOpacity:   theme.shadows.sm.opacity,
    shadowRadius:    theme.shadows.sm.radius,
    elevation:       theme.shadows.sm.elevation,
  },

  tab: {
    flex:            1,
    borderRadius:    theme.radius.full,
    paddingVertical: theme.spacing.sm,
    alignItems:      'center',
    justifyContent:  'center',
  },

  tabPressed: {
    opacity: 0.82,
  },

  tabActive: {
    backgroundColor: theme.mode === 'light' ? theme.colors.heroInputBgSubtle : theme.colors.heroInputBg,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.cardBorder,
    shadowColor:     theme.shadows.sm.color,
    shadowOffset:    theme.shadows.sm.offset,
    shadowOpacity:   theme.shadows.sm.opacity,
    shadowRadius:    theme.shadows.sm.radius,
    elevation:       theme.shadows.sm.elevation,
  },

  tabText: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize:   theme.typography.size.sm,
    color:      theme.colors.textSecondary,
    letterSpacing: theme.spacing['4xs'],
  },

  tabTextActive: {
    color: theme.colors.tabActive,
  },

});

export function useProfileTabsTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createProfileTabsStyles(theme) };
}