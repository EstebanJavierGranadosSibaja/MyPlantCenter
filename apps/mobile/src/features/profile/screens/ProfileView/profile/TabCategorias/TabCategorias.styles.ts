import { UITheme } from 'src/ui';
import { useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

const CHART_BAR_RADIUS = 8;

// ─────────────────────────────────────────────────────────────────────────────

export const createTabCategoriasStyles = (theme: UITheme) => ({

  container: {
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop:        theme.spacing['2xl'],
    paddingBottom:     theme.spacing['5xl'],
    gap:               theme.spacing['2xl'],
  },

  sectionTitle: {
    ...theme.text.overline,
    color:        theme.colors.textSecondary,
    marginBottom: theme.spacing.base,
  },

  list: {
    gap: theme.spacing.base,
  },

  listCard: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius:    theme.radius.lg,
    padding:         theme.spacing.xl,
    borderWidth:     1,
    borderColor:     theme.colors.borderDefault,
    ...theme.shadows.xs,
  },

  chartContainer: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius:    theme.radius.lg,
    padding:         theme.spacing['2xl'],
    borderWidth:     1,
    borderColor:     theme.colors.borderDefault,
    ...theme.shadows.xs,
    gap:             theme.spacing.xl,
  },

  chartRow: {
    flexDirection: 'row' as const,
    alignItems:    'center' as const,
    gap:           theme.spacing.base,
  },

  chartRowLabel: {
    ...theme.text.bodyMd,
    width: 86,
    color: theme.colors.textTertiary,
  },

  chartTrack: {
    flex:            1,
    height:          theme.spacing.lg,
    borderRadius:    theme.radius.xs,
    backgroundColor: theme.colors.bgSubtle,
    borderWidth:     1,
    borderColor:     theme.colors.borderSubtle,
    overflow:        'hidden' as const,
  },

  chartFill: {
    height:       '100%' as const,
    borderRadius: CHART_BAR_RADIUS,
  },

  chartRowValue: {
    ...theme.text.h3,
    minWidth:  20,
    textAlign: 'right' as const,
    color:     theme.colors.textPrimary,
  },

});

// ─────────────────────────────────────────────────────────────────────────────

export function useTabCategoriasTheme() {
  const theme = useUITheme();
  return { theme, styles: createTabCategoriasStyles(theme) };
}
