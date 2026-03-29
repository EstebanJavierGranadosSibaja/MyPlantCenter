import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createTabCategoriasStyles = (theme: AppTheme) => StyleSheet.create({

  container: {
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop:        theme.spacing.lg,
    paddingBottom:     theme.spacing['5xl'],
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
    gap: theme.spacing.md,
  },

  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  chartRowLabel: {
    width: 86,
    fontFamily: theme.typography.family.bodyMedium,
    fontSize: theme.typography.size.base,
    color: theme.colors.textSecondary,
  },

  chartTrack: {
    flex: 1,
    height: theme.spacing.lg,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.heroInputBgSubtle,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },

  chartFill: {
    height: '100%',
    borderRadius: theme.layout.chartBarRadius,
  },

  chartRowValue: {
    minWidth: 20,
    textAlign: 'right',
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xl,
    color: theme.colors.textPrimary,
  },

});

export function useTabCategoriasTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createTabCategoriasStyles(theme) };
}