import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createCameraScanStyles = (theme: AppTheme) => StyleSheet.create({
  loadingPermissionsText: {
    padding: theme.spacing.md,
  },
});

export function useCameraScanTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createCameraScanStyles(theme) };
}