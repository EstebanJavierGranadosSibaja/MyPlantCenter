import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createLoginStyles = (theme: AppTheme) =>
    StyleSheet.create({
        safe: {
            flex: 1,
            backgroundColor: theme.colors.backgroundAlt,
            justifyContent: 'center',
            paddingHorizontal: theme.layout.screenPaddingH,
            paddingVertical: theme.layout.screenPaddingV,
            gap: theme.spacing.lg,
        },
        title: {
            fontFamily: theme.typography.family.displayBold,
            fontSize: theme.typography.size['4xl'],
            color: theme.colors.textPrimary,
            textAlign: 'center',
        },
        subtitle: {
            fontFamily: theme.typography.family.bodyRegular,
            fontSize: theme.typography.size.md,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginBottom: theme.spacing.sm,
            lineHeight: theme.typography.lineHeight.snug,
        },
        formCard: {
            backgroundColor: theme.colors.elevated,
            borderRadius: theme.radius.md,
            borderWidth: theme.borders.thin,
            borderColor: theme.colors.cardBorder,
            padding: theme.spacing.lg,
            gap: theme.spacing.md,
            shadowColor: theme.shadows.md.color,
            shadowOffset: theme.shadows.md.offset,
            shadowOpacity: theme.shadows.md.opacity,
            shadowRadius: theme.shadows.md.radius,
            elevation: theme.shadows.md.elevation,
        },
        input: {
            borderWidth: theme.borders.thick,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.md,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.md,
            fontFamily: theme.typography.family.bodyRegular,
            fontSize: theme.typography.size.lg,
            color: theme.colors.textPrimary,
        },
        errorText: {
            color: theme.colors.error,
            fontFamily: theme.typography.family.bodyMedium,
            fontSize: theme.typography.size.base,
            textAlign: 'center',
        },
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.sm,
            backgroundColor: theme.colors.primary,
            borderRadius: theme.radius.md,
            borderWidth: theme.borders.base,
            borderColor: theme.colors.primary,
            paddingVertical: theme.spacing.md + 3,
            paddingHorizontal: theme.spacing.xl,
            shadowColor: theme.shadows.md.color,
            shadowOffset: theme.shadows.md.offset,
            shadowOpacity: theme.shadows.md.opacity,
            shadowRadius: theme.shadows.md.radius,
            elevation: theme.shadows.md.elevation,
        },
        buttonPressed: {
            backgroundColor: theme.colors.primaryDark,
            borderColor: theme.colors.primaryDark,
        },
        buttonText: {
            fontFamily: theme.typography.family.bodySemiBold,
            fontSize: theme.typography.size.base,
            color: theme.colors.textInverse,
            letterSpacing: theme.spacing['4xs'],
        },
        buttonDisabled: {
            opacity: theme.opacity.disabled,
        },
        socialDivider: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
            marginTop: theme.spacing.sm,
        },
        socialLine: {
            flex: 1,
            height: theme.borders.base,
            backgroundColor: theme.colors.border,
        },
        socialDividerText: {
            fontFamily: theme.typography.family.bodySemiBold,
            fontSize: theme.typography.size.xs,
            color: theme.colors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: theme.spacing['3xs'],
        },
        googleButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.sm,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.md,
            paddingVertical: theme.spacing.md + 3,
            paddingHorizontal: theme.spacing.xl,
            borderWidth: theme.borders.base,
            borderColor: theme.colors.cardBorder,
            shadowColor: theme.shadows.sm.color,
            shadowOffset: theme.shadows.sm.offset,
            shadowOpacity: theme.shadows.sm.opacity,
            shadowRadius: theme.shadows.sm.radius,
            elevation: theme.shadows.sm.elevation,
        },
        googleButtonPressed: {
            backgroundColor: theme.colors.elevated,
        },
        googleIconWrap: {
            width: theme.layout.avatarSm - theme.spacing.md,
            height: theme.layout.avatarSm - theme.spacing.md,
            borderRadius: theme.radius.full,
            backgroundColor: theme.colors.backgroundAlt,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: theme.borders.base,
            borderColor: theme.colors.border,
        },
        googleIconImage: {
            width: theme.typography.size['2xl'] + theme.spacing.sm,
            height: theme.typography.size['2xl'] + theme.spacing.sm,
        },
        googleButtonText: {
            fontFamily: theme.typography.family.bodySemiBold,
            fontSize: theme.typography.size.base,
            color: theme.colors.textPrimary,
            letterSpacing: theme.spacing['4xs'],
        },
        secondaryButton: {
            paddingVertical: theme.spacing.sm,
            alignItems: 'center',
        },
        secondaryButtonPressed: {
            opacity: 0.72,
        },
        secondaryText: {
            fontFamily: theme.typography.family.bodyMedium,
            color: theme.colors.secondary,
            fontSize: theme.typography.size.sm,
            letterSpacing: theme.spacing['4xs'],
        },
    });

export function useLoginTheme() {
    const theme = useAppThemeContext();
    return { theme, styles: createLoginStyles(theme) };
}
