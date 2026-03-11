import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';

export const createProfileHeroStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({

  hero: {
    backgroundColor: theme.colors.heroBg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.layout.heroPaddingBottom,
    paddingHorizontal: theme.layout.screenPaddingH,
    overflow: 'hidden',
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  statusDot: {
    width: theme.spacing.sm,
    height: theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accentSoft,
  },

  statusText: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.heroTextSubtle,
    letterSpacing: theme.spacing['3xs'],
    textTransform: 'uppercase' as const,
  },

  editButton: {
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 3,
    borderWidth: 1,
    borderColor: theme.colors.heroAccentMuted,
  },

  editButtonActive: {
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.accentSoft,
  },

  editButtonText: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.sm,
    color: theme.colors.heroAccent,
  },

  editButtonTextActive: {
    color: theme.colors.primary,
  },

  identity: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    alignItems: 'flex-start',
  },

  nameGroup: {
    flex: 1,
  },

  name: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size['6xl'],
    color: theme.colors.heroText,
    lineHeight: theme.typography.lineHeight.loose,
    marginBottom: theme.spacing.xs,
  },

  apodo: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.lg,
    color: theme.colors.accentSoft,
    marginBottom: theme.spacing.md,
  },

  badgeRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },

  inputName: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size['2xl'],
    color: theme.colors.heroText,
    backgroundColor: theme.colors.heroInputBg,
    borderColor: theme.colors.heroInputBorder,
    borderWidth: 1.5,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },

  inputApodo: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.md,
    color: theme.colors.accentSoft,
    backgroundColor: theme.colors.heroInputBgSubtle,
    borderColor: theme.colors.heroInputBorderSubtle,
    borderWidth: 1.5,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },

  xpSection: {
    marginTop: theme.spacing.lg,
  },

  xpLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs + 2,
  },

  xpTitle: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.accentSoft,
    letterSpacing: theme.spacing['3xs'],
    textTransform: 'uppercase' as const,
  },

  xpValue: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.accent,
  },

});

export function useProfileHeroTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createProfileHeroStyles(theme) };
}