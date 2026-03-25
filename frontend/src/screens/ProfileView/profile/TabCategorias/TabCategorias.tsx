import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { CategoryBadge } from 'src/components/plant/CategoryBadge/CategoryBadge';
import { UserProfile } from 'src/types-dtos/user.types';
import { useTabCategoriasTheme } from './TabCategorias.styles';

interface TabCategoriasProps {
  profile: UserProfile;
}

export const TabCategorias: React.FC<TabCategoriasProps> = ({ profile }) => {
  const { theme, styles } = useTabCategoriasTheme();

  const maxAmount = Math.max(
    ...profile.categories.map(c => c.amount),
  );

  return (
    <View style={styles.container}>

      {/* ── Lista de categorías ── */}
      <View>
        <Text style={styles.sectionTitle}>Mis categorías</Text>
        <View style={styles.list}>
          {profile.categories.map((cat, index) => (
            <CategoryBadge
              key={cat.id}
              category={cat}
              maxAmount={maxAmount}
              index={index}
            />
          ))}
        </View>
      </View>

      {/* ── Gráfico de barras ── */}
      <View>
        <Text style={styles.sectionTitle}>Distribución</Text>
        <View style={styles.chartContainer}>
          <View style={styles.chartBars}>
            {profile.categories.map(cat => {
              const heightPct = cat.amount / maxAmount;
              return (
                <View key={cat.id} style={styles.chartBarWrapper}>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height:          theme.layout.chartHeight * heightPct,
                        backgroundColor: cat.color,
                        minHeight:       theme.layout.chartBarMin,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>

          {/* Icons below bars */}
          <View style={{ flexDirection: 'row', gap: theme.spacing.xs + 2 }}>
            {profile.categories.map(cat => (
              <View key={cat.id} style={{ flex: 1, alignItems: 'center' }}>
                <Feather name={cat.iconName} size={theme.typography.size.lg} color={cat.color} />
              </View>
            ))}
          </View>
        </View>
      </View>

    </View>
  );
};