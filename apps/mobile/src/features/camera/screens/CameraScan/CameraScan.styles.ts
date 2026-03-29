import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';

export const createCameraScanStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.backgroundAlt,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.layout.screenPaddingH,
    justifyContent: 'flex-start',
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing['2xl'],
  },

  cameraWrap: {
    width: '100%',
    height: 300,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    borderWidth: theme.borders.base,
    borderColor: theme.colors.border,
  },

  camera: {
    flex: 1,
  },

  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
  },

  secondaryButtonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.lg,
  },

  captureButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accent,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.accent,
    paddingVertical: theme.spacing.sm,
  },

  captureButtonText: {
    color: theme.colors.textInverse,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.lg,
  },

  previewWrap: {
    gap: theme.spacing.sm,
  },

  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.border,
  },

  actionButton: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
  },

  actionButtonText: {
    color: theme.colors.textInverse,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.lg,
  },

  frame: {
    width: '100%',
    borderRadius: theme.radius.lg,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.cardBg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.md,
  },

  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.family.displayBold,
    fontSize: theme.typography.size['4xl'],
    textAlign: 'center',
  },

  subtitle: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.xl,
    textAlign: 'center',
  },
});

export function useCameraScanTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createCameraScanStyles(theme) };
}
