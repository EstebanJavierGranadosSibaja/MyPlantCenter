import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';
import { AppTheme } from 'src/theme/designSystem';

export const createSafeAreaStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingBottom: theme.spacing['6xl'],
    },
  });

export function useCustomSafeAreaTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createSafeAreaStyles(theme) };
}
