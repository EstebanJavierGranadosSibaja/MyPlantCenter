import React, { useMemo } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUITheme } from '../../theme/UIThemeContext';

// ─────────────────────────────────────────────────────────────────────────────

type SafeEdge = 'top' | 'bottom' | 'left' | 'right';

export interface ScreenProps {
  children: React.ReactNode;
  /**
   * Wraps content in a ScrollView.
   * Use for screens whose content may exceed the viewport.
   */
  scroll?: boolean;
  /**
   * Safe area edges to respect.
   * Defaults to all edges. Pass [] to opt out completely.
   */
  edges?: SafeEdge[];
  /** Override the screen background. Defaults to theme bg. */
  bgColor?: string;
  /** Style applied to the root SafeAreaView. */
  style?: StyleProp<ViewStyle>;
  /** Style applied to the content container (ScrollView or inner View). */
  contentStyle?: StyleProp<ViewStyle>;
  /** Pull-to-refresh: whether refresh is in progress. Requires scroll={true}. */
  refreshing?: boolean;
  /** Pull-to-refresh: callback fired when user pulls down. Requires scroll={true}. */
  onRefresh?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────

export const Screen = React.memo(function Screen({
  children,
  scroll = false,
  edges = ['top', 'bottom', 'left', 'right'],
  bgColor,
  style,
  contentStyle,
  refreshing,
  onRefresh,
}: ScreenProps) {
  const theme = useUITheme();

  const resolvedBg = bgColor ?? theme.colors.bg;

  const rootStyle = useMemo<ViewStyle>(
    () => ({ ...styles.root, backgroundColor: resolvedBg }),
    [resolvedBg],
  );

  const refreshControl = onRefresh ? (
    <RefreshControl
      refreshing={refreshing ?? false}
      onRefresh={onRefresh}
      tintColor={theme.colors.accent}
      colors={[theme.colors.accent]}
    />
  ) : undefined;

  const body = scroll ? (
    <ScrollView
      style={styles.fill}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      refreshControl={refreshControl}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, contentStyle]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView edges={edges} style={[rootStyle, style]}>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={resolvedBg}
        translucent={Platform.OS === 'android'}
      />
      {body}
    </SafeAreaView>
  );
});

// Static styles — never recreated
const styles = StyleSheet.create({
  root:          { flex: 1 },
  fill:          { flex: 1 },
  scrollContent: { flexGrow: 1 },
});
