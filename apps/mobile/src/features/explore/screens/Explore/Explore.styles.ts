import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createExplorarStyles = (theme: AppTheme) => StyleSheet.create({

    root: {
        flex: 1,
        backgroundColor: theme.colors.backgroundAlt,
        paddingHorizontal: theme.layout.screenPaddingH,
        paddingTop: theme.spacing.lg,
        gap: theme.spacing.md,
    },

    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.cardBg,
        borderRadius: theme.radius.md,
        borderWidth: theme.borders.thick,
        borderColor: theme.colors.border,
        paddingHorizontal: theme.spacing.md,
        gap: theme.spacing.sm,
    },

    searchInput: {
        flex: 1,
        fontFamily: theme.typography.family.bodyRegular,
        fontSize: theme.typography.size.lg,
        color: theme.colors.textPrimary,
        paddingVertical: theme.spacing.md,
    },

    content: {
        padding: theme.spacing.lg,
        borderRadius: theme.radius.md,
        borderWidth: theme.borders.thick,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.cardBg,
        shadowColor: theme.shadows.sm.color,
        shadowOffset: theme.shadows.sm.offset,
        shadowOpacity: theme.shadows.sm.opacity,
        shadowRadius: theme.shadows.sm.radius,
        elevation: theme.shadows.sm.elevation,
        gap: theme.spacing.md,
    },

    title: {
        fontFamily: theme.typography.family.displayBold,
        fontSize: theme.typography.size['2xl'],
        color: theme.colors.textPrimary,
    },

    subtitle: {
        fontFamily: theme.typography.family.bodyRegular,
        fontSize: theme.typography.size.lg,
        color: theme.colors.textMuted,
        lineHeight: theme.typography.lineHeight.snug,
    },

    resultItem: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        borderWidth: theme.borders.base,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colors.backgroundAlt,
    },

    resultLabel: {
        fontFamily: theme.typography.family.bodyRegular,
        fontSize: theme.typography.size.lg,
        color: theme.colors.textPrimary,
    },

});

export function useExplorarTheme() {
    const theme = useAppThemeContext();
    return { theme, styles: createExplorarStyles(theme) };
}