import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from 'src/auth/AuthContext';
import { CustomSafeArea } from 'src/components/layout/CustomSafeArea';
import { AuthStackParamList } from 'src/navigation/AppNavigator';
import { validateLoginInput } from 'src/services/validators/auth.validators';
import { useLoginTheme } from './Login.styles';

type LoginProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const Login: React.FC<LoginProps> = ({ navigation }) => {
    const { styles, theme } = useLoginTheme();
    const { loginWithEmail, loading, error, clearError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);

    const handleLogin = async () => {
        const validationError = validateLoginInput({
            email,
            password,
        });

        if (validationError) {
            setLocalError(validationError);
            return;
        }

        setLocalError(null);
        clearError();
        await loginWithEmail({ email: email.trim(), password });
    };

    return (
        <CustomSafeArea>
            <View style={styles.safe}>
                <Text style={styles.title}>Iniciar sesion</Text>
                <Text style={styles.subtitle}>Bienvenido de vuelta a MyPlantCenter</Text>

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

                {(localError || error) ? <Text style={styles.errorText}>{localError ?? error}</Text> : null}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={loading}
                    accessibilityRole="button"
                    accessibilityLabel="Ingresar"
                >
                    <Text style={styles.buttonText}>{loading ? 'Ingresando...' : 'Ingresar'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('Register')}
                    accessibilityRole="button"
                    accessibilityLabel="Crear cuenta"
                >
                    <Text style={styles.secondaryText}>Crear cuenta</Text>
                </TouchableOpacity>
            </View>
        </CustomSafeArea>
    );
};
