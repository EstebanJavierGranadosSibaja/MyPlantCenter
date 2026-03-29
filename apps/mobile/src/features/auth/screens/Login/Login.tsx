import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth as useAuthContext } from 'src/core/contexts/AuthContext';
import { AuthStackParamList } from 'src/core/navigation/AppNavigator';
import { LoginFormValues, LoginSchema } from 'src/features/auth/validators/auth.validators';
import { useFormToast } from 'src/shared/components/feedback/FormToast/useFormToast';
import { CustomSafeArea } from 'src/shared/components/layout/CustomSafeArea';
import { FormInput } from 'src/shared/components/ui/FormInput/FormInput';
import { useGoogleAuth } from 'src/shared/hooks/useAuth';
import { useLoginTheme } from './Login.styles';

type LoginProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const Login: React.FC<LoginProps> = ({ navigation }) => {
    const { styles } = useLoginTheme();
    const { loginWithEmail, loginWithGoogle, loading, clearError } = useAuthContext();
    const { showToast } = useFormToast();
    const { authGoogle, googleLoading } = useGoogleAuth({
        onSuccess: async tokens => {
            await loginWithGoogle(tokens);
        },
        onError: (message: string) => {
            showToast({
                type: 'error',
                title: message,
                autoDismiss: false,
            });
        },
    });
    const passwordRef = useRef<TextInput>(null);
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onSubmit',
    });

    const handleLogin = handleSubmit(async values => {
        clearError();
        const success = await loginWithEmail({
            email: values.email.trim(),
            password: values.password,
        });

        if (!success) {
            showToast({
                type: 'error',
                title: 'Correo o contraseña incorrectos',
            });
        }
    }, invalidValues => {
        const firstError =
            invalidValues.email?.message ??
            invalidValues.password?.message ??
            errors.email?.message ??
            errors.password?.message ??
            'Revisa los campos del formulario.';

        showToast({
            type: 'warning',
            title: 'Revisa los campos del formulario',
            subtitle: firstError,
        });
    });

    const handleGoogleLogin = async () => {
        clearError();
        await authGoogle();
    };

    const isButtonDisabled = isSubmitting || loading;

    return (
        <CustomSafeArea>
            <View style={styles.safe}>
                <Text style={styles.title}>Iniciar sesion</Text>
                <Text style={styles.subtitle}>Bienvenido de vuelta a MyPlantCenter</Text>

                <View style={styles.formCard}>
                    <FormInput
                        control={control}
                        name="email"
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
                        returnKeyType="done"
                        onSubmitEditing={handleLogin}
                    />

                    <TouchableOpacity
                        style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={isButtonDisabled}
                        accessibilityRole="button"
                        accessibilityLabel="Ingresar"
                        accessibilityState={{ disabled: isButtonDisabled }}
                    >
                        {isSubmitting ? <ActivityIndicator color="white" /> : null}
                        <Text style={styles.buttonText}>{isSubmitting ? 'Ingresando...' : 'Ingresar'}</Text>
                    </TouchableOpacity>

                    <View style={styles.socialDivider}>
                        <View style={styles.socialLine} />
                        <Text style={styles.socialDividerText}>o continuar con</Text>
                        <View style={styles.socialLine} />
                    </View>

                    <TouchableOpacity
                        style={[styles.googleButton, (loading || googleLoading) && styles.buttonDisabled]}
                        onPress={handleGoogleLogin}
                        disabled={loading || googleLoading}
                        accessibilityRole="button"
                        accessibilityLabel="Ingresar con Google"
                        accessibilityState={{ disabled: loading || googleLoading }}
                    >
                        <View style={styles.googleIconWrap}>
                            <Image
                                source={require('../../../../../assets/images/google-icon.webp')}
                                style={styles.googleIconImage}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.googleButtonText}>{googleLoading ? 'Conectando con Google...' : 'Ingresar con Google'}</Text>
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
