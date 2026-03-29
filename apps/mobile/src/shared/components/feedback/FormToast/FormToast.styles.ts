import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createFormToastStyles = (theme: AppTheme) => StyleSheet.create({

  container: {
    position: 'absolute',
    top: theme.layout.headerHeight + theme.spacing.sm,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },

  card: {
    alignSelf: 'center',
    width: '92%',
    maxWidth: 560,
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.thick,
    padding: theme.spacing.lg,
    shadowColor: theme.shadows.sm.color,
    shadowOffset: theme.shadows.sm.offset,
    shadowOpacity: theme.shadows.sm.opacity,
    shadowRadius: theme.shadows.sm.radius,
    elevation: theme.shadows.sm.elevation,
  },

  cardSuccess: {
    borderColor: theme.colors.success,
  },

  cardWarning: {
    borderColor: theme.colors.warning,
  },

  cardError: {
    borderColor: theme.colors.error,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  textColumn: {
    flex: 1,
  },

  title: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size['2xl'],
  },

  titleSuccess: {
    color: theme.colors.success,
  },

  titleWarning: {
    color: theme.colors.warning,
  },

  titleError: {
    color: theme.colors.error,
  },

  subtitle: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.md,
    color: theme.colors.textSecondary,
  },

  closeButton: {
    padding: theme.spacing.xs,
  },

});

export function useFormToastTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createFormToastStyles(theme) };
}
