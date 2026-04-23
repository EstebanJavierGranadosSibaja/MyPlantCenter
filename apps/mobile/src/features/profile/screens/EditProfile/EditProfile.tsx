import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from 'src/core/navigation/AppNavigator';
import { normalizeDateInput } from 'src/features/plants/validators/date.validators';
import { useUserProfile } from 'src/features/profile/hooks/useUserProfile';
import { EditProfileDTO } from 'src/features/profile/types/user.types';
import {
    EditProfileFormValues,
    EditProfileSchema,
} from 'src/features/profile/validators/profile.validators';
import { useFormToast } from 'src/shared/components/feedback/FormToast/useFormToast';
import { FormInput } from 'src/shared/components/ui/FormInput/FormInput';
import { useEditProfileTheme } from './EditProfile.styles';

interface EditProfileProps {
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
    name: profile.name,
    nickname: profile.nickname.replace(/^@+/, ''),
    description: profile.description ?? '',
    birthday: profile.birthdayIso ?? '',
    location: profile.location ?? '',
  };
}

function toUpdateDto(values: EditProfileFormValues): EditProfileDTO {
  return {
    name: values.name.trim(),
    nickname: values.nickname.trim(),
    description: (values.description ?? '').trim(),
    birthday: normalizeDateInput(values.birthday),
    location: values.location?.trim() || undefined,
  };
}

export const EditProfile: React.FC<EditProfileProps> = ({ userId, onSaved }) => {
  const { theme, styles } = useEditProfileTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { showToast } = useFormToast();
  const { profile, loading, updateProfile } = useUserProfile(userId);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: '',
      nickname: '',
      description: '',
      birthday: '',
      location: '',
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (!profile) {
      return;
    }

    reset(toFormValues(profile));
  }, [profile, reset]);

  const onValid = handleSubmit(
    async values => {
      const result = await updateProfile(toUpdateDto(values));

      if (!result.success) {
        showToast({
          type: 'error',
          title: 'No se pudo guardar',
          subtitle: 'Verifica tu conexión',
          autoDismiss: false,
        });
        return;
      }

      showToast({
        type: 'success',
        title: 'Perfil actualizado correctamente',
      });

      onSaved?.();
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    },
    () => {
      showToast({
        type: 'warning',
        title: 'Revisa los campos del formulario',
        subtitle: 'Hay datos inválidos o incompletos.',
      });
    },
  );

  if (loading && !profile) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <FormInput
          control={control}
          name="name"
          label="Nombre"
          isRequired
          placeholder="Nombre completo"
          iconName="user"
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="next"
        />

        <FormInput
          control={control}
          name="nickname"
          label="Apodo"
          isRequired
          placeholder="@apodo"
          iconName="at-sign"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />

        <FormInput
          control={control}
          name="description"
          label="Descripción"
          placeholder="Una descripción breve..."
          iconName="file-text"
          autoCorrect
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          returnKeyType="default"
        />

        <FormInput
          control={control}
          name="birthday"
          label="Fecha de nacimiento"
          placeholder="DD/MM/AAAA"
          dateMask="dd/mm/yyyy"
          datePicker
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />

        <FormInput
          control={control}
          name="location"
          label="Ubicación"
          placeholder="Ciudad, País"
          iconName="map-pin"
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={onValid}
        />

        <TouchableOpacity
          style={[styles.saveButton, (!isDirty || isSubmitting) && styles.saveButtonDisabled]}
          onPress={onValid}
          disabled={!isDirty || isSubmitting}
          accessibilityRole="button"
          accessibilityLabel="Guardar cambios del perfil"
          accessibilityState={{ disabled: !isDirty || isSubmitting }}
        >
          {isSubmitting ? (
            <ActivityIndicator color={theme.colors.textInverse} />
          ) : null}
          <Text style={styles.saveButtonText}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
