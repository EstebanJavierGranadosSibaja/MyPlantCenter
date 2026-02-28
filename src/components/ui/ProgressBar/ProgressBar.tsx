import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors }     from '../../../theme/colors';
import { textStyles } from '../../../theme/typography';

// ── Props ─────────────────────────────────────────────────────────────────────

interface ProgressBarProps {
  value:             number;    // valor actual, ej: 840
  max?:              number;    // valor máximo, ej: 1000 — por defecto 100
  height?:           number;    // grosor de la barra — por defecto 6
  color?:            string;    // color del relleno
  trackColor?:       string;    // color del fondo de la barra
  showLabels?:       boolean;   // mostrar textos arriba de la barra
  labelLeft?:        string;    // texto izquierda, ej: "JARDINERA EXPERTA"
  labelRight?:       string;    // texto derecha, ej: "840/1000 XP"
  animDuration?:     number;    // duración animación en ms — por defecto 1200
  animDelay?:        number;    // delay antes de animar en ms — por defecto 0
}

// ── Componente base ───────────────────────────────────────────────────────────

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max          = 100,
  height       = 6,
  color,
  trackColor,
  showLabels   = false,
  labelLeft,
  labelRight,
  animDuration = 1200,
  animDelay    = 0,
}) => {


  const pct = Math.min(Math.max(value / max, 0), 1);

  // Empezamos en 0 — la animación lo llevará al valor real
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      animDelay,
      withTiming(pct, {
        duration: animDuration,
        easing:   Easing.out(Easing.cubic),
      }),
    );
  }, [pct]);
  // Se re-ejecuta si pct cambia — por ejemplo si el usuario gana XP

  // El ancho de la barra animada va de '0%' a 'X%'
  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%` as any,
    // "as any" porque TypeScript espera un número pero necesitamos un string con %
  }));

  const fillColor  = color      ?? colors.accent;
  const trackCol   = trackColor ?? colors.border;
  // ?? es nullish coalescing — si color es null/undefined usa el valor por defecto

  return (
    <View>

      {/* Labels opcionales arriba de la barra */}
      {showLabels && (labelLeft || labelRight) && (
        <View style={styles.labelRow}>
          {labelLeft  && <Text style={styles.labelText}>{labelLeft}</Text>}
          {labelRight && <Text style={styles.labelText}>{labelRight}</Text>}
        </View>
      )}

      {/* Track — el fondo gris de la barra */}
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: trackCol,
            borderRadius:    height,
          },
        ]}
      >
        {/* Fill — la parte coloreada que se anima */}
        <Animated.View
          style={[
            styles.fill,
            fillStyle,
            {
              height,
              borderRadius:    height,
              backgroundColor: fillColor,
            },
          ]}
        />
      </View>

    </View>
  );
};

// ── Variante XP ───────────────────────────────────────────────────────────────

export const XPBar: React.FC<{
  xp:     number;
  xpMax:  number;
  delay?: number;
}> = ({ xp, xpMax, delay = 400 }) => (
  <ProgressBar
    value        = {xp}
    max          = {xpMax}
    height       = {6}
    color        = {colors.accentSoft}
    trackColor   = "rgba(255,255,255,0.1)"
    animDuration = {1400}
    animDelay    = {delay}
  />
);

// ── Variante Health ───────────────────────────────────────────────────────────

export const HealthBar: React.FC<{
  health:   number;    // 0 a 100
  height?:  number;
}> = ({ health, height = 4 }) => {

  // El color de la barra depende de qué tan saludable está la planta
  const healthColor =
    health >= 85 ? colors.success :   // verde — saludable
    health >= 65 ? colors.warning :   // naranja — necesita atención
                   colors.error;      // rojo — en peligro

  return (
    <ProgressBar
      value        = {health}
      height       = {height}
      color        = {healthColor}
      animDuration = {800}
    />
  );
};

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  track: {
    width:    '100%',
    overflow: 'hidden',
    // overflow hidden recorta el fill animado para que no salga del track
  },
  fill: {
    position: 'absolute',
    // absolute para que el fill se superponga al track
    left:     0,
    top:      0,
  },
  labelRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginBottom:   6,
  },
  labelText: {
    ...textStyles.caption,
    color: colors.textMuted,
  },
});