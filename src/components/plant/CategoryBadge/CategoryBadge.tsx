import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import { PlantCategory }       from '../../../types-dtos/user.types';
import { colors }              from '../../../theme/colors';
import { textStyles }          from '../../../theme/typography';
import { radius, shadows, spacing } from '../../../theme/spacing';

// ── Props ─────────────────────────────────────────────────────────────────────

interface CategoryBadgeProps {
  category:  PlantCategory;  // los datos de la categoría
  maxAmount: number;         // la cantidad más alta entre todas las categoría para calcular la proporción de la barra
  index?:    number;         // posición en la lista, para el delay escalonado
}

// ── Componente ────────────────────────────────────────────────────────────────

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  maxAmount,
  index = 0,
}) => {

  const pct = Math.min(category.cantidad / maxAmount, 1);

  const barProgress = useSharedValue(0);

  useEffect(() => {
    // Cada badge anima su barra con un delay escalonado
    // index 0 → empieza a los 300ms
    // index 1 → empieza a los 380ms (300 + 1*80)
    // index 2 → empieza a los 460ms (300 + 2*80)
    // Esto crea el efecto de que las barras aparecen una por una
    barProgress.value = withDelay(
      300 + index * 80,
      withTiming(pct, {
        duration: 900,
        easing:   Easing.out(Easing.cubic),
      }),
    );
  }, [pct]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${barProgress.value * 100}%` as any,
  }));

  return (
    <View style={[styles.container, shadows.sm]}>

      {/* ── Ícono de la categoría ── */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: category.color + '22' },
        ]}
      >
        <Text style={styles.emoji}>{category.emoji}</Text>
      </View>

      {/* ── Nombre y barra de progreso ── */}
      <View style={styles.content}>

        <Text style={styles.name}>{category.nombre}</Text>

        {/* Track de la barra */}
        <View style={styles.track}>
          <Animated.View
            style={[
              styles.fill,
              barStyle,
              { backgroundColor: category.color },
            ]}
          />
        </View>

      </View>

      {/* ── Cantidad ── */}
      <Text style={[styles.count, { color: category.color }]}>
        {category.cantidad}
      </Text>
    </View>
  );
};

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            spacing[3],       // 12 entre cada sección
    backgroundColor: colors.cardBg,
    borderRadius:   radius.md,        // 14
    borderWidth:    1.5,
    borderColor:    colors.border,
    padding:        spacing[3],       // 12
  },
  iconContainer: {
    width:          36,
    height:         36,
    borderRadius:   radius.sm,        // 10
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
    // flexShrink: 0 evita que el ícono se encoja si el nombre de la categoría es muy largo
  },
  emoji: {
    fontSize:   18,
    lineHeight: 22,
  },
  content: {
    flex: 1,
    gap:  6,
  },
  name: {
    ...textStyles.cardTitle,
    color: colors.textPrimary,
  },
  track: {
    height:          4,
    backgroundColor: colors.border,
    borderRadius:    4,
    overflow:        'hidden',
  },
  fill: {
    position:     'absolute',
    top:          0,
    left:         0,
    height:       '100%',
    borderRadius: 4,
  },
  count: {
    ...textStyles.statValue,
    fontSize:   16,
    flexShrink: 0,
  },
});