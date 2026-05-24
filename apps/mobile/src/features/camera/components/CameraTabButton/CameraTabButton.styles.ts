import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createCameraTabButtonStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -theme.spacing.md,
  },
  button: {
    width: theme.spacing['5xl'] + theme.spacing.sm,
    height: theme.spacing['5xl'] + theme.spacing.sm,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.accent,
    borderWidth: theme.borders.bold,
    borderColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.shadows.lg.color,
    shadowOffset: theme.shadows.lg.offset,
    shadowOpacity: theme.shadows.lg.opacity,
    shadowRadius: theme.shadows.lg.radius,
    elevation: theme.shadows.lg.elevation,
  },
  buttonPressed: {
    backgroundColor: theme.colors.accentDark,
    borderColor: theme.colors.accentDark,
  },
  cameraIcon: {
    size: theme.typography.size['2xl'],
    color: theme.colors.textInverse,
  },
});

export function useCameraTabButtonTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createCameraTabButtonStyles(theme) };
}