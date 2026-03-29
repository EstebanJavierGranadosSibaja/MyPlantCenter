import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';

export const createFriendRequestsStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.backgroundAlt,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },

  row: {
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.cardBg,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },

  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xl,
  },

  subtitle: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.base,
  },

  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },

  buttonAccept: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },

  buttonText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.base,
  },

  buttonTextAccept: {
    color: theme.colors.textInverse,
  },

  emptyWrap: {
    paddingTop: theme.spacing.lg,
  },
});

export function useFriendRequestsTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createFriendRequestsStyles(theme) };
}
