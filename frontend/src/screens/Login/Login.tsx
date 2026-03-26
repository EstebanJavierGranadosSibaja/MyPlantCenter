import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth as useAuthContext } from 'src/auth/AuthContext';
import { CustomSafeArea } from 'src/components/layout/CustomSafeArea';
import { useAuth as useGoogleAuth } from 'src/hooks/useAuth';
import { AuthStackParamList } from 'src/navigation/AppNavigator';
import { validateLoginInput } from 'src/services/validators/auth.validators';
import { useLoginTheme } from './Login.styles';

type LoginProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const Login: React.FC<LoginProps> = ({ navigation }) => {
    const { styles, theme } = useLoginTheme();
    const { loginWithEmail, loading, error, clearError } = useAuthContext();
    const { authGoogle } = useGoogleAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState<string | null>(null);
    const passwordRef = useRef<TextInput>(null);

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

    const handleGoogleLogin = async () => {
        setLocalError(null);
        clearError();
        authGoogle();
    };

    return (
        <CustomSafeArea>
            <View style={styles.safe}>
                <Text style={styles.title}>Iniciar sesion</Text>
                <Text style={styles.subtitle}>Bienvenido de vuelta a MyPlantCenter</Text>

                <View style={styles.formCard}>
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
                        returnKeyType="done"
                        onSubmitEditing={handleLogin}
                    />

                    {(localError || error) ? <Text style={styles.errorText}>{localError ?? error}</Text> : null}

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                        accessibilityRole="button"
                        accessibilityLabel="Ingresar"
                        accessibilityState={{ disabled: loading }}
                    >
                        <Text style={styles.buttonText}>{loading ? 'Ingresando...' : 'Ingresar'}</Text>
                    </TouchableOpacity>

                    <View style={styles.socialDivider}>
                        <View style={styles.socialLine} />
                        <Text style={styles.socialDividerText}>o continuar con</Text>
                        <View style={styles.socialLine} />
                    </View>

                    <TouchableOpacity
                        style={[styles.googleButton, loading && styles.buttonDisabled]}
                        onPress={handleGoogleLogin}
                        disabled={loading}
                        accessibilityRole="button"
                        accessibilityLabel="Ingresar con Google"
                        accessibilityState={{ disabled: loading }}
                    >
                        <View style={styles.googleIconWrap}>
                            <Image
                                source={require('../../../assets/images/google-icon.webp')}
                                style={styles.googleIconImage}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.googleButtonText}>Ingresar con Google</Text>
                    </TouchableOpacity>
                </View>

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
