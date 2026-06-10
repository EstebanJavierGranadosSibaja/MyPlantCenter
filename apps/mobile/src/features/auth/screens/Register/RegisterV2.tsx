import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Image, StyleSheet, View } from 'react-native';
import { useAuth } from 'src/core/contexts/AuthContext';
import { AuthStackParamList } from 'src/core/navigation/AppNavigator';
import { RegisterFormValues, RegisterSchema } from 'src/features/auth/validators/auth.validators';
import { useFormToast } from 'src/shared/components/feedback/FormToast/useFormToast';
import { useGoogleAuth } from 'src/shared/hooks/useAuth';
import { Button, KeyboardScreen, Surface, Text, TextField, useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterV2({ navigation }: Props) {
  const theme = useUITheme();

  // ── Auth ──────────────────────────────────────────────────────────────────
  const { registerWithEmail, registerWithGoogle, loading, error, clearError } = useAuth();
  const { showToast } = useFormToast();
  const { authGoogle, googleLoading } = useGoogleAuth({
    onSuccess: async tokens => {
      await registerWithGoogle(getValues('nickname').trim(), tokens);
    },
    onError: (message: string) => showToast({ type: 'error', title: message, autoDismiss: false }),
  });

  // ── Form ──────────────────────────────────────────────────────────────────
  const { control, getValues, handleSubmit, formState: { isSubmitting } } =
    useForm<RegisterFormValues>({
      resolver: zodResolver(RegisterSchema),
      defaultValues: {
        fullName: '',
        nickname: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      mode: 'onSubmit',
    });

  const onRegister = handleSubmit(
    async values => {
      clearError();
      try {
        const ok = await registerWithEmail({
          fullName:        values.fullName.trim(),
          nickname:        values.nickname.trim(),
          email:           values.email.trim(),
          password:        values.password,
          confirmPassword: values.confirmPassword,
          method:          'email',
        });

        if (!ok) {
          showToast({
            type: 'error',
            title: 'No se pudo crear la cuenta',
            subtitle: error ?? 'Inténtalo de nuevo',
            autoDismiss: false,
          });
        }
      } catch (e) {
        showToast({
          type: 'error',
          title: 'No se pudo crear la cuenta',
          subtitle: e instanceof Error ? e.message : 'Verifica tu conexión',
          autoDismiss: false,
        });
      }
    },
    invalid => {
      const msg =
        invalid.fullName?.message ??
        invalid.nickname?.message ??
        invalid.email?.message ??
        invalid.password?.message ??
        invalid.confirmPassword?.message ??
        'Revisa los campos del formulario.';
      showToast({ type: 'warning', title: 'Revisa los campos del formulario', subtitle: msg });
    },
  );

  const onGoogleRegister = async () => {
    clearError();
    await authGoogle();
  };

  const isBusy       = isSubmitting || loading;
  const isGoogleBusy = loading || googleLoading;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <KeyboardScreen contentStyle={styles.content}>

      <View style={styles.header}>
        <Text variant="h1" align="center">Crear cuenta</Text>
        <Text variant="body" color="textSecondary" align="center">
          Configura tu perfil para empezar
        </Text>
      </View>

      <Surface elevation="sm" radius="lg" border="subtle" style={styles.card}>

        <TextField
          control={control}
          name="fullName"
          label="Nombre completo"
          leftIcon="user"
          autoCorrect={false}
          textContentType="name"
          returnKeyType="next"
        />

        <TextField
          control={control}
          name="nickname"
          label="@apodo"
          leftIcon="at-sign"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />

        <TextField
          control={control}
          name="email"
          label="Correo"
          leftIcon="mail"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
        />

        <TextField
          control={control}
          name="password"
          label="Contraseña"
          leftIcon="lock"
          isPassword
          autoCorrect={false}
          autoComplete="password"
          textContentType="newPassword"
          returnKeyType="next"
        />

        <TextField
          control={control}
          name="confirmPassword"
          label="Confirmar contraseña"
          leftIcon="lock"
          isPassword
          autoCorrect={false}
          autoComplete="password"
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={onRegister}
        />

        <Button
          label="Crear cuenta"
          onPress={onRegister}
          loading={isBusy}
          disabled={isBusy}
          fullWidth
        />

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.borderDefault }]} />
          <Text variant="overline" color="textTertiary">o continuar con</Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.borderDefault }]} />
        </View>

        <Button
          label={googleLoading ? 'Conectando...' : 'Crear cuenta con Google'}
          onPress={onGoogleRegister}
          loading={isGoogleBusy}
          disabled={isGoogleBusy}
          variant="secondary"
          leftSlot={
            <Image
              source={require('../../../../../assets/images/google-icon.webp')}
              style={styles.googleIcon}
              resizeMode="contain"
            />
          }
          fullWidth
        />

      </Surface>

      <Button
        label="Ya tengo cuenta"
        onPress={() => navigation.goBack()}
        variant="ghost"
        fullWidth
      />

    </KeyboardScreen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 24,
  },
  header: {
    gap: 8,
    alignItems: 'center',
  },
  card: {
    padding: 20,
    gap: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
});
