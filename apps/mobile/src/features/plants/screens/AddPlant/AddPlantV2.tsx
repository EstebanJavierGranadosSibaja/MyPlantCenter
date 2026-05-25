import { Feather } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useAuth } from 'src/core/contexts/AuthContext';
import { RootStackParamList } from 'src/core/navigation/AppNavigator';
import { plantService } from 'src/features/plants/services/plant.service';
import { normalizeDateInput } from 'src/features/plants/validators/date.validators';
import { EditPlantFormValues, EditPlantSchema } from 'src/features/plants/validators/plant.validators';
import { useUserProfile } from 'src/features/profile/hooks/useUserProfile';
import { useFormToast } from 'src/shared/components/feedback/FormToast/useFormToast';
import { Button, KeyboardScreen, Surface, Text, TextField, useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<RootStackParamList, 'AddPlant'>;

const FALLBACK_CATEGORY_ID = 'general';

// ─ Local chip ─────────────────────────────────────────────────────────────────
// Category selector pill — inline here until needed by other screens.

function CategoryChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const theme = useUITheme();
  return (
    <Pressable
      style={[
        styles.chip,
        active
          ? { backgroundColor: theme.colors.accentSoft, borderColor: theme.colors.accentMuted }
          : { backgroundColor: theme.colors.surface,    borderColor: theme.colors.borderDefault },
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text variant="label" color={active ? 'accentForeground' : 'textSecondary'}>
        {label}
      </Text>
    </Pressable>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function AddPlantV2({ navigation, route }: Props) {
  const theme = useUITheme();
  const { showToast } = useFormToast();
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.id ?? '');
  const prefill = route.params?.prefill;

  const categories = useMemo(() => profile?.categories ?? [], [profile?.categories]);

  const { control, handleSubmit, getValues, setValue, clearErrors, formState: { isSubmitting } } =
    useForm<EditPlantFormValues>({
      resolver: zodResolver(EditPlantSchema),
      defaultValues: {
        name: prefill?.name ?? '',
        species: prefill?.species ?? '',
        categoryId: profile?.categories?.[0]?.id ?? '',
        wateringFrequencyDays: 3,
        notes: prefill?.notes ?? '',
        acquiredAt: '',
      },
      mode: 'onSubmit',
    });

  useEffect(() => {
    const current = getValues('categoryId');
    if (current) return;
    const defaultId = categories[0]?.id ?? FALLBACK_CATEGORY_ID;
    setValue('categoryId', defaultId, { shouldDirty: false, shouldTouch: true, shouldValidate: true });
    clearErrors('categoryId');
  }, [categories, clearErrors, getValues, setValue]);

  useEffect(() => {
    if (categories.length > 0) return;
    const current = getValues('categoryId');
    if (!current) {
      setValue('categoryId', FALLBACK_CATEGORY_ID, { shouldDirty: false, shouldTouch: true, shouldValidate: true });
    }
    clearErrors('categoryId');
  }, [categories.length, clearErrors, getValues, setValue]);

  const onSave = handleSubmit(
    async values => {
      if (!user?.id) {
        showToast({ type: 'error', title: 'No hay sesión activa', autoDismiss: false });
        return;
      }
      try {
        await plantService.createByUser(user.id, {
          name:                  values.name.trim(),
          species:               values.species?.trim() || undefined,
          categoryId:            values.categoryId,
          wateringFrequencyDays: values.wateringFrequencyDays,
          notes:                 values.notes?.trim() || undefined,
          acquiredAt:            normalizeDateInput(values.acquiredAt),
        });
        showToast({ type: 'success', title: 'Planta agregada' });
        navigation.goBack();
      } catch {
        showToast({ type: 'error', title: 'No se pudo crear la planta', autoDismiss: false });
      }
    },
    () => showToast({ type: 'warning', title: 'Revisa los campos del formulario' }),
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <KeyboardScreen contentStyle={styles.content}>

      {/* Nav bar */}
      <View style={styles.navBar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Feather name="arrow-left" size={theme.layout.iconMd} color={theme.colors.textPrimary} />
        </Pressable>
        <Text variant="h2">Nueva planta</Text>
      </View>

      {/* Form card */}
      <Surface elevation="sm" radius="lg" border="subtle" style={styles.card}>

        <TextField
          control={control}
          name="name"
          label="Nombre *"
          leftIcon="feather"
          placeholder="Nombre de la planta"
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="next"
        />

        <TextField
          control={control}
          name="species"
          label="Especie"
          leftIcon="search"
          placeholder="Ej: Monstera deliciosa"
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="next"
        />

        {/* Category picker */}
        <Controller
          control={control}
          name="categoryId"
          render={({ field, fieldState }) => (
            <View style={styles.categoryBlock}>
              <Text variant="label" color="textSecondary">Categoría *</Text>

              {categories.length === 0 ? (
                <>
                  <Text variant="bodyMd" color="textTertiary">
                    No hay categorías. Se usará "General".
                  </Text>
                  <CategoryChip label="General" active onPress={() => {}} />
                </>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipsRow}
                >
                  {categories.map(cat => (
                    <CategoryChip
                      key={cat.id}
                      label={cat.name}
                      active={field.value === cat.id}
                      onPress={() => field.onChange(cat.id)}
                    />
                  ))}
                </ScrollView>
              )}

              {fieldState.error && (
                <Text variant="caption" color="error">{fieldState.error.message}</Text>
              )}
            </View>
          )}
        />

        <TextField
          control={control}
          name="wateringFrequencyDays"
          label="Frecuencia de riego (días) *"
          leftIcon="droplet"
          placeholder="Ej: 3"
          keyboardType="numeric"
          returnKeyType="next"
        />

        <TextField
          control={control}
          name="notes"
          label="Notas"
          leftIcon="file-text"
          placeholder="Notas de cuidado..."
          returnKeyType="next"
        />

        <TextField
          control={control}
          name="acquiredAt"
          label="Fecha de adquisición"
          leftIcon="calendar"
          placeholder="DD/MM/AAAA"
          hint="Formato: día/mes/año"
          keyboardType="number-pad"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={onSave}
        />

        <Button
          label="Crear planta"
          onPress={onSave}
          loading={isSubmitting}
          disabled={isSubmitting}
          fullWidth
        />

      </Surface>

    </KeyboardScreen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 20,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  card: {
    padding: 20,
    gap: 16,
  },
  categoryBlock: {
    gap: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
