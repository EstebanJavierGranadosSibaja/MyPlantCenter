import { Feather } from '@expo/vector-icons';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { useCameraTabButtonTheme } from './CameraTabButton.styles';

export const CameraTabButton: React.FC<BottomTabBarButtonProps> = ({ accessibilityState }) => {
  const { styles } = useCameraTabButtonTheme();
  const navigation = useNavigation();
  const focused = Boolean(accessibilityState?.selected);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.getParent()?.navigate('CameraScan' as never)}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Escanear con cámara"
        style={[
          styles.button,
          focused && styles.buttonPressed,
        ]}
      >
        <Feather name="camera" size={styles.cameraIcon.size} color={styles.cameraIcon.color} />
      </TouchableOpacity>
    </View>
  );
};
