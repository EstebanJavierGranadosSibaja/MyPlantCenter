import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useProgressBarTheme } from './ProgressBar.styles';

// Props

interface ProgressBarProps {
  value: number;    // valor actual
  max?: number;    // Maximo
  height?: number;    // grueso de la barra
  color?: string;
  trackColor?: string;
  showLabels?: boolean;   // mostrar textos arriba
  labelLeft?: string;
  labelRight?: string;
  animDuration?: number;
  animDelay?: number;
}

// Componente
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  height,
  color,
  trackColor,
  showLabels = false,
  labelLeft,
  labelRight,
  animDuration = 1200,
  animDelay = 0,
}) => {
  const { theme, styles } = useProgressBarTheme();

  const barHeight = height ?? theme.spacing.xs + 2;
  const fillColor = color ?? theme.colors.accent;
  const trackCol = trackColor ?? theme.colors.border;

  const pct = Math.min(Math.max(value / max, 0), 1);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      animDelay,
      withTiming(pct, {
        duration: animDuration,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [animDelay, animDuration, pct, progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%` as any,
  }));

  return (
    <View>

      {showLabels && (labelLeft || labelRight) && (
        <View style={styles.labelRow}>
          {labelLeft && <Text style={styles.labelText}>{labelLeft}</Text>}
          {labelRight && <Text style={styles.labelText}>{labelRight}</Text>}
        </View>
      )}

      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: trackCol,
            borderRadius: barHeight,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            fillStyle,
            {
              height,
              borderRadius: barHeight,
              backgroundColor: fillColor,
            },
          ]}
        />
      </View>

    </View>
  );
};

// Variante XP 
export const XPBar: React.FC<{
  xp: number;
  xpMax: number;
  delay?: number;
}> = ({ xp, xpMax, delay = 400 }) => {
  const { theme } = useProgressBarTheme();

  return (
    <ProgressBar
      value={xp}
      max={xpMax}
      height={theme.spacing.xs + 2}
      color={theme.colors.accentSoft}
      trackColor={theme.colors.trackColor}
      animDuration={1400}
      animDelay={delay}
    />
  );
};

// Variante Salud 
export const HealthBar: React.FC<{
  health: number;   // 0 a 100
  height?: number;
}> = ({ health, height }) => {
  const { theme } = useProgressBarTheme();

  const barHeight = height ?? theme.spacing.xs;

  // Color segun la salud de la plantsa
  const healthColor =
    health >= 85 ? theme.colors.success :   // verde
      health >= 65 ? theme.colors.warning :   // naranja
        theme.colors.error;      // rojo

  return (
    <ProgressBar
      value={health}
      height={barHeight}
      color={healthColor}
      animDuration={800}
    />
  );
};