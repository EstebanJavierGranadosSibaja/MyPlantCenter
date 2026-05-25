import React, { useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUITheme } from '../../theme/UIThemeContext';

// ─────────────────────────────────────────────────────────────────────────────
// KeyboardScreen — layout for forms and input-heavy screens.
//
// Architecture decisions:
//   • KeyboardAvoidingView with behavior="padding" on iOS,
//     behavior="height" on Android. This is the stable combination.
//   • ScrollView with keyboardShouldPersistTaps="handled" so taps on
//     non-input elements don't dismiss the keyboard unexpectedly.
//   • Safe area is applied OUTSIDE KeyboardAvoidingView so the bottom
//     inset isn't doubled when the keyboard appears.
//   • No setTimeout, no blur() calls — keyboard management is purely
//     declarative here. Focus chain is handled by individual TextField props.
// ─────────────────────────────────────────────────────────────────────────────

type SafeEdge = 'top' | 'bottom' | 'left' | 'right';

export interface KeyboardScreenProps {
  children: React.ReactNode;
  edges?: SafeEdge[];
  bgColor?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  /** Extra padding added above the keyboard on iOS. Default: 0. */
  keyboardOffset?: number;
}

// ─────────────────────────────────────────────────────────────────────────────

export const KeyboardScreen = React.memo(function KeyboardScreen({
  children,
  edges = ['top', 'left', 'right'],
  bgColor,
  style,
  contentStyle,
  keyboardOffset = 0,
}: KeyboardScreenProps) {
  const theme = useUITheme();

  const resolvedBg = bgColor ?? theme.colors.bg;

  const rootStyle = useMemo<ViewStyle>(
    () => ({ ...styles.root, backgroundColor: resolvedBg }),
    [resolvedBg],
  );

  return (
    <SafeAreaView edges={edges} style={[rootStyle, style]}>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={resolvedBg}
        translucent={Platform.OS === 'android'}
      />
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}
      >
        <ScrollView
          style={styles.fill}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          bounces={true}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  root:          { flex: 1 },
  fill:          { flex: 1 },
  scrollContent: { flexGrow: 1 },
});
