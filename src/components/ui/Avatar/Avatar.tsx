import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors }          from '../../../theme/colors';
import { radius, shadows } from '../../../theme/spacing';

// ── Props ─────────────────────────────────────────────────────────────────────

interface AvatarProps {
  uri?:             string;   // URL de la foto — opcional
  emoji?:           string;   // emoji de respaldo si no hay foto
  size?:            number;   // tamaño del avatar en px — por defecto 80
  showLevelBadge?:  boolean;  // mostrar badge de nivel
  level?:           number;   // número de nivel para el badge
}

// ── Componente ────────────────────────────────────────────────────────────────

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  emoji           = '🌿',
  size            = 80,
  showLevelBadge  = false,
  level,
}) => {

  // Calculamos valores derivados del size
  // Así el avatar escala proporcionalmente sin importar qué tamaño reciba
  const borderRad  = size * 0.3;     // 30% del tamaño = esquinas redondeadas
  const emojiSize  = size * 0.45;    // el emoji ocupa 45% del tamaño total

  return (
    // position: 'relative' en el contenedor permite que los hijos usen position: 'absolute' para posicionarse encima
    <View style={{ position: 'relative', width: size, height: size }}>

      {/* ── Círculo principal ── */}
      <View
        style={[
          styles.container,
          {
            width:        size,
            height:       size,
            borderRadius: borderRad,
          },
          shadows.hero,
        ]}
      >
        {uri ? (
          // Si tiene URL → mostramos la imagen real
          <Image
            source={{ uri }}
            style={{
              width:        '100%',
              height:       '100%',
              borderRadius: borderRad,
            }}
            resizeMode="cover"
          />
        ) : (
          // Si no tiene URL → mostramos el emoji
          <Text style={{ fontSize: emojiSize }}>
            {emoji}
          </Text>
        )}
      </View>

      {/* ── Punto de estado online ── */}
      {/* Se posiciona en la esquina inferior derecha del avatar */}
      <View
        style={[
          styles.onlineDot,
          {
            width:       size * 0.18,
            height:      size * 0.18,
            borderRadius: size * 0.09,  
            bottom:      -(size * 0.05), // sale un poco hacia abajo
            right:       -(size * 0.05), // sale un poco hacia la derecha
            borderWidth: size * 0.025,   // borde proporcional al tamaño
          },
        ]}
      />

      {/* ── Badge de nivel ── */}
      {/* Solo se muestra si showLevelBadge es true Y level tiene valor */}
      {showLevelBadge && level !== undefined && (
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>
            Nv {level}
          </Text>
        </View>
      )}

    </View>
  );
};

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.accent,
    alignItems:      'center',
    justifyContent:  'center',
    overflow:        'hidden',
    // overflow hidden recorta la imagen para que respete el borderRadius
  },
  onlineDot: {
    position:        'absolute',
    backgroundColor: colors.accentSoft,   // verde dorado
    borderColor:     colors.primary,      // borde oscuro para separarlo del avatar
  },
  levelBadge: {
    position:          'absolute',
    bottom:            -6,
    right:             -6,
    backgroundColor:   colors.primary,    // fondo verde oscuro
    borderColor:       colors.accentSoft, // borde dorado
    borderWidth:       2,
    borderRadius:      radius.sm,
    paddingHorizontal: 6,
    paddingVertical:   2,
  },
  levelText: {
    fontSize:      9,
    fontWeight:    '700',
    color:         colors.accentSoft,
    letterSpacing: 0.4,
  },
});