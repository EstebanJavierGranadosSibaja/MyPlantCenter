import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createTabPerfilStyles = (theme: AppTheme) => StyleSheet.create({

  container: {
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing['5xl'],
    gap: theme.spacing.lg,
  },

  sectionBlock: {
    gap: theme.spacing.sm,
  },

  sectionCard: {
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radius.lg,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    shadowColor: theme.shadows.sm.color,
    shadowOffset: theme.shadows.sm.offset,
    shadowOpacity: theme.shadows.sm.opacity,
    shadowRadius: theme.shadows.sm.radius,
    elevation: theme.shadows.sm.elevation,
  },

  sectionTitle: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.sm,
    color: theme.colors.textSecondary,
    letterSpacing: 1.4,
    textTransform: 'uppercase' as const,
  },

  descriptionText: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.base,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.relaxed,
  },

  descriptionInput: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.base,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.cardBg,
    borderWidth: theme.borders.thick,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    lineHeight: theme.typography.lineHeight.relaxed,
    textAlignVertical: 'top' as const,
    minHeight: theme.layout.avatarLg + theme.spacing.xl,
    shadowColor: theme.shadows.none.color,
    shadowOffset: theme.shadows.none.offset,
    shadowOpacity: theme.shadows.none.opacity,
    shadowRadius: theme.shadows.none.radius,
    elevation: theme.shadows.none.elevation,
  },

  favPlantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.heroInputBorder,
    shadowColor: theme.shadows.md.color,
    shadowOffset: theme.shadows.md.offset,
    shadowOpacity: theme.shadows.md.opacity,
    shadowRadius: theme.shadows.md.radius,
    elevation: theme.shadows.md.elevation,
  },

  favPlantIcon: {
    width: theme.layout.favIconSize,
    height: theme.layout.favIconSize,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.favPlantIconBg,
    fontSize: theme.typography.size['3xl'],
    lineHeight: theme.typography.lineHeight.loose,
    alignItems: 'center',
    justifyContent: 'center',
  },

  favPlantInfo: {
    flex: 1,
    gap: theme.spacing.xs + 2,
  },

  favPlantName: {
    fontFamily: theme.typography.family.displayBoldItalic,
    fontSize: theme.typography.size.xl,
    color: theme.colors.heroText,
  },

  favPlantCategoria: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.base,
    color: theme.colors.heroText,
  },

  birthdayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.cardBorder,
    shadowColor: theme.shadows.sm.color,
    shadowOffset: theme.shadows.sm.offset,
    shadowOpacity: theme.shadows.sm.opacity,
    shadowRadius: theme.shadows.sm.radius,
    elevation: theme.shadows.sm.elevation,
  },

  birthdayIcon: {
    fontSize: theme.typography.size['3xl'],
    lineHeight: theme.typography.lineHeight.loose,
  },

  birthdayLabel: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs - 2,
  },

  birthdayValue: {
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size.lg,
    color: theme.colors.textPrimary,
  },

  logrosRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },

  logrosPanel: {
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radius.lg,
    borderWidth: theme.borders.thin,
    borderColor: theme.colors.cardBorder,
    padding: theme.spacing.md,
    shadowColor: theme.shadows.sm.color,
    shadowOffset: theme.shadows.sm.offset,
    shadowOpacity: theme.shadows.sm.opacity,
    shadowRadius: theme.shadows.sm.radius,
    elevation: theme.shadows.sm.elevation,
  },

  logroItem: {
    width: theme.layout.logroSize,
    height: theme.layout.logroSize,
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.thin,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logroEmoji: {
    fontSize: theme.typography.size['3xl'],
    lineHeight: theme.typography.lineHeight.loose,
  },

  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md + 3,
    paddingHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.sm,
    shadowColor: theme.shadows.md.color,
    shadowOffset: theme.shadows.md.offset,
    shadowOpacity: theme.shadows.md.opacity,
    shadowRadius: theme.shadows.md.radius,
    elevation: theme.shadows.md.elevation,
  },

  saveButtonText: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.base,
    color: theme.colors.textInverse,
    letterSpacing: 0.4,
  },

});

export function useTabPerfilTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createTabPerfilStyles(theme) };
}