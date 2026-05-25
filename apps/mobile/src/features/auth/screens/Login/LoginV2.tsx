import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Image, StyleSheet, TextInput, View } from 'react-native';
import { useAuth } from 'src/core/contexts/AuthContext';
import { AuthStackParamList } from 'src/core/navigation/AppNavigator';
import { LoginFormValues, LoginSchema } from 'src/features/auth/validators/auth.validators';
import { useFormToast } from 'src/shared/components/feedback/FormToast/useFormToast';
import { useGoogleAuth } from 'src/shared/hooks/useAuth';
import { Button, KeyboardScreen, Surface, Text, TextField, useUITheme } from 'src/ui';

// ─────────────────────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginV2({ navigation }: Props) {
  const theme = useUITheme();

  // ── Auth ──────────────────────────────────────────────────────────────────
  const { loginWithEmail, loginWithGoogle, loading, clearError } = useAuth();
  const { showToast } = useFormToast();
  const { authGoogle, googleLoading } = useGoogleAuth({
    onSuccess: async tokens => { await loginWithGoogle(tokens); },
    onError: (message: string) => showToast({ type: 'error', title: message, autoDismiss: false }),
  });

  // ── Form ──────────────────────────────────────────────────────────────────
  const passwordRef = useRef<TextInput>(null);

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const onLogin = handleSubmit(
    async ({ email, password }) => {
      clearError();
      const ok = await loginWithEmail({ email: email.trim(), password });
      if (!ok) showToast({ type: 'error', title: 'Correo o contraseña incorrectos' });
    },
    invalid => {
      const msg =
        invalid.email?.message ??
        invalid.password?.message ??
        'Revisa los campos del formulario.';
      showToast({ type: 'warning', title: 'Revisa los campos del formulario', subtitle: msg });
    },
  );

  const onGoogleLogin = async () => {
    clearError();
    await authGoogle();
  };

  const isBusy       = isSubmitting || loading;
  const isGoogleBusy = loading || googleLoading;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <KeyboardScreen contentStyle={styles.content}>

      <View style={styles.header}>
        <Text variant="h1" align="center">Iniciar sesión</Text>
        <Text variant="body" color="textSecondary" align="center">
          Bienvenido de vuelta a MyPlantCenter
        </Text>
      </View>

      <Surface elevation="sm" radius="lg" border="subtle" style={styles.card}>

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
          nextRef={passwordRef}
        />

        <TextField
          control={control}
          name="password"
          inputRef={passwordRef}
          label="Contraseña"
          leftIcon="lock"
          isPassword
          autoCorrect={false}
          autoComplete="password"
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={onLogin}
        />

        <Button
          label="Ingresar"
          onPress={onLogin}
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
          label={googleLoading ? 'Conectando...' : 'Ingresar con Google'}
          onPress={onGoogleLogin}
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
        label="Crear cuenta"
        onPress={() => navigation.navigate('Register')}
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
    justifyContent: 'center',
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
