import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';

import { colors }  from '../../../theme/colors';
import { textStyles } from '../../../theme/typography';

// ── Props ─────────────────────────────────────────────────────────────────────

interface ToggleProps {
  value:        boolean;              // estado actual: true = activado
  onChange:     (next: boolean) => void;  // función que se llama al cambiar
  label:        string;               // texto a la izquierda del switch
  description?: string;               // texto pequeño debajo del label
  disabled?:    boolean;              // si está desactivado
}

// ── Constantes ────────────────────────────────────────────────────────────────
// Medidas del switch

const TRACK_W   = 44;   // ancho del track (la pista)
const TRACK_H   = 24;   // alto del track
const THUMB_SZ  = 18;   // tamaño del círculo (thumb)
const THUMB_OFF = 3;    // offset desde los bordes
const DURATION  = 220;  // duración de la animación en ms

// ── Componente ────────────────────────────────────────────────────────────────

export const Toggle: React.FC<ToggleProps> = ({
  value,
  onChange,
  label,
  description,
  disabled = false,
}) => {

  // useSharedValue es como useState pero para animaciones.
  // 0 = apagado, 1 = encendido
  // Lo inicializamos según el value que recibimos
  const progress = useSharedValue(value ? 1 : 0);

  // useEffect observa cambios en "value".
  // Cada vez que value cambia desde afuera, sincronizamos la animación.
  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: DURATION });
    // withTiming anima el cambio suavemente en DURATION milisegundos
    // Sin withTiming, el cambio sería instantáneo (sin animación)
  }, [value]);

  const handlePress = () => {
    if (disabled) return;
    onChange(!value);
    // Llamamos onChange con el valor opuesto
    // El padre decide si realmente cambia, el Toggle no maneja su propio estado
  };

  // useAnimatedStyle crea estilos que se actualizan automáticamente cuando progress.value cambia,sin rerenderizar el componente
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: withTiming(
        // Si progress es 1 (encendido): mueve el thumb a la derecha
        // Si progress es 0 (apagado): mueve el thumb a la izquierda
        progress.value === 1
          ? TRACK_W - THUMB_SZ - THUMB_OFF 
          : THUMB_OFF,                       
        { duration: DURATION }
      ),
    }],
    backgroundColor: value
      ? colors.toggleThumbActive    // dorado cuando está activo
      : colors.toggleThumbInactive, // gris cuando está inactivo
  }));

  // interpolateColor convierte el valor numérico (0 o 1) en un color
  // 0 → toggleInactive (gris claro)
  // 1 → toggleActive (verde)
  // Los valores intermedios (0.5) son una mezcla de ambos colores
  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.toggleInactive, colors.toggleActive],
    ),
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled}
      style={[styles.row, disabled && styles.disabled]}
    >
      {/* Texto a la izquierda */}
      <View style={styles.textGroup}>
        <Text style={styles.label}>{label}</Text>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>

      {/* El switch animado */}
      <Animated.View style={[styles.track, trackStyle]}>
        {/* Animated.View es como View pero puede recibir estilos animados */}
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>

    </TouchableOpacity>
  );
};

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    // space-between empuja los hijos a los extremos:
    // el texto va a la izquierda, el switch a la derecha
  },
  textGroup: {
    flex:        1,
    // flex: 1 hace que ocupe todo el espacio disponible empuja el switch al extremo derecho
    marginRight: 12,
  },
  label: {
    ...textStyles.body,
    // ...textStyles.body copia todas las propiedades de ese objeto
    // Es el spread operator aplicado a estilos
    color:      colors.textPrimary,
    fontWeight: '500',
  },
  description: {
    ...textStyles.bodySmall,
    color:      colors.textMuted,
    marginTop:  4,
  },
  track: {
    width:          TRACK_W,
    height:         TRACK_H,
    borderRadius:   TRACK_H / 2,  // la mitad del alto = cápsula perfecta
    justifyContent: 'center',
    flexShrink:     0,
    // flexShrink: 0 evita que el track se encoja si el texto es muy largo
  },
  thumb: {
    position:     'absolute',
    // position absolute saca el elemento del flujo normal, se posiciona manualmente con translateX en la animación
    width:        THUMB_SZ,
    height:       THUMB_SZ,
    borderRadius: THUMB_SZ / 2, 
    shadowColor:  '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius:  4,
    elevation:     3,
  },
  disabled: {
    opacity: 0.45, 
  },
});