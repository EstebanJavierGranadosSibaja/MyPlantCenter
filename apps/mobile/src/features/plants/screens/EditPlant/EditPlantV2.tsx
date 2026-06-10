import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Skeleton } from 'src/shared/components/ui/Skeleton/Skeleton';
import { useAuth } from 'src/core/contexts/AuthContext';
import { RootStackParamList } from 'src/core/navigation/AppNavigator';
import { plantService } from 'src/features/plants/services/plant.service';
import { Plant } from 'src/features/plants/types/plant.types';
import { normalizeDateInput } from 'src/features/plants/validators/date.validators';
import { EditPlantFormValues, EditPlantSchema } from 'src/features/plants/validators/plant.validators';
import { useUserProfile } from 'src/features/profile/hooks/useUserProfile';
import { useFormToast } from 'src/shared/components/feedback/FormToast/useFormToast';
import { Button, DateField, DetailHeader, KeyboardScreen, Surface, Text, TextField, useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<RootStackParamList, 'EditPlant'>;

// ─ Local chip ─────────────────────────────────────────────────────────────────

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

export function EditPlantV2({ navigation, route }: Props) {
  const { plantId } = route.params;
  const { showToast } = useFormToast();
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.id ?? '');

  const [plant, setPlant]   = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  const categories = useMemo(() => profile?.categories ?? [], [profile?.categories]);

  const { control, handleSubmit, reset, formState: { isDirty, isSubmitting } } =
    useForm<EditPlantFormValues>({
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

  useEffect(() => {
    let mounted = true;
    plantService.getById(plantId)
      .then(data => {
        if (!mounted) return;
        setPlant(data);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        showToast({ type: 'error', title: 'No se pudo cargar la planta', autoDismiss: false });
        setLoading(false);
      });
    return () => { mounted = false; };
  }, [plantId, showToast]);

  useEffect(() => {
    if (!plant) return;
    reset({
      name:                  plant.name,
      species:               plant.species ?? '',
      categoryId:            plant.categoryId,
      wateringFrequencyDays: plant.wateringFrequencyDays,
      notes:                 plant.notes ?? '',
      acquiredAt:            plant.acquiredAt ?? '',
    });
  }, [plant, reset]);

  const onSave = handleSubmit(
    async values => {
      try {
        await plantService.update(plantId, {
          name:                  values.name.trim(),
          species:               values.species?.trim() || undefined,
          categoryId:            values.categoryId,
          wateringFrequencyDays: values.wateringFrequencyDays,
          notes:                 values.notes?.trim() || undefined,
          acquiredAt:            normalizeDateInput(values.acquiredAt),
        });
        showToast({ type: 'success', title: 'Planta actualizada correctamente' });
        navigation.goBack();
      } catch {
        showToast({ type: 'error', title: 'No se pudo guardar', subtitle: 'Verifica tu conexión', autoDismiss: false });
      }
    },
    () => showToast({ type: 'warning', title: 'Revisa los campos del formulario' }),
  );

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <KeyboardScreen contentStyle={styles.content}>
        <DetailHeader title="Editar planta" onBack={() => navigation.goBack()} />
        <View style={styles.body}>
          <Surface elevation="sm" radius="lg" border="subtle" style={styles.card}>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <View key={i} style={styles.skeletonField}>
                <Skeleton width="35%" height={12} />
                <Skeleton width="100%" height={44} radius={10} />
              </View>
            ))}
          </Surface>
        </View>
      </KeyboardScreen>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <KeyboardScreen contentStyle={styles.content}>

      <DetailHeader title="Editar planta" onBack={() => navigation.goBack()} />

      <View style={styles.body}>

        {/* ── Información ─────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text variant="overline" color="textTertiary" style={styles.sectionLabel}>
            Información
          </Text>
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
                    <Text variant="bodyMd" color="textTertiary">No hay categorías disponibles.</Text>
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

          </Surface>
        </View>

        {/* ── Cuidado y detalles ─────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text variant="overline" color="textTertiary" style={styles.sectionLabel}>
            Cuidado y detalles
          </Text>
          <Surface elevation="sm" radius="lg" border="subtle" style={styles.card}>

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

            <DateField
              control={control}
              name="acquiredAt"
              label="Fecha de adquisición"
              leftIcon="calendar"
              placeholder="DD/MM/AAAA"
              hint="Toca para elegir la fecha"
              maximumDate={new Date()}
            />

          </Surface>
        </View>

        <Button
          label="Guardar cambios"
          onPress={onSave}
          loading={isSubmitting}
          disabled={!isDirty || isSubmitting}
          fullWidth
        />

      </View>

    </KeyboardScreen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 20,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    marginLeft: 4,
  },
  card: {
    padding: 20,
    gap: 16,
  },
  skeletonField: {
    gap: 6,
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
