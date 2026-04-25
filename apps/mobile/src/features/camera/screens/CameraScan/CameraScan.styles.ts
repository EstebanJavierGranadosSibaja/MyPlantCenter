import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';

export const createCameraScanStyles = (theme: ReturnType<typeof useAppThemeContext>) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    cameraContainer: {
      flex: 1,
    },

    camera: {
      flex: 1,
    },

    overlayBottom: {
      position: 'absolute',
      bottom: theme.spacing['2xl'],
      left: theme.spacing.lg,
      right: theme.spacing.lg,
      gap: theme.spacing.md,
    },

    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    sideButton: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: theme.borders.base,
      borderColor: theme.colors.border,
    },

    captureButton: {
      width: 74,
      height: 74,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },

    captureInner: {
      width: 58,
      height: 58,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.surface,
    },

    flashText: {
      color: theme.colors.textPrimary,
      fontFamily: theme.typography.family.bodySemiBold,
      fontSize: theme.typography.size.sm,
    },

    previewContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },

    previewContent: {
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing['2xl'],
      gap: theme.spacing.lg,
    },

    previewImage: {
      width: '100%',
      height: 320,
      borderRadius: theme.radius.lg,
      borderWidth: theme.borders.base,
      borderColor: theme.colors.border,
    },

    previewActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },

    previewPrimaryButton: {
      flex: 1,
      minHeight: 50,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
    },

    actionButton: {
      width: '100%',  
      minHeight: 50,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
    },

    secondaryButton: {
      flex: 1,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.md,
      borderWidth: theme.borders.base,
      borderColor: theme.colors.border,
    },

    actionText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.size.lg,
      fontWeight: '600',
      textAlign: 'center',
      includeFontPadding: false, // 🔥 Android fix
    },

    secondaryText: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.size.lg,
      fontWeight: '600',
    },

    syncCard: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.accentSoft,
      borderWidth: theme.borders.base,
      borderColor: theme.colors.border,
      gap: theme.spacing.sm,
    },

    syncTitle: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.size.xl,
      fontFamily: theme.typography.family.bodyBold,
    },

    syncSubtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.size.base,
      fontFamily: theme.typography.family.bodyRegular,
    },

    messageCard: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: theme.borders.base,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.cardBg,
    },

    messageText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.size.base,
      fontFamily: theme.typography.family.bodyMedium,
    },

    resultCard: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: theme.borders.base,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      gap: theme.spacing.sm,
    },

    resultTitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.size.base,
      fontFamily: theme.typography.family.bodySemiBold,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },

    resultName: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.size['2xl'],
      fontFamily: theme.typography.family.displayBold,
    },

    resultSubtitle: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.size.lg,
      fontFamily: theme.typography.family.bodyMedium,
    },

    resultMeta: {
      color: theme.colors.textMuted,
      fontSize: theme.typography.size.base,
      fontFamily: theme.typography.family.bodyRegular,
    },

    summaryText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.size.base,
      fontFamily: theme.typography.family.bodyRegular,
      lineHeight: theme.typography.lineHeight.snug,
    },

    careList: {
      gap: theme.spacing.xs,
    },

    careItem: {
      color: theme.colors.textPrimary,
      fontSize: theme.typography.size.base,
      fontFamily: theme.typography.family.bodyMedium,
    },

    permissionContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.layout.screenPaddingH,
    },

    permissionBox: {
      padding: theme.spacing.xl,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardBg,
      borderWidth: theme.borders.base,
      borderColor: theme.colors.border,
      gap: theme.spacing.md,
      alignItems: 'stretch',
    },

    title: {
      fontSize: theme.typography.size['3xl'],
      color: theme.colors.textPrimary,
      fontFamily: theme.typography.family.displayBold,
      textAlign: 'center',
    },

    subtitle: {
      fontSize: theme.typography.size.lg,
      color: theme.colors.textMuted,
      textAlign: 'center',
      fontFamily: theme.typography.family.bodyRegular,
    },
  });

export function useCameraScanTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createCameraScanStyles(theme) };
}