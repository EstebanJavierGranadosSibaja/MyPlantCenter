import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createSafeAreaStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    keyboardAvoiding: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing['6xl'],
    },
  });

export function useCustomSafeAreaTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createSafeAreaStyles(theme) };
}
