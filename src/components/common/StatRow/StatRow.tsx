import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors }          from '../../../theme/colors';
import { textStyles }      from '../../../theme/typography';
import { radius, shadows, spacing } from '../../../theme/spacing';

// ── Types ─────────────────────────────────────────────────────────────────────

// Un StatItem describe UNA estadística individual
export interface StatItem {
  emoji: string;          // ícono visual, ej: "🌿"
  value: string | number; // valor, ej: 47 o "34d"
  label: string;          // etiqueta, ej: "Plantas"
}

interface StatRowProps {
  items:  StatItem[];   // array de estadísticas a mostrar
  style?: object;       // estilos opcionales desde el padre
}

// ── Componente principal ──────────────────────────────────────────────────────

export const StatRow: React.FC<StatRowProps> = ({ items, style }) => (
  <View style={[styles.row, style]}>
    {items.map((item, index) => (
      // map recorre el array y por cada item devuelve JSX
      <React.Fragment key={item.label}>

        <StatPill {...item} />

        {index < items.length - 1 && (
          <View style={styles.divider} />
        )}
      </React.Fragment>
    ))}
  </View>
);

// ── Sub-componente interno ────────────────────────────────────────────────────
// StatPill es un componente que solo usa StatRow, por eso vive en este mismo archivo. No lo exportamos porque nadie más necesita usarlo directamente.

const StatPill: React.FC<StatItem> = ({ emoji, value, label }) => (
  <View style={styles.pill}>

    {/* Emoji grande arriba */}
    <Text style={styles.emoji}>{emoji}</Text>

    {/* Número en Playfair Display */}
    <Text style={styles.value}>{value}</Text>

    {/* Etiqueta pequeña en mayúsculas */}
    <Text style={styles.label}>{label}</Text>

  </View>
);

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  row: {
    flexDirection:     'row',
    backgroundColor:   colors.surface,
    borderRadius:      radius.lg,       // 18 — esquinas bien redondeadas
    paddingVertical:   spacing[4],      // 16
    paddingHorizontal: spacing[2],      // 8
    borderWidth:       1.5,
    borderColor:       colors.border,
    ...shadows.md,
  },
  pill: {
    flex:       1,
    alignItems: 'center',
    gap:        4,
  },
  divider: {
    width:           1,
    backgroundColor: colors.border,
    marginVertical:  spacing[2], 
  },
  emoji: {
    fontSize:   18,
    lineHeight: 24,
  },
  value: {
    ...textStyles.statValue,
    color: colors.textPrimary,
  },
  label: {
    ...textStyles.caption,
    color: colors.textMuted,
  },
});