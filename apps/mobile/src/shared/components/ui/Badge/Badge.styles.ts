import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createBadgeStyles = (theme: AppTheme) => StyleSheet.create({

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: theme.radius.full,
    borderWidth: theme.borders.base,
  },

  label: {
    fontFamily: theme.typography.family.bodySemiBold,
    letterSpacing: 0.4,
  },

});


export function useBadgeTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createBadgeStyles(theme) };
}