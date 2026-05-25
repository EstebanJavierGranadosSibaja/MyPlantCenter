import { Dimensions } from 'react-native';
import { UITheme } from 'src/ui';
import { useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_COMPACT = SCREEN_WIDTH < 390;

// ─────────────────────────────────────────────────────────────────────────────

export const createProfileHeroStyles = (theme: UITheme) => ({

  // ── Root ───────────────────────────────────────────────────────────────────

  root: {
    width: SCREEN_WIDTH,
    backgroundColor: theme.colors.bg,
  },

  heroTopSection: {
    position: 'relative' as const,
    marginBottom: theme.spacing.sm,
  },

  // ── Hero background ────────────────────────────────────────────────────────

  heroBackground: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.42,
    overflow: 'hidden' as const,
    position: 'relative' as const,
    backgroundColor: theme.colors.accentSoft,
  },

  heroBase: {
    position: 'absolute' as const,
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: theme.colors.accentSoft,
  },

  heroHighlightPrimary: {
    position: 'absolute' as const,
    width: SCREEN_WIDTH * 0.88,
    height: SCREEN_WIDTH * 0.88,
    borderRadius: theme.radius.full,
    top: -SCREEN_WIDTH * 0.56,
    right: -SCREEN_WIDTH * 0.12,
  },

  heroHighlightSecondary: {
    position: 'absolute' as const,
    width: SCREEN_WIDTH * 0.72,
    height: SCREEN_WIDTH * 0.72,
    borderRadius: theme.radius.full,
    top: -SCREEN_WIDTH * 0.34,
    left: -SCREEN_WIDTH * 0.18,
  },

  heroBottomLayer: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    bottom: -theme.spacing.md,
    height: SCREEN_WIDTH * 0.20,
    borderTopLeftRadius: theme.radius['2xl'] + theme.radius.md,
    borderTopRightRadius: theme.radius['2xl'] + theme.radius.md,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.borderSubtle,
  },

  // ── Avatar ─────────────────────────────────────────────────────────────────

  avatarWrapper: {
    position: 'absolute' as const,
    bottom: -(theme.layout.avatarLg * 0.4),
    left: theme.layout.screenPaddingH,
    zIndex: 10,
  },

  avatarRing: {
    padding: 6,
    borderRadius: theme.radius.full,
  },

  avatarRingActive: {
    borderWidth: 3,
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.surfaceElevated,
  },

  levelPill: {
    position: 'absolute' as const,
    bottom: -theme.spacing.md,
    alignSelf: 'center' as const,
    left: 0,
    right: 0,
    alignItems: 'center' as const,
  },

  levelPillInner: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 5,
    borderWidth: 2,
    borderColor: theme.colors.bg,
  },

  levelText: {
    ...theme.text.overline,
    color: theme.colors.textOnAccent,
  },

  // ── Summary shell (identity + XP + bio card) ───────────────────────────────

  summaryShell: {
    marginHorizontal: theme.layout.screenPaddingH,
    backgroundColor: theme.mode === 'light' ? theme.colors.surface : theme.colors.surfaceElevated,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },

  // ── Identity ───────────────────────────────────────────────────────────────

  identitySection: {
    paddingTop: theme.layout.avatarLg * 0.42 + (IS_COMPACT ? theme.spacing.md : theme.spacing.xl),
    gap: IS_COMPACT ? theme.spacing.sm : theme.spacing.md,
  },

  displayName: {
    ...(IS_COMPACT ? theme.text.h2 : theme.text.h1),
    color: theme.colors.textPrimary,
  },

  nickname: {
    ...theme.text.bodyMd,
    color: theme.colors.textTertiary,
  },

  levelTitle: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    marginTop: IS_COMPACT ? 4 : 6,
    alignSelf: 'flex-start' as const,
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: theme.colors.accentMuted,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
  },

  levelTitleText: {
    ...theme.text.label,
    color: theme.colors.accentForeground,
    letterSpacing: 0.5,
  },

  // ── XP bar ─────────────────────────────────────────────────────────────────

  xpSection: {
    marginTop: IS_COMPACT ? theme.spacing.md : theme.spacing.xl,
    gap: theme.spacing.sm,
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

  // ── Bio ────────────────────────────────────────────────────────────────────

  bioSection: {
    marginTop: IS_COMPACT ? theme.spacing.md : theme.spacing.xl,
  },

  bioText: {
    ...(IS_COMPACT ? theme.text.bodyMd : theme.text.body),
    color: theme.colors.textSecondary,
  },

  bioInput: {
    ...theme.text.body,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.bgSubtle,
    borderWidth: 1.5,
    borderColor: theme.colors.borderDefault,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xl,
    textAlignVertical: 'top' as const,
    minHeight: theme.layout.avatarMd,
  },

  // ── Stats row ──────────────────────────────────────────────────────────────

  statsSection: {
    flexDirection: 'row' as const,
    paddingHorizontal: theme.layout.screenPaddingH,
    marginTop: IS_COMPACT ? theme.spacing.xl : theme.spacing['2xl'],
    gap: theme.spacing.md,
  },

  statItem: {
    flex: 1,
    alignItems: 'center' as const,
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.mode === 'light' ? theme.colors.surface : theme.colors.surfaceElevated,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    ...theme.shadows.sm,
    gap: 6,
  },

  statValue: {
    ...theme.text.numeric,
    color: theme.colors.textPrimary,
  },

  statLabel: {
    ...theme.text.overline,
    color: theme.colors.textTertiary,
  },

  // ── Action buttons ─────────────────────────────────────────────────────────

  actionsSection: {
    paddingHorizontal: theme.layout.screenPaddingH,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    flexDirection: 'row' as const,
    gap: theme.spacing.md,
  },

  actionButtonPrimary: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.base,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    ...theme.shadows.sm,
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
    paddingVertical: theme.spacing.base,
    borderWidth: 1,
    borderColor: theme.colors.borderDefault,
    ...theme.shadows.sm,
  },

  actionButtonSecondaryPressed: {
    backgroundColor: theme.colors.bgSubtle,
  },

  actionButtonTextPrimary: {
    ...theme.text.button,
    color: theme.colors.textOnAccent,
  },

  actionButtonTextSecondary: {
    ...theme.text.button,
    color: theme.colors.textPrimary,
  },

  // ── Divider ────────────────────────────────────────────────────────────────

  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginTop: theme.spacing.xl,
  },

});

// ─────────────────────────────────────────────────────────────────────────────

export function useProfileHeroTheme() {
  const theme = useUITheme();
  return { theme, styles: createProfileHeroStyles(theme) };
}
