import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';

export const createTabPerfilStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({

  container: {
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.lg,
  },

  sectionTitle: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textMuted,
    letterSpacing: theme.spacing.xs,
    textTransform: 'uppercase' as const,
    marginBottom: theme.spacing.sm,
  },

  descriptionText: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.lg,
    color: theme.colors.textSecondary,
    fontStyle: 'italic' as const,
    lineHeight: theme.typography.lineHeight.relaxed,
  },

  descriptionInput: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.lg,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.cardBg,
    borderWidth: theme.radius['3xs'],
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    lineHeight: theme.typography.lineHeight.relaxed,
    textAlignVertical: 'top' as const,
    minHeight: theme.layout.avatarLg + theme.spacing.xl,
  },

  favPlantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },

  favPlantIcon: {
    width: theme.layout.favIconSize,
    height: theme.layout.favIconSize,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.favPlantIconBg,
    fontSize: theme.typography.size['4xl'],
    lineHeight: theme.typography.lineHeight.loose,
    alignItems: 'center',
    justifyContent: 'center',
  },

  favPlantInfo: {
    flex: 1,
    gap: theme.spacing.xs + 2,
  },

  favPlantName: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size['2xl'],
    color: theme.colors.heroText,
    fontStyle: 'italic' as const,
  },

  favPlantCategoria: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.base,
    color: theme.colors.accentSoft,
  },

  birthdayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    borderWidth: theme.radius['3xs'],
    borderColor: theme.colors.border,
  },

  birthdayIcon: {
    fontSize: theme.typography.size['4xl'],
    lineHeight: theme.typography.lineHeight.loose,
  },

  birthdayLabel: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.base,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs - 2,
  },

  birthdayValue: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size.xl,
    color: theme.colors.textPrimary,
  },

  logrosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },

  logroItem: {
    width: theme.layout.logroSize,
    height: theme.layout.logroSize,
    borderRadius: theme.radius.md,
    borderWidth: theme.radius['3xs'],
    alignItems: 'center',
    justifyContent: 'center',
  },

  logroIcon: {
    fontSize: theme.typography.size['4xl'],
    lineHeight: theme.typography.lineHeight.loose,
  },

  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.lg - 1,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },

  saveButtonText: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.lg,
    color: theme.colors.accentSoft,
    letterSpacing: theme.spacing['4xs'],
  },

});

export function useTabPerfilTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createTabPerfilStyles(theme) };
}