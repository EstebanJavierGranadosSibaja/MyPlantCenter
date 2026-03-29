import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from 'src/core/contexts/AuthContext';
import { ConfirmActionModal } from 'src/shared/components/feedback/ConfirmActionModal/ConfirmActionModal';
import { showToast } from 'src/shared/components/feedback/FormToast/FormToast';
import { EmptyState } from 'src/shared/components/feedback/EmptyState/EmptyState';
import { CustomSafeArea } from 'src/shared/components/layout/CustomSafeArea';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { useUserProfile } from 'src/features/profile/hooks/useUserProfile';
import { RootStackParamList } from 'src/core/navigation/AppNavigator';
import { plantService } from 'src/features/plants/services/plant.service';
import { PlantCard } from './components/PlantCard';
import { PlantsFilterChips } from './components/PlantsFilterChips';
import { PlantsSearchBar } from './components/PlantsSearchBar';
import { usePlantsHub } from './hooks/usePlantsHub';
import { usePlantsHubTheme } from './PlantsHub.styles';

type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export const PlantsHub: React.FC = () => {
  const { user } = useAuth();
  const { styles, theme } = usePlantsHubTheme();
  const navigation = useNavigation<RootNavigation>();
  const { profile } = useUserProfile(user?.id ?? '');

  const state = usePlantsHub(user?.id);
  const { reload } = state;
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null);

  const categoryNameById = React.useMemo(() => {
    const entries = (profile?.categories ?? []).map(category => [category.id, category.name] as const);
    return new Map(entries);
  }, [profile?.categories]);

  const categoryFilters = React.useMemo(
    () => state.categories.map(item => ({
      ...item,
      label: categoryNameById.get(item.id) ?? item.label,
    })),
    [state.categories, categoryNameById],
  );

  const handleEdit = (plantId: string) => {
    navigation.navigate('EditPlant', { plantId });
  };

  const handleDelete = (plantId: string) => {
    setPendingDeleteId(plantId);
  };

  const handleAddPlant = () => {
    navigation.navigate('AddPlant');
  };

  useFocusEffect(
    React.useCallback(() => {
      reload().catch(() => {
        showToast({
          type: 'error',
          title: 'No se pudo actualizar la lista',
        });
      });
    }, [reload]),
  );

  const confirmDelete = async () => {
    if (!pendingDeleteId) {
      return;
    }

    try {
      await plantService.removeById(pendingDeleteId);
      await reload();
      showToast({
        type: 'success',
        title: 'Planta eliminada',
      });
    } catch {
      showToast({
        type: 'error',
        title: 'No se pudo eliminar la planta',
        autoDismiss: false,
      });
    } finally {
      setPendingDeleteId(null);
    }
  };

  return (
    <CustomSafeArea>
      <View style={styles.root}>
        <AppHeader title="Plantas" subtitle="TU CENTRO DE MANEJO" showBack={false} />

        <View style={styles.content}>
          <PlantsSearchBar value={state.query} onChange={state.setQuery} />

          <PlantsFilterChips
            categories={categoryFilters}
            categoryFilter={state.categoryFilter}
            onSelectCategory={state.setCategoryFilter}
            sortBy={state.sortBy}
            onSelectSort={state.setSortBy}
          />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>
              {state.filteredPlants.length} planta{state.filteredPlants.length === 1 ? '' : 's'}
            </Text>

            <TouchableOpacity style={styles.addButton} onPress={handleAddPlant} activeOpacity={0.85}>
              <Feather name="plus" size={theme.typography.size.base} color={theme.colors.textInverse} />
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>

          {state.loading ? (
            <View style={styles.loadingWrap}>
              <Text style={styles.loadingText}>Cargando plantas...</Text>
            </View>
          ) : state.error ? (
            <EmptyState
              iconName="alert-circle"
              title="No se pudieron cargar"
              subtitle={state.error}
            />
          ) : state.filteredPlants.length === 0 ? (
            <EmptyState
              iconName="search"
              title="Sin resultados"
              subtitle="Prueba otro filtro o término de búsqueda"
            />
          ) : (
            <FlatList
              data={state.filteredPlants}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <PlantCard
                  plant={item}
                  categoryLabel={categoryNameById.get(item.categoryId)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
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
      </View>
    </CustomSafeArea>
  );
};
