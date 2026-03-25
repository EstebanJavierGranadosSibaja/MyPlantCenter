import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';

export const createTabCategoriasStyles = (theme: ReturnType <typeof useAppThemeContext>) => StyleSheet.create({

  container: {
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop:        theme.spacing.lg,
    gap:               theme.spacing.lg,
  },

  sectionTitle: {
    fontFamily:    theme.typography.family.bodySemiBold,
    fontSize:      theme.typography.size.xs,
    color:         theme.colors.textMuted,
    letterSpacing: theme.spacing['3xs'],
    textTransform: 'uppercase' as const,
    marginBottom:  theme.spacing.sm,
  },

  list: {
    gap: theme.spacing.md,
  },

  chartContainer: {
    backgroundColor: theme.colors.cardBg,
    borderRadius:    theme.radius.lg,
    padding:         theme.spacing.lg,
    borderWidth:     theme.borders.thick,
    borderColor:     theme.colors.border,
    shadowColor: theme.shadows.md.color,
    shadowOffset: theme.shadows.md.offset,
    shadowOpacity: theme.shadows.md.opacity,
    shadowRadius: theme.shadows.md.radius,
    elevation: theme.shadows.md.elevation,
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

});

export function useTabCategoriasTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createTabCategoriasStyles(theme) };
}