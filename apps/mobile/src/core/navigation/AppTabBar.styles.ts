import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createTabBarOptions = (theme: AppTheme, bottomInset: number) => ({

    headerShown: false,

    tabBarStyle: {
        backgroundColor: theme.colors.cardBg,
        borderTopColor: theme.colors.cardBorder,
        borderTopWidth: theme.borders.thin,
        borderWidth: theme.borders.thin,
        borderColor: theme.colors.cardBorder,
        height: theme.layout.heroPaddingTop + Math.max(bottomInset, theme.spacing.md),
        borderRadius: theme.layout.tabBarRadius + theme.radius.xs,
        marginHorizontal: theme.layout.screenPaddingH,
        bottom: 0,
        position: 'absolute' as const,
        overflow: 'visible' as const,
        paddingTop: theme.spacing.sm,
        paddingBottom: Math.max(bottomInset, theme.spacing.sm),
        shadowColor: theme.shadows.lg.color,
        shadowOffset: theme.shadows.lg.offset,
        shadowOpacity: theme.shadows.lg.opacity,
        shadowRadius: theme.shadows.lg.radius,
        elevation: theme.shadows.lg.elevation,
        marginBottom: theme.spacing.lg,
        marginTop: theme.spacing.md,
    },

    tabBarItemStyle: {
        marginHorizontal: theme.spacing['2xs'],
        marginVertical: theme.spacing.xs,
        borderRadius: theme.radius.full,
    },

    tabBarActiveBackgroundColor: 'transparent',

    tabBarActiveTintColor: theme.colors.tabActive,
    tabBarInactiveTintColor: theme.colors.tabInactive,

    tabBarIconStyle: {
        marginTop: theme.spacing['3xs'],
    },

  tabBarLabelStyle: {
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xs,
    marginBottom: theme.spacing['3xs'],
  },
  tabIconContainer: {
    minWidth: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.sm + theme.spacing['3xs'],
    paddingVertical: theme.spacing['3xs'],
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
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