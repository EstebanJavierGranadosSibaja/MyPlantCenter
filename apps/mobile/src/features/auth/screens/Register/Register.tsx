import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from 'react-native';
import { useAuth } from 'src/core/contexts/AuthContext';
import { AuthStackParamList } from 'src/core/navigation/AppNavigator';
import { RegisterFormValues, RegisterSchema } from 'src/features/auth/validators/auth.validators';
import { useFormToast } from 'src/shared/components/feedback/FormToast/useFormToast';
import { CustomSafeArea } from 'src/shared/components/layout/CustomSafeArea';
import { FormInput } from 'src/shared/components/ui/FormInput/FormInput';
import { useGoogleAuth } from 'src/shared/hooks/useAuth';
import { useRegisterTheme } from './Register.styles';

type RegisterProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const Register: React.FC<RegisterProps> = ({ navigation }) => {
  const { styles } = useRegisterTheme();
  const { registerWithEmail, registerWithGoogle, loading, error, clearError } = useAuth();
  const { showToast } = useFormToast();
  const { authGoogle, googleLoading } = useGoogleAuth({
    onSuccess: async tokens => {
      const currentNickname = getValues('nickname').trim();
      await registerWithGoogle(currentNickname, tokens);
    },
    onError: (message: string) => {
      showToast({
        type: 'error',
        title: message,
        autoDismiss: false,
      });
    },
  });

  const nicknameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
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

  const handleRegister = handleSubmit(async values => {
    clearError();
    try {
      const success = await registerWithEmail({
        fullName: values.fullName.trim(),
        nickname: values.nickname.trim(),
        email: values.email.trim(),
        password: values.password,
        confirmPassword: values.confirmPassword,
        method: 'email',
      });

      if (success) {
        return;
      }

      showToast({
        type: 'error',
        title: 'No se pudo crear la cuenta',
        subtitle: error ?? 'No se pudo crear la cuenta',
        autoDismiss: false,
      });
    } catch (submitError) {
      showToast({
        type: 'error',
        title: 'No se pudo crear la cuenta',
        subtitle: submitError instanceof Error ? submitError.message : 'Verifica tu conexión',
        autoDismiss: false,
      });
    }
  }, invalidValues => {
    const firstError =
      invalidValues.fullName?.message ??
      invalidValues.nickname?.message ??
      invalidValues.email?.message ??
      invalidValues.password?.message ??
      invalidValues.confirmPassword?.message ??
      errors.fullName?.message ??
      errors.nickname?.message ??
      errors.email?.message ??
      errors.password?.message ??
      errors.confirmPassword?.message ??
      'Revisa los campos del formulario.';

    showToast({
      type: 'warning',
      title: 'Revisa los campos del formulario',
      subtitle: firstError,
    });
  });

  const handleGoogleRegister = async () => {
    clearError();
    await authGoogle();
  };

  const isButtonDisabled = isSubmitting || loading;

  return (
    <CustomSafeArea>
      <View style={styles.safe}>
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Configura tu perfil para empezar</Text>

        <View style={styles.formCard}>
          <FormInput
            control={control}
            name="fullName"
            placeholder="Nombre completo"
            autoCorrect={false}
            textContentType="name"
            returnKeyType="next"
            onSubmitEditing={() => nicknameRef.current?.focus()}
          />

          <FormInput
            control={control}
            name="nickname"
            inputRef={nicknameRef}
            placeholder="@apodo"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />

          <FormInput
            control={control}
            name="email"
            inputRef={emailRef}
            placeholder="Correo"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <FormInput
            control={control}
            name="password"
            inputRef={passwordRef}
            placeholder="Contrasena"
            isPassword
            autoCorrect={false}
            autoComplete="password"
            textContentType="password"
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          />

          <FormInput
            control={control}
            name="confirmPassword"
            inputRef={confirmPasswordRef}
            placeholder="Confirmar contrasena"
            isPassword
            autoCorrect={false}
            autoComplete="password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && !isButtonDisabled && styles.buttonPressed,
              isButtonDisabled && styles.buttonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isButtonDisabled}
            accessibilityRole="button"
            accessibilityLabel="Crear cuenta"
            accessibilityState={{ disabled: isButtonDisabled }}
          >
            {isSubmitting ? <ActivityIndicator color="white" /> : null}
            <Text style={styles.buttonText}>{isSubmitting ? 'Creando...' : 'Crear cuenta'}</Text>
          </Pressable>

          <View style={styles.socialDivider}>
            <View style={styles.socialLine} />
            <Text style={styles.socialDividerText}>o continuar con</Text>
            <View style={styles.socialLine} />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.googleButton,
              pressed && !(loading || googleLoading) && styles.googleButtonPressed,
              (loading || googleLoading) && styles.buttonDisabled,
            ]}
            onPress={handleGoogleRegister}
            disabled={loading || googleLoading}
            accessibilityRole="button"
            accessibilityLabel="Crear cuenta con Google"
            accessibilityState={{ disabled: loading || googleLoading }}
          >
            <View style={styles.googleIconWrap}>
              <Image
                source={require('../../../../../assets/images/google-icon.webp')}
                style={styles.googleIconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.googleButtonText}>{googleLoading ? 'Conectando con Google...' : 'Crear cuenta con Google'}</Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.secondaryButtonPressed,
          ]}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Volver al login"
        >
          <Text style={styles.secondaryText}>Ya tengo cuenta</Text>
        </Pressable>
      </View>
    </CustomSafeArea>
  );
};
