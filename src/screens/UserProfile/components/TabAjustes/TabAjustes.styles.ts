import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';

export const createTabAjustesStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({

  container: {
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.lg,
  },

  sectionTitle: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textMuted,
    letterSpacing: theme.spacing['3xs'],
    textTransform: 'uppercase' as const,
    marginBottom: theme.spacing.sm,
  },

  group: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.md,
    borderWidth: theme.radius['3xs'],
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },

  groupItem: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },

  groupDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },

  // Selector de tema — tres opciones en fila
  themeSelector: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  themeOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.sm,
    borderWidth: theme.radius['3xs'],
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.cardBg,
  },

  themeOptionActive: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.accent + '18',
  },

  themeOptionIcon: {
    fontSize: theme.typography.size['2xl'],
    lineHeight: theme.typography.lineHeight.normal,
  },

  themeOptionLabel: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textMuted,
  },

  themeOptionLabelActive: {
    color: theme.colors.accent,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.cardBg,
    borderWidth: theme.radius['3xs'],
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md + 2,
  },

  actionIcon: {
    fontSize: theme.typography.size['2xl'],
    lineHeight: theme.typography.lineHeight.normal,
  },

  actionLabel: {
    fontFamily: theme.typography.family.bodyMedium,
    fontSize: theme.typography.size.md,
    flex: 1,
  },

  actionChevron: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size['2xl'],
    color: theme.colors.textMuted,
  },

});


export function useTabAjustesTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createTabAjustesStyles(theme) };
}