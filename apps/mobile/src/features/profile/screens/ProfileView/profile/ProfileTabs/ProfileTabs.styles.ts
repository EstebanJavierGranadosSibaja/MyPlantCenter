import { UITheme } from 'src/ui';
import { useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

export const createProfileTabsStyles = (theme: UITheme) => ({

  wrapper: {
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop:        theme.spacing.xl,
    paddingBottom:     theme.spacing.base,
  },

  container: {
    flexDirection:   'row' as const,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius:    theme.radius.lg,
    padding:         theme.spacing.md,
    gap:             theme.spacing.md,
    borderWidth:     1,
    borderColor:     theme.colors.borderDefault,
    ...theme.shadows.xs,
  },

  tab: {
    flex:            1,
    borderRadius:    theme.radius.full,
    paddingVertical: 10,
    alignItems:      'center' as const,
    justifyContent:  'center' as const,
  },

  tabPressed: {
    opacity: 0.82,
  },

  tabActive: {
    backgroundColor: theme.mode === 'light' ? theme.colors.bgSubtle : theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    ...theme.shadows.xs,
  },

  tabText: {
    ...theme.text.label,
    color:         theme.colors.textSecondary,
    letterSpacing: 0.3,
  },

  tabTextActive: {
    color: theme.colors.tabActive,
  },

});

// ─────────────────────────────────────────────────────────────────────────────

export function useProfileTabsTheme() {
  const theme = useUITheme();
  return { theme, styles: createProfileTabsStyles(theme) };
}
