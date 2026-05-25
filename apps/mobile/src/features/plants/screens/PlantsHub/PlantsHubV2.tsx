import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from 'src/core/contexts/AuthContext';
import { RootStackParamList } from 'src/core/navigation/AppNavigator';
import { plantService } from 'src/features/plants/services/plant.service';
import { useUserProfile } from 'src/features/profile/hooks/useUserProfile';
import { ConfirmActionModal } from 'src/shared/components/feedback/ConfirmActionModal/ConfirmActionModal';
import { EmptyState } from 'src/shared/components/feedback/EmptyState/EmptyState';
import { showToast } from 'src/shared/components/feedback/FormToast/FormToast';
import { Skeleton } from 'src/shared/components/ui/Skeleton/Skeleton';
import { SearchBar } from 'src/shared/components/ui/SearchBar/SearchBar';
import { Button, Screen, ScreenHeader, Surface, Text, useUITheme } from 'src/ui';
import { PlantCardV2 } from './components/PlantCardV2';
import { PlantsFilterChipsV2 } from './components/PlantsFilterChipsV2';
import { usePlantsHub } from './hooks/usePlantsHub';

// ─────────────────────────────────────────────────────────────────────────────

type RootNav = NativeStackNavigationProp<RootStackParamList>;

// ── Skeleton card for loading state ───────────────────────────────────────────

function PlantCardSkeleton() {
  return (
    <Surface elevation="xs" radius="lg" border="subtle" style={skelStyles.card}>
      <View style={skelStyles.head}>
        <Skeleton width={40} height={40} radius={20} />
        <View style={skelStyles.identity}>
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={13} />
        </View>
      </View>
      <View style={skelStyles.meta}>
        <Skeleton width={90} height={14} radius={7} />
        <Skeleton width={110} height={14} radius={7} />
      </View>
      <Skeleton width="100%" height={40} radius={14} />
    </Surface>
  );
}

const skelStyles = StyleSheet.create({
  card:     { padding: 16, gap: 12 },
  head:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  identity: { flex: 1, gap: 6 },
  meta:     { flexDirection: 'row', gap: 8 },
});

// ─────────────────────────────────────────────────────────────────────────────

export function PlantsHubV2() {
  const theme = useUITheme();
  const { user } = useAuth();
  const navigation = useNavigation<RootNav>();
  const { profile } = useUserProfile(user?.id ?? '');

  const state = usePlantsHub(user?.id ?? '');
  const { reload } = state;
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

  const categoryNameById = React.useMemo(() => {
    const entries = (profile?.categories ?? []).map(c => [c.id, c.name] as const);
    return new Map(entries);
  }, [profile?.categories]);

  const categoryFilters = React.useMemo(
    () => state.categories.map(item => ({
      ...item,
      label: categoryNameById.get(item.id) ?? item.label,
    })),
    [state.categories, categoryNameById],
  );

  useFocusEffect(
    useCallback(() => {
      reload().catch(() => showToast({ type: 'error', title: 'No se pudo actualizar la lista' }));
    }, [reload]),
  );

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await plantService.removeById(pendingDeleteId);
      await reload();
      showToast({ type: 'success', title: 'Planta eliminada' });
    } catch {
      showToast({ type: 'error', title: 'No se pudo eliminar la planta', autoDismiss: false });
    } finally {
      setPendingDeleteId(null);
    }
  };

  const plantsLabel = state.filteredPlants.length === 1 ? 'planta' : 'plantas';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Screen edges={['top', 'left', 'right']}>

      {/* ── Fixed header area ──────────────────────────────────────────── */}
      <View style={styles.header}>
        <ScreenHeader title="Mis Plantas" />

        <SearchBar
          value={state.query}
          onChange={state.setQuery}
          placeholder="Busca por nombre, especie o nota"
        />

        <PlantsFilterChipsV2
          categories={categoryFilters}
          categoryFilter={state.categoryFilter}
          onSelectCategory={state.setCategoryFilter}
          sortBy={state.sortBy}
          onSelectSort={state.setSortBy}
        />

        <View style={styles.summaryRow}>
          <Text variant="caption" color="textSecondary">
            {state.filteredPlants.length} {plantsLabel}
          </Text>
          <View style={styles.summaryActions}>
            <Button
              label="Calendario"
              onPress={() => navigation.navigate('WateringCalendar')}
              variant="secondary"
              size="sm"
              leftSlot={
                <Feather
                  name="calendar"
                  size={theme.layout.iconSm}
                  color={theme.colors.accentForeground}
                />
              }
            />
            <Button
              label="Agregar"
              onPress={() => navigation.navigate('AddPlant')}
              variant="primary"
              size="sm"
              leftSlot={
                <Feather
                  name="plus"
                  size={theme.layout.iconSm}
                  color={theme.colors.textOnAccent}
                />
              }
            />
          </View>
        </View>
      </View>

      {/* ── List / skeleton / empty / error ───────────────────────────── */}
      <View style={styles.listArea}>
        {state.loading ? (
          <View style={styles.skeletonList}>
            {[0, 1, 2].map(i => <PlantCardSkeleton key={i} />)}
          </View>
        ) : state.filteredPlants.length > 0 ? (
          <FlatList
            data={state.filteredPlants}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => (
              <Animated.View entering={FadeInDown.duration(280).delay(Math.min(index * 55, 330))}>
                <PlantCardV2
                  plant={item}
                  categoryLabel={categoryNameById.get(item.categoryId)}
                  onEdit={id => navigation.navigate('EditPlant', { plantId: id })}
                  onDelete={setPendingDeleteId}
                />
              </Animated.View>
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={state.loading}
                onRefresh={() => reload().catch(() => {})}
                tintColor={theme.colors.accent}
                colors={[theme.colors.accent]}
              />
            }
          />
        ) : state.error ? (
          <EmptyState
            iconName="alert-circle"
            title="No se pudieron cargar las plantas"
            subtitle={state.error}
          />
        ) : (
          <EmptyState
            iconName="search"
            title="No tienes plantas aún"
            subtitle="Agrega tu primera planta o usa el escáner IA"
          />
        )}
      </View>

      <ConfirmActionModal
        visible={Boolean(pendingDeleteId)}
        title="Eliminar planta"
        message="Esta acción eliminará la planta y sus registros asociados."
        confirmText="Eliminar"
        cancelText="Cancelar"
        destructive
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />

    </Screen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  listArea: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
    gap: 12,
  },
  skeletonList: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
  },
});
