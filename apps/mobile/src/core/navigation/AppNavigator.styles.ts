import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createAppNavigatorStyles = (theme: AppTheme) => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingIndicator: {
    size: 'large',
    color: theme.colors.accent,
  },
});

export function useAppNavigatorTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createAppNavigatorStyles(theme) };
}