import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';
import { AppTheme } from 'src/theme/designSystem';

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
            fontSize: theme.typography.size['5xl'],
            color: theme.colors.textPrimary,
            textAlign: 'center',
        },
        subtitle: {
            fontFamily: theme.typography.family.bodyRegular,
            fontSize: theme.typography.size.lg,
            color: theme.colors.textMuted,
            textAlign: 'center',
            marginBottom: theme.spacing.sm,
            lineHeight: theme.typography.lineHeight.snug,
        },
        formCard: {
            backgroundColor: theme.colors.cardBg,
            borderRadius: theme.radius.md,
            borderWidth: theme.borders.thick,
            borderColor: theme.colors.border,
            padding: theme.spacing.lg,
            gap: theme.spacing.md,
            shadowColor: theme.shadows.sm.color,
            shadowOffset: theme.shadows.sm.offset,
            shadowOpacity: theme.shadows.sm.opacity,
            shadowRadius: theme.shadows.sm.radius,
            elevation: theme.shadows.sm.elevation,
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
            paddingVertical: theme.spacing.md + 3,
            paddingHorizontal: theme.spacing.xl,
            shadowColor: theme.shadows.md.color,
            shadowOffset: theme.shadows.md.offset,
            shadowOpacity: theme.shadows.md.opacity,
            shadowRadius: theme.shadows.md.radius,
            elevation: theme.shadows.md.elevation,
        },
        buttonText: {
            fontFamily: theme.typography.family.bodySemiBold,
            fontSize: theme.typography.size.lg,
            color: theme.colors.accentSoft,
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
            borderWidth: theme.borders.thick,
            borderColor: theme.colors.border,
            shadowColor: theme.shadows.sm.color,
            shadowOffset: theme.shadows.sm.offset,
            shadowOpacity: theme.shadows.sm.opacity,
            shadowRadius: theme.shadows.sm.radius,
            elevation: theme.shadows.sm.elevation,
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
            fontSize: theme.typography.size.lg,
            color: theme.colors.textPrimary,
            letterSpacing: theme.spacing['4xs'],
        },
        secondaryButton: {
            paddingVertical: theme.spacing.sm,
            alignItems: 'center',
        },
        secondaryText: {
            fontFamily: theme.typography.family.bodyMedium,
            color: theme.colors.accent,
            fontSize: theme.typography.size.md,
            letterSpacing: theme.spacing['4xs'],
        },
    });

export function useLoginTheme() {
    const theme = useAppThemeContext();
    return { theme, styles: createLoginStyles(theme) };
}
