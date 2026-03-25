import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from 'src/auth/AuthContext';
import { CustomSafeArea } from 'src/components/layout/CustomSafeArea';
import { AuthStackParamList } from 'src/navigation/AppNavigator';
import { validateRegisterInput } from 'src/services/validators/auth.validators';
import { useRegisterTheme } from './Register.styles';

type RegisterProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const Register: React.FC<RegisterProps> = ({ navigation }) => {
  const { styles, theme } = useRegisterTheme();
  const { registerWithEmail, loading, error, clearError } = useAuth();

  const [fullName, setFullName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

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

  return (
    <CustomSafeArea>
      <View style={styles.safe}>
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Configura tu perfil para empezar</Text>

        <TextInput
          value={fullName}
          onChangeText={value => {
            setFullName(value);
            if (localError) setLocalError(null);
          }}
          placeholder="Nombre completo"
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
        />

        <TextInput
          value={nickname}
          onChangeText={value => {
            setNickname(value);
            if (localError) setLocalError(null);
          }}
          placeholder="@apodo"
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
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
        />

        <TextInput
          value={password}
          onChangeText={value => {
            setPassword(value);
            if (localError) setLocalError(null);
          }}
          placeholder="Contrasena"
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
          secureTextEntry
        />

        <TextInput
          value={confirmPassword}
          onChangeText={value => {
            setConfirmPassword(value);
            if (localError) setLocalError(null);
          }}
          placeholder="Confirmar contrasena"
          placeholderTextColor={theme.colors.textMuted}
          style={styles.input}
          secureTextEntry
        />

        {(localError || error) ? <Text style={styles.errorText}>{localError ?? error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Crear cuenta"
        >
          <Text style={styles.buttonText}>{loading ? 'Creando...' : 'Crear cuenta'}</Text>
        </TouchableOpacity>

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
