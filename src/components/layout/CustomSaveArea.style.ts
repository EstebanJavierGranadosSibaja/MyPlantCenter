import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/context/ThemeContext';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    backgroundColor: "white",
  }
})

export const createUserStyles = (theme: ReturnType<typeof useAppThemeContext>) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing["6xl"],
    }
  });