import { Feather } from '@expo/vector-icons';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';

export const CameraTabButton: React.FC<BottomTabBarButtonProps> = ({ accessibilityState }) => {
  const navigation = useNavigation();
  const theme = useAppThemeContext();
  const focused = Boolean(accessibilityState?.selected);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: -theme.spacing['2xl'] }}>
      <TouchableOpacity
        onPress={() => navigation.getParent()?.navigate('CameraScan' as never)}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Escanear con cámara"
        style={{
          width: theme.spacing['5xl'] + theme.spacing.md,
          height: theme.spacing['5xl'] + theme.spacing.md,
          borderRadius: theme.radius.full,
          backgroundColor: theme.colors.accent,
          borderWidth: theme.borders.bold,
          borderColor: theme.colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: theme.shadows.lg.color,
          shadowOffset: theme.shadows.lg.offset,
          shadowOpacity: theme.shadows.lg.opacity,
          shadowRadius: theme.shadows.lg.radius,
          elevation: theme.shadows.lg.elevation,
        }}
      >
        <Feather name="camera" size={theme.typography.size['3xl']} color={theme.colors.textInverse} />
      </TouchableOpacity>

      <Text
        style={{
          marginTop: theme.spacing.xs,
          color: focused ? theme.colors.accent : theme.colors.textMuted,
          fontFamily: theme.typography.family.bodySemiBold,
          fontSize: theme.typography.size.xs,
        }}
      >
        IA
      </Text>
    </View>
  );
};
