import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from 'src/core/contexts/AuthContext';
import { useFormToast } from 'src/shared/components/feedback/FormToast/useFormToast';
import { CustomSafeArea } from 'src/shared/components/layout/CustomSafeArea';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { FormInput } from 'src/shared/components/ui/FormInput/FormInput';
import { useUserProfile } from 'src/features/profile/hooks/useUserProfile';
import { RootStackParamList } from 'src/core/navigation/AppNavigator';
import { plantService } from 'src/features/plants/services/plant.service';
import { normalizeDateInput } from 'src/features/plants/validators/date.validators';
import { EditPlantFormValues, EditPlantSchema } from 'src/features/plants/validators/plant.validators';
import { EditPlantDTO, Plant } from 'src/features/plants/types/plant.types';
import { useEditPlantTheme } from './EditPlant.styles';

type EditPlantProps = NativeStackScreenProps<RootStackParamList, 'EditPlant'>;

function toUpdateDto(values: EditPlantFormValues): EditPlantDTO {
  return {
    name: values.name.trim(),
    species: values.species?.trim() || undefined,
    categoryId: values.categoryId,
    wateringFrequencyDays: values.wateringFrequencyDays,
    notes: values.notes?.trim() || undefined,
    acquiredAt: normalizeDateInput(values.acquiredAt),
  };
}

export const EditPlant: React.FC<EditPlantProps> = ({ navigation, route }) => {
  const { plantId } = route.params;
  const { theme, styles } = useEditPlantTheme();
  const { showToast } = useFormToast();
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.id ?? '');

  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<EditPlantFormValues>({
    resolver: zodResolver(EditPlantSchema),
    defaultValues: {
      name: '',
      species: '',
      categoryId: '',
      wateringFrequencyDays: 1,
      notes: '',
      acquiredAt: '',
    },
    mode: 'onSubmit',
  });

  const categories = useMemo(() => profile?.categories ?? [], [profile?.categories]);

  useEffect(() => {
    let mounted = true;

    plantService
      .getById(plantId)
      .then(data => {
        if (!mounted) {
          return;
        }

        setPlant(data);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }

        showToast({
          type: 'error',
          title: 'No se pudo cargar la planta',
          autoDismiss: false,
        });
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [plantId, showToast]);

  useEffect(() => {
    if (!plant) {
      return;
    }

    reset({
      name: plant.name,
      species: plant.species ?? '',
      categoryId: plant.categoryId,
      wateringFrequencyDays: plant.wateringFrequencyDays,
      notes: plant.notes ?? '',
      acquiredAt: plant.acquiredAt ?? '',
    });
  }, [plant, reset]);

  const onSave = handleSubmit(
    async values => {
      try {
        await plantService.update(plantId, toUpdateDto(values));
        showToast({
          type: 'success',
          title: 'Planta actualizada correctamente',
        });
        navigation.goBack();
      } catch {
        showToast({
          type: 'error',
          title: 'No se pudo guardar',
          subtitle: 'Verifica tu conexión',
          autoDismiss: false,
        });
      }
    },
    () => {
      showToast({
        type: 'warning',
        title: 'Revisa los campos del formulario',
      });
    },
  );

  if (loading) {
    return (
      <CustomSafeArea>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
        </View>
      </CustomSafeArea>
    );
  }

  return (
    <CustomSafeArea scroll keyboardAvoiding>
      <View style={styles.container}>
        <AppHeader
          title="Editar planta"
          subtitle="ACTUALIZA LOS DATOS"
          showBack
          style={styles.pageHeader}
        />

        <View style={styles.card}>
          <FormInput
            control={control}
            name="name"
            label="Nombre"
            iconName="feather"
            placeholder="Nombre de la planta"
            isRequired
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
          />

          <FormInput
            control={control}
            name="species"
            label="Especie"
            iconName="search"
            placeholder="Ej: Monstera deliciosa"
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
          />

          <Controller
            control={control}
            name="categoryId"
            render={({ field, fieldState }) => (
              <View style={styles.categorySection}>
                <Text style={styles.categoryLabel}>Categoría *</Text>

                {categories.length === 0 ? (
                  <Text style={styles.emptyCategoriesText}>No hay categorías disponibles.</Text>
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipsRow}
                  >
                    {categories.map(category => {
                      const selected = field.value === category.id;

                      return (
                        <TouchableOpacity
                          key={category.id}
                          onPress={() => field.onChange(category.id)}
                          style={[styles.chip, selected && styles.chipSelected]}
                          accessibilityRole="button"
                          accessibilityLabel={`Categoría ${category.name}`}
                        >
                          <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                            {category.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                )}

                {fieldState.error?.message ? (
                  <View style={styles.errorRow}>
                    <Feather
                      name="alert-circle"
                      size={theme.typography.size.sm}
                      color={theme.colors.error}
                    />
                    <Text style={styles.errorText}>{fieldState.error.message}</Text>
                  </View>
                ) : null}
              </View>
            )}
          />

          <FormInput
            control={control}
            name="wateringFrequencyDays"
            label="Frecuencia de riego"
            iconName="droplet"
            placeholder="Cada cuántos días"
            keyboardType="numeric"
            isRequired
            returnKeyType="next"
          />

          <FormInput
            control={control}
            name="notes"
            label="Notas"
            iconName="file-text"
            placeholder="Notas de cuidado..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            returnKeyType="default"
          />

          <FormInput
            control={control}
            name="acquiredAt"
            label="Fecha de adquisición"
            placeholder="DD/MM/AAAA"
            dateMask="dd/mm/yyyy"
            datePicker
            keyboardType="number-pad"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={onSave}
          />

          <TouchableOpacity
            style={[styles.saveButton, (!isDirty || isSubmitting) && styles.saveButtonDisabled]}
            onPress={onSave}
            disabled={!isDirty || isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Guardar cambios de la planta"
            accessibilityState={{ disabled: !isDirty || isSubmitting }}
          >
            {isSubmitting ? <ActivityIndicator color={theme.colors.accentSoft} /> : null}
            <Text style={styles.saveButtonText}>
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomSafeArea>
  );
};
