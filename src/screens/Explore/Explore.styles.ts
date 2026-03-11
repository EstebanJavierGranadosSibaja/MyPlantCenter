import { StyleSheet } from 'react-native';
import { AppTheme, getAppTheme } from 'src/theme/designSystem';
import { useAppThemeContext } from 'src/context/ThemeContext';

export const createExplorarStyles = (theme: AppTheme) => StyleSheet.create({

    root: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.md,
    },

    title: {
        fontFamily: theme.typography.family.displayBold,
        fontSize: theme.typography.size['3xl'],
        color: theme.colors.textPrimary,
    },

    subtitle: {
        fontFamily: theme.typography.family.bodyRegular,
        fontSize: theme.typography.size.lg,
        color: theme.colors.textMuted,
    },

});

export function useExplorarTheme() {
    const theme = useAppThemeContext();
    return { theme, styles: createExplorarStyles(theme) };
}