import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';
import { AppTheme } from 'src/theme/designSystem';

export const createTabCategoriasStyles = (theme: AppTheme) => StyleSheet.create({

  container: {
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop:        theme.spacing.lg,
    gap:               theme.spacing.lg,
  },

  sectionTitle: {
    fontFamily:    theme.typography.family.bodySemiBold,
    fontSize:      theme.typography.size.xs,
    color:         theme.colors.textMuted,
    letterSpacing: 1.4,
    textTransform: 'uppercase' as const,
    marginBottom:  theme.spacing.sm,
  },

  list: {
    gap: theme.spacing.md,
  },

  chartContainer: {
    backgroundColor: theme.colors.cardBg,
    borderRadius:    theme.radius.md,
    padding:         theme.spacing.lg,
    borderWidth:     theme.borders.thick,
    borderColor:     theme.colors.border,
    shadowColor: theme.shadows.sm.color,
    shadowOffset: theme.shadows.sm.offset,
    shadowOpacity: theme.shadows.sm.opacity,
    shadowRadius: theme.shadows.sm.radius,
    elevation: theme.shadows.sm.elevation,
  },

  chartBars: {
    flexDirection: 'row',
    height:        theme.layout.chartHeight,
    alignItems:    'flex-end',
    gap:           theme.spacing.md,
    marginBottom:  theme.spacing.sm,
  },

  chartBarWrapper: {
    flex:       1,
    alignItems: 'center',
    gap:        theme.spacing.xs,
  },

  chartBar: {
    width:        '100%' as any,
    borderRadius: theme.layout.chartBarRadius,
    minHeight:    theme.layout.chartBarMin,
  },

  chartIcon: {
    fontSize:  theme.typography.size.base,
    lineHeight: theme.typography.lineHeight.tight,
    textAlign: 'center' as const,
  },

  chartIconsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm + 2,
  },

  chartIconCell: {
    flex: 1,
    alignItems: 'center',
  },

});

export function useTabCategoriasTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createTabCategoriasStyles(theme) };
}