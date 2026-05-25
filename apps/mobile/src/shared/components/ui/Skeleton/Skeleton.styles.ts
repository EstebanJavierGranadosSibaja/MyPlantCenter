import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createSkeletonStyles = (theme: AppTheme) => StyleSheet.create({

  base: {
    backgroundColor: theme.colors.elevated,
    overflow: 'hidden',
  },

});

export function useSkeletonTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createSkeletonStyles(theme) };
}
