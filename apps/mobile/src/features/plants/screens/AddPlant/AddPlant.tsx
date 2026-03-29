import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo } from 'react';
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
import { EditPlantDTO } from 'src/features/plants/types/plant.types';
import { useAddPlantTheme } from './AddPlant.styles';

type AddPlantProps = NativeStackScreenProps<RootStackParamList, 'AddPlant'>;
const FALLBACK_CATEGORY_ID = 'general';

function toCreateDto(values: EditPlantFormValues): EditPlantDTO {
  return {
    name: values.name.trim(),
    species: values.species?.trim() || undefined,
    categoryId: values.categoryId,
    wateringFrequencyDays: values.wateringFrequencyDays,
    notes: values.notes?.trim() || undefined,
    acquiredAt: normalizeDateInput(values.acquiredAt),
  };
}

export const AddPlant: React.FC<AddPlantProps> = ({ navigation }) => {
  const { theme, styles } = useAddPlantTheme();
  const { showToast } = useFormToast();
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.id ?? '');

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
    formState: { isSubmitting },
  } = useForm<EditPlantFormValues>({
    resolver: zodResolver(EditPlantSchema),
    defaultValues: {
      name: '',
      species: '',
      categoryId: profile?.categories?.[0]?.id ?? '',
      wateringFrequencyDays: 3,
      notes: '',
      acquiredAt: '',
    },
    mode: 'onSubmit',
  });

  const categories = useMemo(() => profile?.categories ?? [], [profile?.categories]);

  useEffect(() => {
    const currentCategory = getValues('categoryId');
    if (currentCategory) {
      return;
    }

    const defaultCategory = categories[0]?.id ?? FALLBACK_CATEGORY_ID;
    setValue('categoryId', defaultCategory, {
      shouldDirty: false,
      shouldTouch: true,
      shouldValidate: true,
    });
    clearErrors('categoryId');
  }, [categories, clearErrors, getValues, setValue]);

  useEffect(() => {
    if (categories.length > 0) {
      return;
    }

    const currentCategory = getValues('categoryId');
    if (!currentCategory) {
      setValue('categoryId', FALLBACK_CATEGORY_ID, {
        shouldDirty: false,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
    clearErrors('categoryId');
  }, [categories.length, clearErrors, getValues, setValue]);

  const onSave = handleSubmit(
    async values => {
      if (!user?.id) {
        showToast({
          type: 'error',
          title: 'No hay sesión activa',
          autoDismiss: false,
        });
        return;
      }

      try {
        await plantService.createByUser(user.id, toCreateDto(values));
        showToast({
          type: 'success',
          title: 'Planta agregada',
        });
        navigation.goBack();
      } catch {
        showToast({
          type: 'error',
          title: 'No se pudo crear la planta',
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

  return (
    <CustomSafeArea scroll keyboardAvoiding>
      <View style={styles.container}>
        <AppHeader
          title="Nueva planta"
          subtitle="REGISTRA TU PLANTA"
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
                  <>
                    <Text style={styles.emptyCategoriesText}>No hay categorías disponibles. Se usará &quot;General&quot;.</Text>
                    <View style={[styles.chip, styles.chipSelected]}>
                      <Text style={[styles.chipText, styles.chipTextSelected]}>General</Text>
                    </View>
                  </>
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
            style={[
              styles.saveButton,
              isSubmitting && styles.saveButtonDisabled,
            ]}
            onPress={onSave}
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Guardar planta"
            accessibilityState={{ disabled: isSubmitting }}
          >
            {isSubmitting ? <ActivityIndicator color={theme.colors.accentSoft} /> : null}
            <Text style={styles.saveButtonText}>
              {isSubmitting ? 'Guardando...' : 'Crear planta'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </CustomSafeArea>
  );
};
