import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';
import { AppTheme } from 'src/theme/designSystem';

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