import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useToggleTheme } from './Toggle.styles';

// Props
interface ToggleProps {
  value: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

// Componente 
export const Toggle: React.FC<ToggleProps> = ({
  value,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  const { theme, styles } = useToggleTheme();

  const TRACK_W = theme.layout.toggleTrackW;
  const THUMB_SZ = theme.layout.toggleThumbSz;
  const THUMB_OFF = theme.layout.toggleThumbOff;
  const DURATION = 220; // 220ms

  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: DURATION });
  }, [DURATION, progress, value]);

  const handlePress = () => {
    if (disabled) return;
    onChange(!value);
  };

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: withTiming(
        progress.value === 1
          ? TRACK_W - THUMB_SZ - THUMB_OFF
          : THUMB_OFF,
        { duration: DURATION },
      ),
    }],
    backgroundColor: value
      ? theme.colors.toggleThumbActive
      : theme.colors.toggleThumbInactive,
  }));

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.toggleInactive, theme.colors.toggleActive],
    ),
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled}
      style={[styles.row, disabled && styles.disabled]}
    >

      <View style={styles.textGroup}>
        <Text style={styles.label}>{label}</Text>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>

      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>

    </TouchableOpacity>
  );
};