import { UITheme } from 'src/ui';
import { useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

// Hardcoded sizes not in UILayout
const FAV_ICON_SIZE = 48;
const LOGRO_SIZE = 52;

// ─────────────────────────────────────────────────────────────────────────────

export const createTabPerfilStyles = (theme: UITheme) => ({

  container: {
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop:        theme.spacing['2xl'],
    paddingBottom:     theme.spacing['5xl'],
    gap:               theme.spacing['2xl'],
  },

  sectionBlock: {
    gap: theme.spacing.base,
  },

  sectionCard: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius:    theme.radius.lg,
    borderWidth:     1,
    borderColor:     theme.colors.borderDefault,
    padding:         theme.spacing.xl,
    ...theme.shadows.xs,
  },

  sectionTitle: {
    ...theme.text.overline,
    color: theme.colors.textSecondary,
  },

  descriptionText: {
    ...theme.text.body,
    color: theme.colors.textSecondary,
  },

  descriptionInput: {
    ...theme.text.body,
    color:             theme.colors.textPrimary,
    backgroundColor:   theme.colors.bgSubtle,
    borderWidth:       1.5,
    borderColor:       theme.colors.borderDefault,
    borderRadius:      theme.radius.md,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical:   theme.spacing.xl,
    textAlignVertical: 'top' as const,
    minHeight:         theme.layout.avatarLg + theme.spacing['3xl'],
    ...theme.shadows.none,
  },

  // ── Favorite plant card ────────────────────────────────────────────────────

  favPlantCard: {
    flexDirection: 'row' as const,
    alignItems:    'center' as const,
    gap:           theme.spacing['2xl'],
    backgroundColor: theme.colors.accent,
    borderRadius:  theme.radius.lg,
    padding:       theme.spacing['2xl'],
    borderWidth:   1,
    borderColor:   theme.colors.accentMuted,
    ...theme.shadows.md,
  },

  favPlantIcon: {
    width:           FAV_ICON_SIZE,
    height:          FAV_ICON_SIZE,
    borderRadius:    theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
    alignItems:      'center' as const,
    justifyContent:  'center' as const,
  },

  favPlantInfo: {
    flex: 1,
    gap:  theme.spacing.xs,
  },

  favPlantName: {
    ...theme.text.h3,
    color: theme.colors.textOnAccent,
  },

  favPlantCategoria: {
    ...theme.text.bodyMd,
    color: theme.colors.textOnAccent,
  },

  // ── Birthday row ───────────────────────────────────────────────────────────

  birthdayRow: {
    flexDirection:   'row' as const,
    alignItems:      'center' as const,
    gap:             theme.spacing.xl,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius:    theme.radius.lg,
    padding:         theme.spacing['2xl'],
    borderWidth:     1,
    borderColor:     theme.colors.borderDefault,
    ...theme.shadows.xs,
  },

  birthdayLabel: {
    ...theme.text.caption,
    color:        theme.colors.textTertiary,
    marginBottom: 2,
  },

  birthdayValue: {
    ...theme.text.h3,
    color: theme.colors.textPrimary,
  },

  // ── Logros ─────────────────────────────────────────────────────────────────

  logrosPanel: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius:    theme.radius.lg,
    borderWidth:     1,
    borderColor:     theme.colors.borderDefault,
    padding:         theme.spacing.xl,
    ...theme.shadows.xs,
  },

  logrosRow: {
    flexDirection: 'row' as const,
    flexWrap:      'wrap' as const,
    gap:           theme.spacing.base,
  },

  logroItem: {
    width:          LOGRO_SIZE,
    height:         LOGRO_SIZE,
    borderRadius:   theme.radius.md,
    borderWidth:    1,
    alignItems:     'center' as const,
    justifyContent: 'center' as const,
  },

  logroEmoji: {
    fontSize:   28,
    lineHeight: 36,
  },

});

// ─────────────────────────────────────────────────────────────────────────────

export function useTabPerfilTheme() {
  const theme = useUITheme();
  return { theme, styles: createTabPerfilStyles(theme) };
}
