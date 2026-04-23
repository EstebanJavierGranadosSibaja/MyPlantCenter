import React from 'react';
import { Text, View } from 'react-native';
import { CategoryBadge } from 'src/features/profile/components/CategoryBadge/CategoryBadge';
import { UserProfile } from 'src/features/profile/types/user.types';
import { EmptyState } from 'src/shared/components/feedback/EmptyState/EmptyState';
import { useTabCategoriasTheme } from './TabCategorias.styles';

interface TabCategoriasProps {
  profile: UserProfile;
}

export const TabCategorias: React.FC<TabCategoriasProps> = ({ profile }) => {
  const { styles } = useTabCategoriasTheme();

  if (profile.categories.length === 0) {
    return (
      <EmptyState
        iconName="grid"
        title="Sin categorías"
        subtitle="Agrega tu primera categoría de plantas"
      />
    );
  }

  const maxAmount = Math.max(
    ...profile.categories.map(c => c.amount),
  );

  return (
    <View style={styles.container}>

      {/* ── Lista de categorías ── */}
      <View>
        <Text style={styles.sectionTitle}>Mis categorías</Text>
        <View style={styles.listCard}>
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
      </View>

      {/* ── Gráfico de barras ── */}
      <View>
        <Text style={styles.sectionTitle}>Distribución</Text>
        <View style={styles.chartContainer}>
          {profile.categories.map(cat => {
            const widthPct = Math.max(0.12, cat.amount / maxAmount);
            return (
              <View key={cat.id} style={styles.chartRow}>
                <Text style={styles.chartRowLabel} numberOfLines={1}>{cat.name}</Text>

                <View style={styles.chartTrack}>
                  <View
                    style={[
                      styles.chartFill,
                      {
                        width: `${widthPct * 100}%`,
                        backgroundColor: cat.color,
                      },
                    ]}
                  />
                </View>

                <Text style={styles.chartRowValue}>{cat.amount}</Text>
              </View>
            );
          })}
        </View>
      </View>

    </View>
  );
};