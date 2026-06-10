import { useMemo } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

// On iOS the BlurView (mounted via tabBarBackground) provides the visual
// surface, so the bar itself must be transparent. On Android, expo-blur
// renders no actual blur, so we keep the opaque glass color as fallback.
const tabBarBg = (theme: AppTheme) =>
  Platform.OS === 'ios' ? 'transparent' : theme.colors.tabBarGlassBg;

export const createTabBarOptions = (theme: AppTheme, bottomInset: number) => ({

  headerShown: false,

  // Keep the floating pill visible when keyboard opens — the default (true on
  // Android) hides the bar and can trigger spurious focus/navigation events.
  tabBarHideOnKeyboard: false,

  tabBarStyle: {
    backgroundColor: tabBarBg(theme),
    borderWidth: theme.borders.base,
    borderColor: theme.colors.tabBarGlassBorder,
    height: theme.layout.tabBarHeight,
    paddingTop: theme.spacing['3xs'],
    paddingBottom: theme.spacing['2xs'],
    paddingHorizontal: theme.spacing['2xs'],
    // Floating pill positioning
    position: 'absolute' as const,
    bottom: Math.max(bottomInset, 0) + 8,
    left: 16,
    right: 16,
    borderRadius: 32,
    // Elevated shadow for floating feel
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: theme.mode === 'dark' ? 0.35 : 0.10,
    shadowRadius: 20,
    elevation: 14,
  },

  tabBarItemStyle: {
    // No horizontal margin — with 7 tabs every px counts so labels don't truncate.
    marginHorizontal: 0,
    marginVertical: 0,
    borderRadius: theme.radius.lg,
  },

  tabBarActiveBackgroundColor: 'transparent',
  tabBarActiveTintColor: theme.colors.tabActive,
  tabBarInactiveTintColor: theme.colors.tabInactive,

  tabBarIconStyle: {
    marginTop: 0,
  },

  tabBarLabelStyle: {
    fontFamily: theme.typography.family.bodySemiBold,
    // 11px (below the xs token of 13) so 7 labels fit without truncation.
    fontSize: 11,
    marginTop: theme.spacing['5xs'],
    marginBottom: 0,
  },

  tabIconContainer: {
    paddingHorizontal: theme.spacing['3xs'],
    paddingVertical: theme.spacing['5xs'],
    borderRadius: theme.radius.full,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
});

export function useTabBarTheme() {
  const theme = useAppThemeContext();
  const insets = useSafeAreaInsets();
  const tabBarOptions = useMemo(
    () => createTabBarOptions(theme, insets.bottom),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, insets.bottom],
  );
  return { theme, tabBarOptions };
}
