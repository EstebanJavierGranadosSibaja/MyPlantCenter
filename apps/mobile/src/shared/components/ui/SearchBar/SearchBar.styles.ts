import { StyleSheet } from 'react-native';
import { useUITheme } from 'src/ui';

export function useSearchBarTheme() {
  const theme = useUITheme();

  const styles = StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 44,
      backgroundColor: theme.colors.bgSubtle,
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.borderDefault,
      paddingHorizontal: 12,
      gap: 8,
    },
    focused: {
      borderColor: theme.colors.accent,
    },
    input: {
      flex: 1,
      fontSize: 15,
      fontWeight: '400',
      color: theme.colors.textPrimary,
      paddingVertical: 0,
    },
    clearButton: {
      padding: 4,
    },
  });

  return { theme, styles };
}
