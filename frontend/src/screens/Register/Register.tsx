import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from 'src/auth/AuthContext';
import { CustomSafeArea } from 'src/components/layout/CustomSafeArea';
import { useGoogleAuth } from 'src/hooks/useAuth';
import { AuthStackParamList } from 'src/navigation/AppNavigator';
import { validateRegisterInput } from 'src/services/validators/auth.validators';
import { useRegisterTheme } from './Register.styles';

type RegisterProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const Register: React.FC<RegisterProps> = ({ navigation }) => {
  const { styles, theme } = useRegisterTheme();
  const { registerWithEmail, registerWithGoogle, loading, error, clearError } = useAuth();
  const { authGoogle, googleLoading } = useGoogleAuth({
    onSuccess: async (idToken: string) => {
      await registerWithGoogle(nickname.trim(), idToken);
    },
    onError: (message: string) => {
      setLocalError(message);
    },
  });

  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const nicknameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const handleRegister = async () => {
    const validationError = validateRegisterInput({
      fullName,
      nickname,
      email,
      password,
      confirmPassword,
    });

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError(null);
    clearError();
    await registerWithEmail({
      fullName: fullName.trim(),
      nickname: nickname.trim(),
      email: email.trim(),
      password,
      confirmPassword,
      method: 'email',
    });
  };

  const handleGoogleRegister = async () => {
    setLocalError(null);
    clearError();
    await authGoogle();
  };

  return (
    <CustomSafeArea>
      <View style={styles.safe}>
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Configura tu perfil para empezar</Text>

        <View style={styles.formCard}>
          <TextInput
            value={fullName}
            onChangeText={value => {
              setFullName(value);
              if (localError) setLocalError(null);
            }}
            placeholder="Nombre completo"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
            autoCorrect={false}
            textContentType="name"
            returnKeyType="next"
            onSubmitEditing={() => nicknameRef.current?.focus()}
          />

          <TextInput
            ref={nicknameRef}
            value={nickname}
            onChangeText={value => {
              setNickname(value);
              if (localError) setLocalError(null);
            }}
            placeholder="@apodo"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />

          <TextInput
            ref={emailRef}
            value={email}
            onChangeText={value => {
              setEmail(value);
              if (localError) setLocalError(null);
            }}
            placeholder="Correo"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          <TextInput
            ref={passwordRef}
            value={password}
            onChangeText={value => {
              setPassword(value);
              if (localError) setLocalError(null);
            }}
            placeholder="Contrasena"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
            secureTextEntry
            autoCorrect={false}
            autoComplete="password"
            textContentType="password"
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          />

          <TextInput
            ref={confirmPasswordRef}
            value={confirmPassword}
            onChangeText={value => {
              setConfirmPassword(value);
              if (localError) setLocalError(null);
            }}
            placeholder="Confirmar contrasena"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
            secureTextEntry
            autoCorrect={false}
            autoComplete="password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />

          {(localError || error) ? <Text style={styles.errorText}>{localError ?? error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Crear cuenta"
            accessibilityState={{ disabled: loading }}
          >
            <Text style={styles.buttonText}>{loading ? 'Creando...' : 'Crear cuenta'}</Text>
          </TouchableOpacity>

          <View style={styles.socialDivider}>
            <View style={styles.socialLine} />
            <Text style={styles.socialDividerText}>o continuar con</Text>
            <View style={styles.socialLine} />
          </View>

          <TouchableOpacity
            style={[styles.googleButton, (loading || googleLoading) && styles.buttonDisabled]}
            onPress={handleGoogleRegister}
            disabled={loading || googleLoading}
            accessibilityRole="button"
            accessibilityLabel="Crear cuenta con Google"
            accessibilityState={{ disabled: loading || googleLoading }}
          >
            <View style={styles.googleIconWrap}>
              <Image
                source={require('../../../assets/images/google-icon.webp')}
                style={styles.googleIconImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.googleButtonText}>{googleLoading ? 'Conectando con Google...' : 'Crear cuenta con Google'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Volver al login"
        >
          <Text style={styles.secondaryText}>Ya tengo cuenta</Text>
        </TouchableOpacity>
      </View>
    </CustomSafeArea>
  );
};
