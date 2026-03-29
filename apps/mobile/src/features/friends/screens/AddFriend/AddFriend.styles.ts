import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';

export const createAddFriendStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({
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

  card: {
    backgroundColor: theme.colors.cardBg,
    borderColor: theme.colors.cardBorder,
    borderWidth: theme.borders.thin,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },

  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size['3xl'],
  },

  subtitle: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.lg,
  },

  input: {
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    borderWidth: theme.borders.base,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size['2xl'],
    letterSpacing: theme.spacing['3xs'],
  },

  button: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },

  buttonText: {
    color: theme.colors.textInverse,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.xl,
  },
});

export function useAddFriendTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createAddFriendStyles(theme) };
}
