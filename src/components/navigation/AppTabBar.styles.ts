import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppThemeContext } from 'src/context/ThemeContext';
import { AppTheme } from 'src/theme/designSystem';

export const createTabBarOptions = (theme: AppTheme, bottomInset: number) => ({

    headerShown: false,

    tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.border,
        borderTopWidth: 1,
        height: theme.layout.heroPaddingTop + bottomInset,
        paddingTop: theme.spacing.xs,
        paddingBottom: bottomInset,
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