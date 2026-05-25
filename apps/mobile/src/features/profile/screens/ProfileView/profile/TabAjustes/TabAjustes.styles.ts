import { UITheme } from 'src/ui';
import { useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

export const createTabAjustesStyles = (theme: UITheme) => ({

  container: {
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop:        theme.spacing['2xl'],
    paddingBottom:     theme.spacing['5xl'],
    gap:               theme.spacing['2xl'],
  },

  sectionTitle: {
    ...theme.text.overline,
    color:        theme.colors.textTertiary,
    marginBottom: theme.spacing.md,
  },

  group: {
    backgroundColor: theme.colors.surface,
    borderRadius:    theme.radius.lg,
    borderWidth:     1,
    borderColor:     theme.colors.borderDefault,
    overflow:        'hidden' as const,
    ...theme.shadows.xs,
  },

  groupItem: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical:   theme.spacing.base,
  },

  groupDivider: {
    height:          0.5,
    backgroundColor: theme.colors.divider,
  },

  // ── Theme selector ─────────────────────────────────────────────────────────

  themeSelector: {
    flexDirection: 'row' as const,
    gap:           theme.spacing.base,
  },

  themeOption: {
    flex:            1,
    alignItems:      'center' as const,
    justifyContent:  'center' as const,
    gap:             theme.spacing.sm,
    paddingVertical: theme.spacing.xl,
    borderRadius:    theme.layout.cardRadius,
    borderWidth:     1,
    borderColor:     theme.colors.borderDefault,
    backgroundColor: theme.colors.surface,
  },

  themeOptionActive: {
    borderColor:     theme.colors.accent,
    backgroundColor: theme.mode === 'light' ? theme.colors.accentSoft : theme.colors.surfaceElevated,
    ...theme.shadows.xs,
  },

  themeOptionLabel: {
    ...theme.text.label,
    color: theme.colors.textSecondary,
  },

  themeOptionLabelActive: {
    color: theme.colors.accent,
  },

});

// ─────────────────────────────────────────────────────────────────────────────

export function useTabAjustesTheme() {
  const theme = useUITheme();
  return { theme, styles: createTabAjustesStyles(theme) };
}
