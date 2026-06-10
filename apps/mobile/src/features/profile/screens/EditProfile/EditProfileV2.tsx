import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { RootStackParamList } from 'src/core/navigation/AppNavigator';
import { normalizeDateInput } from 'src/features/plants/validators/date.validators';
import { useUserProfile } from 'src/features/profile/hooks/useUserProfile';
import {
  EditProfileFormValues,
  EditProfileSchema,
} from 'src/features/profile/validators/profile.validators';
import { useFormToast } from 'src/shared/components/feedback/FormToast/useFormToast';
import { Button, DateField, DetailHeader, KeyboardScreen, Surface, Text, TextField, useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  userId: string;
  onSaved?: () => void;
}

function toFormValues(profile: {
  name: string;
  nickname: string;
  description?: string;
  birthdayIso?: string;
  location?: string;
}): EditProfileFormValues {
  return {
    name:        profile.name,
    nickname:    profile.nickname.replace(/^@+/, ''),
    description: profile.description ?? '',
    birthday:    profile.birthdayIso ?? '',
    location:    profile.location ?? '',
  };
}

// ─────────────────────────────────────────────────────────────────────────────

export function EditProfileV2({ userId, onSaved }: Props) {
  const theme = useUITheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { showToast } = useFormToast();
  const { profile, loading, updateProfile } = useUserProfile(userId);

  const { control, handleSubmit, reset, formState: { isDirty, isSubmitting } } =
    useForm<EditProfileFormValues>({
      resolver: zodResolver(EditProfileSchema),
      defaultValues: { name: '', nickname: '', description: '', birthday: '', location: '' },
      mode: 'onSubmit',
    });

  useEffect(() => {
    if (!profile) return;
    reset(toFormValues(profile));
  }, [profile, reset]);

  const onSave = handleSubmit(
    async values => {
      const result = await updateProfile({
        name:        values.name.trim(),
        nickname:    values.nickname.trim(),
        description: (values.description ?? '').trim(),
        birthday:    normalizeDateInput(values.birthday),
        location:    values.location?.trim() || undefined,
      });

      if (!result.success) {
        showToast({ type: 'error', title: 'No se pudo guardar', subtitle: 'Verifica tu conexión', autoDismiss: false });
        return;
      }

      showToast({ type: 'success', title: 'Perfil actualizado correctamente' });
      onSaved?.();
      if (navigation.canGoBack()) navigation.goBack();
    },
    () => showToast({ type: 'warning', title: 'Revisa los campos del formulario', subtitle: 'Hay datos inválidos o incompletos.' }),
  );

  // Mientras carga el perfil mostramos el chrome (header + spinner) en vez de
  // null, para que NO aparezca un flash blanco al entrar a la pantalla.
  if (loading && !profile) {
    return (
      <KeyboardScreen contentStyle={styles.content}>
        <DetailHeader
          title="Editar perfil"
          onBack={() => navigation.canGoBack() && navigation.goBack()}
        />
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
        </View>
      </KeyboardScreen>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <KeyboardScreen contentStyle={styles.content}>

      <DetailHeader
        title="Editar perfil"
        onBack={() => navigation.canGoBack() && navigation.goBack()}
      />

      <View style={styles.body}>

        {/* ── Identidad ──────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text variant="overline" color="textTertiary" style={styles.sectionLabel}>
            Identidad
          </Text>
          <Surface elevation="sm" radius="lg" border="subtle" style={styles.card}>

            <TextField
              control={control}
              name="name"
              label="Nombre *"
              leftIcon="user"
              placeholder="Nombre completo"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />

            <TextField
              control={control}
              name="nickname"
              label="Apodo *"
              leftIcon="at-sign"
              placeholder="@apodo"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />

            <TextField
              control={control}
              name="description"
              label="Descripción"
              leftIcon="file-text"
              placeholder="Una descripción breve..."
              returnKeyType="next"
            />

          </Surface>
        </View>

        {/* ── Detalles ───────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text variant="overline" color="textTertiary" style={styles.sectionLabel}>
            Detalles
          </Text>
          <Surface elevation="sm" radius="lg" border="subtle" style={styles.card}>

            <DateField
              control={control}
              name="birthday"
              label="Fecha de nacimiento"
              leftIcon="calendar"
              placeholder="DD/MM/AAAA"
              hint="Toca para elegir tu fecha"
              maximumDate={new Date()}
            />

            <TextField
              control={control}
              name="location"
              label="Ubicación"
              leftIcon="map-pin"
              placeholder="Ciudad, País"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={onSave}
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
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
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
});
