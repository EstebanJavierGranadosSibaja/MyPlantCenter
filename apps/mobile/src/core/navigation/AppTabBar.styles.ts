import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createTabBarOptions = (theme: AppTheme, bottomInset: number) => ({

    headerShown: false,

    tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.border,
        borderTopWidth: theme.borders.thin,
        borderWidth: theme.borders.thin,
        borderColor: theme.colors.border,
        height: theme.layout.heroPaddingTop + Math.max(bottomInset, theme.spacing.md),
        borderRadius: theme.layout.tabBarRadius + theme.radius.xs,
        marginHorizontal: theme.layout.screenPaddingH,
        bottom: 0,
        position: 'absolute' as const,
        paddingTop: theme.spacing.xs,
        paddingBottom: Math.max(bottomInset, theme.spacing.sm),
        shadowColor: theme.shadows.lg.color,
        shadowOffset: theme.shadows.lg.offset,
        shadowOpacity: theme.shadows.lg.opacity,
        shadowRadius: theme.shadows.lg.radius,
        elevation: theme.shadows.lg.elevation,
        marginBottom: theme.spacing.lg,
        marginTop: theme.spacing.md,
    },

    tabBarActiveTintColor: theme.colors.accent,
    tabBarInactiveTintColor: theme.colors.textMuted,

    tabBarLabelStyle: {
        fontFamily: theme.typography.family.bodySemiBold,
        fontSize: theme.typography.size.xs,
    },

});

export function useTabBarTheme() {
    const theme = useAppThemeContext();
    const insets = useSafeAreaInsets();

    return {
        theme,
        tabBarOptions: createTabBarOptions(theme, insets.bottom),
    };
}