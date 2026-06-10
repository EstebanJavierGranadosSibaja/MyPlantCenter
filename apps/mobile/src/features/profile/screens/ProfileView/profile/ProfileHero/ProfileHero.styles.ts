import { Dimensions } from 'react-native';
import { UITheme } from 'src/ui';
import { useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────
// Cabecera de perfil estilo Instagram: avatar + stats en una sola fila,
// identidad compacta, barra de XP fina y acciones. Sin banner pesado.

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────────────────

export const createProfileHeroStyles = (theme: UITheme) => ({

  root: {
    width: SCREEN_WIDTH,
    backgroundColor: theme.colors.bg,
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop: theme.spacing.md,
  },

  // ── Fila superior: avatar + estadísticas ─────────────────────────────────

  topRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },

  avatarCol: {
    alignItems: 'center' as const,
    marginRight: theme.spacing.lg,
  },

  avatarRing: {
    padding: 3,
    borderRadius: theme.radius.full,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.surfaceElevated,
  },

  levelPill: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    marginTop: -theme.spacing.sm,
    borderWidth: 2,
    borderColor: theme.colors.bg,
  },

  levelText: {
    ...theme.text.overline,
    color: theme.colors.textOnAccent,
  },

  statsRow: {
    flex: 1,
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    alignItems: 'center' as const,
  },

  statItem: {
    alignItems: 'center' as const,
    gap: 2,
  },

  statValue: {
    ...theme.text.h3,
    color: theme.colors.textPrimary,
  },

  statLabel: {
    ...theme.text.caption,
    color: theme.colors.textTertiary,
  },

  // ── Identidad ─────────────────────────────────────────────────────────────

  identityBlock: {
    marginTop: theme.spacing.md,
  },

  nameRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: theme.spacing.sm,
    flexWrap: 'wrap' as const,
  },

  displayName: {
    ...theme.text.h3,
    color: theme.colors.textPrimary,
  },

  levelChip: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.accentMuted,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },

  levelChipText: {
    ...theme.text.label,
    color: theme.colors.accentForeground,
  },

  nickname: {
    ...theme.text.bodyMd,
    color: theme.colors.textTertiary,
    marginTop: 1,
  },

  bioText: {
    ...theme.text.bodyMd,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },

  // ── Barra de XP ─────────────────────────────────────────────────────────────

  xpSection: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.xs,
  },

  xpRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },

  xpLabel: {
    ...theme.text.overline,
    color: theme.colors.textSecondary,
  },

  xpValue: {
    ...theme.text.label,
    color: theme.colors.accentForeground,
  },

  // ── Acciones ─────────────────────────────────────────────────────────────

  actionsSection: {
    flexDirection: 'row' as const,
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },

  actionButtonPrimary: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },

  actionButtonPrimaryPressed: {
    backgroundColor: theme.colors.accentPressed,
    borderColor: theme.colors.accentPressed,
  },

  actionButtonSecondary: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
  },

  actionButtonSecondaryPressed: {
    backgroundColor: theme.colors.bgSubtle,
  },

  actionButtonTextPrimary: {
    ...theme.text.label,
    color: theme.colors.textOnAccent,
  },

  actionButtonTextSecondary: {
    ...theme.text.label,
    color: theme.colors.textPrimary,
  },

  // ── Divisor ─────────────────────────────────────────────────────────────────

  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginTop: theme.spacing.lg,
  },

});

// ─────────────────────────────────────────────────────────────────────────────

export function useProfileHeroTheme() {
  const theme = useUITheme();
  return { theme, styles: createProfileHeroStyles(theme) };
}
