import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createAvatarStyles = (theme: AppTheme) => StyleSheet.create({

  wrapper: {
    position: 'relative',
  },

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
    fontFamily: theme.typography.family.bodyBold,
    fontSize: theme.typography.size.xs,
    color: theme.colors.textInverse,
    letterSpacing: theme.typography.letterSpacing.wide,
  },

});

export function useAvatarTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createAvatarStyles(theme) };
}
