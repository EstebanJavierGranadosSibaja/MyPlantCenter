import { Dimensions, StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_COMPACT_SCREEN = SCREEN_WIDTH < 390;

export const createProfileHeroStyles = (theme: AppTheme) => StyleSheet.create({

  // Contenedor raíz 
  root: {
    width: SCREEN_WIDTH,
    backgroundColor: theme.colors.background,
  },

  // Fondo hero 
  heroTopSection: {
    position: 'relative',
  },

  heroBackground: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.42,
    overflow: 'hidden',
    position: 'relative',
    borderBottomWidth: theme.borders.thin,
    borderBottomColor: theme.colors.heroInputBorderSubtle,
  },

  heroBgGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  heroBgPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: theme.opacity.medium,
  },

  heroBgBlur: {
    ...StyleSheet.absoluteFillObject,
  },

  heroBottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '58%',
  },

  // Avatar, flota sobre el fondo 
  avatarWrapper: {
    position: 'absolute',
    bottom: -theme.layout.avatarLg * 0.4,
    left: theme.layout.screenPaddingH,
    zIndex: 10,
  },

  avatarRing: {
    padding: theme.spacing['4xs'] + 2,
    borderRadius: theme.radius.full,
  },

  avatarRingActive: {
    borderWidth: theme.spacing.xs,
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.heroInputBgSubtle,
  },

  levelPill: {
    position: 'absolute',
    bottom: -theme.spacing.sm,
    alignSelf: 'center',
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  levelPillInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs - 2,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing['4xs'] + 1,
    borderWidth: theme.borders.bold,
    borderColor: theme.colors.background,
  },

  levelText: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs - 1,
    color: theme.colors.accentSoft,
    letterSpacing: theme.spacing['4xs'],
  },

  // Identidad
  identitySection: {
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop: theme.layout.avatarLg * 0.38 + (IS_COMPACT_SCREEN ? theme.spacing.md : theme.spacing.lg),
    gap: IS_COMPACT_SCREEN ? theme.spacing['2xs'] : theme.spacing.xs,
  },

  displayName: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: IS_COMPACT_SCREEN ? theme.typography.size['3xl'] : theme.typography.size['4xl'],
    color: theme.colors.textPrimary,
    lineHeight: IS_COMPACT_SCREEN ? theme.typography.lineHeight.normal : theme.typography.lineHeight.relaxed,
  },

  nickname: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: IS_COMPACT_SCREEN ? theme.typography.size.base : theme.typography.size.lg,
    color: theme.colors.textMuted,
  },

  levelTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: IS_COMPACT_SCREEN ? theme.spacing['4xs'] : theme.spacing.xs - 2,
  },

  levelTitleText: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.base,
    color: theme.colors.accent,
    letterSpacing: theme.spacing['4xs'],
  },

  // XP bar
  xpSection: {
    paddingHorizontal: theme.layout.screenPaddingH,
    marginTop: IS_COMPACT_SCREEN ? theme.spacing.xs : theme.spacing.sm,
    gap: theme.spacing.xs - 2,
  },

  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  xpLabel: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textMuted,
    letterSpacing: theme.spacing['4xs'],
    textTransform: 'uppercase' as const,
  },

  xpValue: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.accent,
  },

  // Bio 
  bioSection: {
    paddingHorizontal: theme.layout.screenPaddingH,
    marginTop: IS_COMPACT_SCREEN ? theme.spacing.sm : theme.spacing.md,
  },

  bioText: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: IS_COMPACT_SCREEN ? theme.typography.size.base : theme.typography.size.lg,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.relaxed,
  },

  bioInput: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.lg,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.cardBg,
    borderWidth: theme.borders.thick,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    lineHeight: theme.typography.lineHeight.relaxed,
    textAlignVertical: 'top' as const,
    minHeight: theme.layout.avatarMd,
  },

  // Stats
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: theme.layout.screenPaddingH,
    marginTop: IS_COMPACT_SCREEN ? theme.spacing.md : theme.spacing.lg,
    gap: theme.spacing.xs,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.thick,
    borderColor: theme.colors.border,
    gap: theme.spacing.xs - 2,
  },

  statValue: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: IS_COMPACT_SCREEN ? theme.typography.size['3xl'] : theme.typography.size['4xl'],
    color: theme.colors.textPrimary,
    lineHeight: theme.typography.lineHeight.normal,
  },

  statLabel: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textMuted,
    letterSpacing: theme.spacing['4xs'],
    textTransform: 'uppercase' as const,
  },

  // Highlights 
  highlightsSection: {
    paddingHorizontal: theme.layout.screenPaddingH,
    marginTop: IS_COMPACT_SCREEN ? theme.spacing.md : theme.spacing.lg,
    gap: theme.spacing.sm,
  },

  highlightsSectionTitle: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textMuted,
    letterSpacing: theme.spacing['4xs'],
    textTransform: 'uppercase' as const,
  },

  highlightsList: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },

  highlightItem: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  highlightRing: {
    width: theme.layout.avatarMd + theme.spacing.xs,
    height: theme.layout.avatarMd + theme.spacing.xs,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: theme.borders.thick,
  },

  highlightEmoji: {
    fontSize: theme.typography.size['3xl'],
    lineHeight: theme.typography.lineHeight.normal,
  },

  highlightLabel: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs - 1,
    color: theme.colors.textMuted,
    textAlign: 'center' as const,
    maxWidth: theme.layout.avatarMd + theme.spacing.xs,
  },

  // Acciones 
  actionsSection: {
    paddingHorizontal: theme.layout.screenPaddingH,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  actionButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    borderWidth: theme.borders.thick,
    borderColor: theme.colors.primary,
  },

  actionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    borderWidth: theme.borders.thick,
    borderColor: theme.colors.border,
  },

  actionButtonTextPrimary: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.md,
    color: theme.colors.accentSoft,
  },

  actionButtonTextSecondary: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.md,
    color: theme.colors.textSecondary,
  },

  // Divider 
  divider: {
    height: theme.borders.base,
    backgroundColor: theme.colors.border,
    marginTop: theme.spacing.sm,
  },

});

export function useProfileHeroTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createProfileHeroStyles(theme) };
}