import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';
import { AppTheme } from 'src/theme/designSystem';

export const createExplorarStyles = (theme: AppTheme) => StyleSheet.create({

    root: {
        flex: 1,
        backgroundColor: theme.colors.backgroundAlt,
    },

    content: {
        marginHorizontal: theme.layout.screenPaddingH,
        marginTop: theme.spacing['2xl'],
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing['2xl'],
        borderRadius: theme.radius.lg,
        borderWidth: theme.borders.thin,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
        shadowColor: theme.shadows.md.color,
        shadowOffset: theme.shadows.md.offset,
        shadowOpacity: theme.shadows.md.opacity,
        shadowRadius: theme.shadows.md.radius,
        elevation: theme.shadows.md.elevation,
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.lg,
    },

    title: {
        fontFamily: theme.typography.family.displayBold,
        fontSize: theme.typography.size['4xl'],
        color: theme.colors.textPrimary,
    },

    subtitle: {
        fontFamily: theme.typography.family.bodyRegular,
        fontSize: theme.typography.size.lg,
        color: theme.colors.textMuted,
        lineHeight: theme.typography.lineHeight.snug,
    },

});

export function useExplorarTheme() {
    const theme = useAppThemeContext();
    return { theme, styles: createExplorarStyles(theme) };
}