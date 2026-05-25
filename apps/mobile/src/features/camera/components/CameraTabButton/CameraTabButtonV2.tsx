import { Feather } from '@expo/vector-icons';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

export function CameraTabButtonV2({ style }: BottomTabBarButtonProps) {
  const theme = useUITheme();
  const navigation = useNavigation();

  return (
    // Apply the tab bar's own flex/position style so the slot is measured
    // correctly, then overlay our centering on top.
    <Pressable
      onPress={() => navigation.getParent()?.navigate('CameraScan' as never)}
      accessibilityRole="button"
      accessibilityLabel="Escanear con cámara"
      style={[style, styles.slot]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.button,
            {
              backgroundColor: pressed ? theme.colors.accentDark : theme.colors.accent,
              borderColor:      theme.colors.surface,
            },
          ]}
        >
          <Feather name="camera" size={theme.layout.iconMd} color={theme.colors.textInverse} />
        </View>
      )}
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Fills the tab slot and floats the button above the pill bar.
  // zIndex ensures the circle renders above adjacent tab icons when it overflows.
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    zIndex: 10,
    elevation: 10,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 8,
  },
});
