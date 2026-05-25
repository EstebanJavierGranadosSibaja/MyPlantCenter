import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createConfirmActionModalStyles = (theme: AppTheme) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: `rgba(0, 0, 0, ${theme.opacity.overlay})`,
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing.xl,
        },
        card: {
            width: '100%',
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.surface,
            borderWidth: theme.borders.thin,
            borderColor: theme.colors.border,
            padding: theme.spacing.lg,
            gap: theme.spacing.sm,
            shadowColor: theme.shadows.lg.color,
            shadowOffset: theme.shadows.lg.offset,
            shadowOpacity: theme.shadows.lg.opacity,
            shadowRadius: theme.shadows.lg.radius,
            elevation: theme.shadows.lg.elevation,
        },
        title: {
            fontFamily: theme.typography.family.bodySemiBold,
            fontSize: theme.typography.size['2xl'],
            color: theme.colors.textPrimary,
            letterSpacing: theme.typography.letterSpacing.wider,
        },
        message: {
            fontFamily: theme.typography.family.bodyRegular,
            fontSize: theme.typography.size.md,
            color: theme.colors.textSecondary,
            lineHeight: theme.typography.lineHeight.snug,
        },
        actions: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: theme.spacing.sm,
            marginTop: theme.spacing.sm,
        },
        button: {
            height: theme.layout.buttonHeightSm,
            paddingHorizontal: theme.spacing.md,
            borderRadius: theme.layout.buttonRadius,
            minWidth: theme.layout.modalActionMinWidth,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: theme.borders.base,
        },
        cancelButton: {
            backgroundColor: theme.colors.cardBg,
            borderColor: theme.colors.border,
        },
        confirmButton: {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
        },
        destructiveButton: {
            backgroundColor: theme.colors.error,
            borderColor: theme.colors.error,
        },
        cancelText: {
            fontFamily: theme.typography.family.bodySemiBold,
            fontSize: theme.typography.size.md,
            color: theme.colors.textSecondary,
        },
        confirmText: {
            fontFamily: theme.typography.family.bodySemiBold,
            fontSize: theme.typography.size.md,
            color: theme.colors.textInverse,
        },
    });

export function useConfirmActionModalTheme() {
    const theme = useAppThemeContext();
    return { theme, styles: createConfirmActionModalStyles(theme) };
}
