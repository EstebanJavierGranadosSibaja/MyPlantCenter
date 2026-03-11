import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';
import { AppTheme } from 'src/theme/designSystem';

export const createProfileStyles = (theme: AppTheme) => StyleSheet.create({

  root: {
    flex:            1,
    backgroundColor: theme.colors.background,
  },

  statsCard: {
    marginHorizontal: theme.spacing.lg,
    marginTop:        theme.layout.statsCardOverlap,
    zIndex:           2,
  },

  centered: {
    flex:            1,
    backgroundColor: theme.colors.background,
    justifyContent:  'center',
    alignItems:      'center',
    padding:         theme.spacing.xl,
  },

  errorText: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize:   theme.typography.size.lg,
    color:      theme.colors.error,
    textAlign:  'center',
  },

  loadingText: {
    fontFamily: theme.typography.family.bodyRegular,
    fontSize:   theme.typography.size.lg,
    color:      theme.colors.textMuted,
    marginTop:  theme.spacing.md,
  },

});

export function useProfileTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createProfileStyles(theme)};
}