import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors }     from '../../../theme/colors';
import { textStyles } from '../../../theme/typography';
import { radius, spacing } from '../../../theme/spacing';

// ── Props ─────────────────────────────────────────────────────────────────────

interface BadgeProps {
  label:   string;           // texto del badge — obligatorio
  emoji?:  string;           // ícono — opcional
  color?:  string;           // color del badge — opcional, tiene valor por defecto
  size?:   'sm' | 'md';     // tamaño — opcional, tiene valor por defecto
}

// ── Componente ────────────────────────────────────────────────────────────────

export const Badge: React.FC<BadgeProps> = ({
  label,
  emoji,
  color = colors.accent,   // si no pasan color, usa el verde sage por defecto
  size  = 'md',            // si no pasan size, usa 'md' por defecto
}) => {

  const isSmall = size === 'sm';
  // Variable local — true si el tamaño es pequeño, false si no

  return (
    // Todo componente devuelve JSX dentro de un return ( ) los paréntesis permiten escribir JSX en múltiples líneas

    <View
      style={[
        styles.container,
        // style puede recibir un array de estilos — los combina todos
        {
          backgroundColor: color + '18',
          borderColor: color + '44',
          paddingHorizontal: isSmall ? spacing[2] : spacing[3],
          paddingVertical:   isSmall ? 2 : spacing[1],
          // operador ternario: condición ? valorSiTrue : valorSiFalse
        },
      ]}
    >
      {emoji && (
        // {emoji && ...} significa "si emoji existe, muestra esto"
        // Si emoji es undefined (no se pasó), no muestra nada
        <Text style={{ fontSize: isSmall ? 10 : 12 }}>
          {emoji}
        </Text>
      )}

      <Text
        style={[
          textStyles.label,          // estilos base de tipografía
          { color, fontSize: isSmall ? 10 : 11 },
        ]}
      >
        {label}
      </Text>

    </View>
  );
};

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',      // los hijos se acomodan en fila (horizontal)
    alignItems:    'center',   // centrados verticalmente
    alignSelf:     'flex-start', // el badge solo ocupa el ancho de su contenido
    borderRadius:  radius.full,  // completamente redondeado = píldora
    borderWidth:   1,
    gap:           4,          // espacio entre el emoji y el texto
  },
});