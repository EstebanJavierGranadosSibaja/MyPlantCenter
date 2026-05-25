import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createHistoryScreenStyles = (theme: AppTheme) => StyleSheet.create({
  placeholderText: {
    fontSize: theme.typography.size.lg,
  },
});

export function useHistoryScreenTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createHistoryScreenStyles(theme) };
}