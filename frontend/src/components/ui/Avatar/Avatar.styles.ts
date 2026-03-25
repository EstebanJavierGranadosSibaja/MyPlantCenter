import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';

export const createAvatarStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({

  container: {
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  onlineDot: {
    position: 'absolute',
    backgroundColor: theme.colors.accentSoft,
    borderColor: theme.colors.primary,
  },

  levelBadge: {
    position: 'absolute',
    bottom: theme.layout.avatarBadgeOffset,
    right: theme.layout.avatarBadgeOffset,
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.accentSoft,
    borderWidth: theme.borders.bold,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.xs + 2,
    paddingVertical: theme.spacing['4xs'] + 1,
  },

  levelText: {
    fontSize: theme.typography.size.xs - 1,
    fontWeight: '700' as const,
    color: theme.colors.accentSoft,
    letterSpacing: theme.spacing['3xs']
  },

});

export function useAvatarTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createAvatarStyles(theme) };
}
