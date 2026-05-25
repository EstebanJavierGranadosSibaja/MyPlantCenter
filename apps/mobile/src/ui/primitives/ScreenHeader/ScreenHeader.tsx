import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useUITheme } from '../../theme/UIThemeContext';
import { Text } from '../Text/Text';

// ─────────────────────────────────────────────────────────────────────────────

export interface ScreenHeaderProps {
  title: string;
  /** Optional element anchored to the right (icon button, badge, etc.) */
  rightSlot?: React.ReactNode;
}

// ─────────────────────────────────────────────────────────────────────────────

export function ScreenHeader({ title, rightSlot }: ScreenHeaderProps) {
  const theme = useUITheme();
  return (
    <View style={[styles.row, { paddingHorizontal: theme.layout.screenPaddingH }]}>
      <Text variant="h2" style={styles.title}>{title}</Text>
      {rightSlot}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 12,
    minHeight: 52,
  },
  title: {
    flex: 1,
  },
});
