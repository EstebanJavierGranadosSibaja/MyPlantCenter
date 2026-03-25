import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';

export const createBadgeStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: theme.radius.full,
    borderWidth: theme.borders.base,
  },

  label: {
    fontFamily: theme.typography.family.bodySemiBold,
    letterSpacing: theme.spacing['4xs'],
  },

});


export function useBadgeTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createBadgeStyles(theme) };
}