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
    marginBottom: theme.spacing.xs,
  },

  heroBackground: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.42,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: theme.colors.heroBg,
  },

  heroBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.heroBg,
  },

  heroHighlightPrimary: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.88,
    height: SCREEN_WIDTH * 0.88,
    borderRadius: theme.radius.full,
    top: -SCREEN_WIDTH * 0.56,
    right: -SCREEN_WIDTH * 0.12,
  },

  heroHighlightSecondary: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.72,
    height: SCREEN_WIDTH * 0.72,
    borderRadius: theme.radius.full,
    top: -SCREEN_WIDTH * 0.34,
    left: -SCREEN_WIDTH * 0.18,
  },

  heroBottomLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -theme.spacing.sm,
    height: SCREEN_WIDTH * 0.20,
    borderTopLeftRadius: theme.radius.xl + theme.radius.md,
    borderTopRightRadius: theme.radius.xl + theme.radius.md,
    borderTopWidth: theme.borders.thin,
    borderTopColor: theme.colors.heroInputBorder,
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
    backgroundColor: theme.colors.elevated,
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
    color: theme.colors.textInverse,
    letterSpacing: theme.spacing['4xs'],
  },

  summaryShell: {
    marginHorizontal: theme.layout.screenPaddingH,
    backgroundColor: theme.mode === 'light' ? theme.colors.surface : theme.colors.elevated,
    borderRadius: theme.radius.lg,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.cardBorder,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    shadowColor: theme.shadows.md.color,
    shadowOffset: theme.shadows.md.offset,
    shadowOpacity: theme.shadows.md.opacity,
    shadowRadius: theme.shadows.md.radius,
    elevation: theme.shadows.md.elevation,
  },

  // Identidad
  identitySection: {
    paddingTop: theme.layout.avatarLg * 0.42 + (IS_COMPACT_SCREEN ? theme.spacing.sm : theme.spacing.md),
    gap: IS_COMPACT_SCREEN ? theme.spacing['2xs'] : theme.spacing.xs,
  },

  displayName: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: IS_COMPACT_SCREEN ? theme.typography.size['2xl'] : theme.typography.size['3xl'],
    color: theme.colors.textPrimary,
    lineHeight: IS_COMPACT_SCREEN ? theme.typography.lineHeight.snug : theme.typography.lineHeight.normal,
  },

  nickname: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: IS_COMPACT_SCREEN ? theme.typography.size.sm : theme.typography.size.md,
    color: theme.colors.textMuted,
  },

  levelTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs - 1,
    marginTop: IS_COMPACT_SCREEN ? theme.spacing['4xs'] : theme.spacing.xs - 2,
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.favPlantIconBg,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.cardBorder,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing['3xs'],
  },

  levelTitleText: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.sm,
    color: theme.colors.secondary,
    letterSpacing: theme.spacing['4xs'],
  },

  // XP bar
  xpSection: {
    marginTop: IS_COMPACT_SCREEN ? theme.spacing.sm : theme.spacing.md,
    gap: theme.spacing['2xs'],
  },

  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  xpLabel: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textSecondary,
    letterSpacing: theme.spacing['4xs'],
    textTransform: 'uppercase' as const,
  },

  xpValue: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.secondary,
  },

  // Bio 
  bioSection: {
    marginTop: IS_COMPACT_SCREEN ? theme.spacing.sm : theme.spacing.md,
  },

  bioText: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: IS_COMPACT_SCREEN ? theme.typography.size.sm : theme.typography.size.base,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.snug,
  },

  bioInput: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.base,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.cardBg,
    borderWidth: theme.borders.thick,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    lineHeight: theme.typography.lineHeight.normal,
    textAlignVertical: 'top' as const,
    minHeight: theme.layout.avatarMd,
  },

  // Stats
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: theme.layout.screenPaddingH,
    marginTop: IS_COMPACT_SCREEN ? theme.spacing.md : theme.spacing.lg,
    gap: theme.spacing.sm,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md + 2,
    backgroundColor: theme.mode === 'light' ? theme.colors.surface : theme.colors.elevated,
    borderRadius: theme.radius.lg,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.cardBorder,
    shadowColor: theme.shadows.sm.color,
    shadowOffset: theme.shadows.sm.offset,
    shadowOpacity: theme.shadows.sm.opacity,
    shadowRadius: theme.shadows.sm.radius,
    elevation: theme.shadows.sm.elevation,
    gap: theme.spacing.xs - 2,
  },

  statValue: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: IS_COMPACT_SCREEN ? theme.typography.size['2xl'] : theme.typography.size['3xl'],
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
    marginHorizontal: theme.layout.screenPaddingH,
    marginTop: IS_COMPACT_SCREEN ? theme.spacing.md : theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.elevated,
    shadowColor: theme.shadows.sm.color,
    shadowOffset: theme.shadows.sm.offset,
    shadowOpacity: theme.shadows.sm.opacity,
    shadowRadius: theme.shadows.sm.radius,
    elevation: theme.shadows.sm.elevation,
    gap: theme.spacing.sm,
  },

  highlightsSectionTitle: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textSecondary,
    letterSpacing: theme.spacing['4xs'],
    textTransform: 'uppercase' as const,
  },

  highlightsList: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  highlightItem: {
    width: theme.layout.avatarMd + theme.spacing['2xl'],
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.surface,
  },

  highlightRing: {
    width: theme.layout.avatarMd,
    height: theme.layout.avatarMd,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: theme.borders.thick,
  },

  highlightEmoji: {
    fontSize: theme.typography.size['2xl'],
    lineHeight: theme.typography.lineHeight.normal,
  },

  highlightLabel: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs - 1,
    color: theme.colors.textMuted,
    textAlign: 'center' as const,
    maxWidth: theme.layout.avatarMd + theme.spacing.md,
  },

  // Acciones 
  actionsSection: {
    paddingHorizontal: theme.layout.screenPaddingH,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
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
    paddingVertical: theme.spacing.md + 2,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.primary,
    shadowColor: theme.shadows.sm.color,
    shadowOffset: theme.shadows.sm.offset,
    shadowOpacity: theme.shadows.sm.opacity,
    shadowRadius: theme.shadows.sm.radius,
    elevation: theme.shadows.sm.elevation,
  },

  actionButtonPrimaryPressed: {
    backgroundColor: '#12563B',
    borderColor: '#12563B',
  },

  actionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md + 2,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.cardBorder,
    shadowColor: theme.shadows.sm.color,
    shadowOffset: theme.shadows.sm.offset,
    shadowOpacity: theme.shadows.sm.opacity,
    shadowRadius: theme.shadows.sm.radius,
    elevation: theme.shadows.sm.elevation,
  },

  actionButtonSecondaryPressed: {
    backgroundColor: theme.colors.elevated,
  },

  actionButtonTextPrimary: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.base,
    color: theme.colors.textInverse,
  },

  actionButtonTextSecondary: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.base,
    color: theme.colors.textPrimary,
  },

  // Divider 
  divider: {
    height: theme.borders.base,
    backgroundColor: theme.colors.border,
    marginTop: theme.spacing.md,
  },

});

export function useProfileHeroTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createProfileHeroStyles(theme) };
}