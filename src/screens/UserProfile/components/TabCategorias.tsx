import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { CategoryBadge } from '../../../components/plant/CategoryBadge/CategoryBadge';

import { colors }               from '../../../theme/colors';
import { textStyles }           from '../../../theme/typography';
import { radius, spacing, layout } from '../../../theme/spacing';

import { PlantCategory } from '../../../types-dtos/user.types';

// ── Props ─────────────────────────────────────────────────────────────────────

interface TabCategoriasProps {
  categorias:      PlantCategory[];
  cantidadPlantas: number;
}

// ── Componente ────────────────────────────────────────────────────────────────

export const TabCategorias: React.FC<TabCategoriasProps> = ({
  categorias,
  cantidadPlantas,
}) => {

  const maxCantidad = Math.max(...categorias.map(c => c.cantidad));

  return (
    <>
      {/* ── Lista de categorías ── */}
      <View style={styles.section}>
        <SectionHeader
          title={`Colección · ${cantidadPlantas} plantas`}
        />
        <View style={styles.categoryList}>
          {categorias.map((cat, index) => (
            <CategoryBadge
              key={cat.id}
              category={cat}
              maxAmount={maxCantidad}
              index={index}
            />
          ))}
        </View>
      </View>

      <SectionDivider />

      {/* ── Gráfico de distribución ── */}
      <View style={styles.section}>
        <SectionHeader title="Distribución" />
        <View style={styles.chartContainer}>

          {/* Barras */}
          <View style={styles.chartBars}>
            {categorias.map(cat => {

              // Altura proporcional al máximo
              // Si cat.cantidad = 14 y maxCantidad = 14 → altura = 70px (100%)
              // Si cat.cantidad = 7  y maxCantidad = 14 → altura = 35px (50%)
              const barHeight = Math.max(
                (cat.cantidad / maxCantidad) * layout.chartHeight * 0.875,
                layout.chartBarMin,
              );

              return (
                <View key={cat.id} style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height:          barHeight,
                        backgroundColor: cat.color,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>

          {/* Emojis debajo de cada barra */}
          <View style={styles.chartEmojis}>
            {categorias.map(cat => (
              <View key={cat.id} style={styles.barWrapper}>
                <Text style={styles.chartEmoji}>{cat.emoji}</Text>
              </View>
            ))}
          </View>

        </View>
      </View>
    </>
  );
};

// ── Componentes internos ──────────────────────────────────────────────────────

const SectionDivider = () => <View style={styles.divider} />;

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
);

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: layout.screenH,
    paddingVertical:   spacing[5],
  },
  divider: {
    height:           1,
    marginHorizontal: layout.screenH,
    backgroundColor:  colors.border,
  },
  sectionTitle: {
    ...textStyles.caption,
    color:        colors.textMuted,
    marginBottom: spacing[3] + 2,
  },

  // Lista
  categoryList: {
    gap: spacing[3] - 2,
  },

  // Gráfico
  chartContainer: {
    backgroundColor: colors.cardBg,
    borderRadius:    radius.lg,
    padding:         spacing[4],
    borderWidth:     1.5,
    borderColor:     colors.border,
  },
  chartBars: {
    flexDirection: 'row',
    height:        layout.chartHeight,
    alignItems:    'flex-end',
    gap:           spacing[1] + 2,
    marginBottom:  spacing[2],
  },
  barWrapper: {
    flex:       1,
    alignItems: 'center',
    gap:        spacing[1],
  },
  bar: {
    width:        '100%',
    borderRadius: layout.chartBarRadius,
  },
  chartEmojis: {
    flexDirection: 'row',
  },
  chartEmoji: {
    fontSize:   spacing[3] + 1,   // 13
    lineHeight: spacing[4],       // 16
    textAlign:  'center',
  },
});