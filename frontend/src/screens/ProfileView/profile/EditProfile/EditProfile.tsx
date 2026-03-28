import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { useFormToast } from 'src/components/common/FormToast/useFormToast';
import { FormInput } from 'src/components/ui/FormInput/FormInput';
import { useUserProfile } from 'src/hooks/useUserProfile';
import { RootStackParamList } from 'src/navigation/AppNavigator';
import {
  EditProfileFormValues,
  EditProfileSchema,
} from 'src/services/validators/profile.validators';
import { normalizeDateInput } from 'src/services/validators/dateInput';
import { EditProfileDTO } from 'src/types-dtos/user.types';
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
          iconName="calendar"
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
            <ActivityIndicator color={theme.colors.accentSoft} />
          ) : null}
          <Text style={styles.saveButtonText}>
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
