import {
    createUserWithEmailAndPassword,
    User,
    getIdToken,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

import { auth } from 'src/config/firebase';
import httpClient from 'src/services/http/client';
import { validateLoginInput, validateRegisterInput } from 'src/services/validators/auth.validators';
import { ApiResponse } from 'src/types-dtos/user.types';

export type AuthMethod = 'email' | 'google';

export interface LoginDTO {
    email: string;
    password: string;
}

export interface RegisterDTO {
    fullName: string;
    email: string;
    nickname: string;
    password: string;
    confirmPassword: string;
    method: AuthMethod;
}

export interface AuthUser {
    id: string;
    fullName: string;
    email: string;
    nickname: string;
    method: AuthMethod;
}

export interface AuthResponse {
    success: boolean;
    user?: AuthUser;
    error?: string;
    token?: string;
}

function deriveNickname(email: string, fallback?: string | null): string {
    const source = fallback && fallback.trim().length > 0 ? fallback : email.split('@')[0];
    return stripNicknamePrefix(source);
}

function resolveAuthMethod(user: User): AuthMethod {
    const providers = user.providerData.map(item => item.providerId);
    return providers.includes('google.com') ? 'google' : 'email';
}

function normalizeFirebaseError(error: unknown): string {
    if (error instanceof FirebaseError) {
        switch (error.code) {
            case 'auth/invalid-email':
                return 'Correo inválido.';
            case 'auth/invalid-credential':
            case 'auth/wrong-password':
                return 'Correo o contraseña incorrectos.';
            case 'auth/email-already-in-use':
                return 'Ya existe una cuenta con este correo.';
            case 'auth/weak-password':
                return 'La contraseña es demasiado débil.';
            case 'auth/configuration-not-found':
                return 'Configuracion de Firebase Auth no encontrada, verifica API key, appId y habilita Email/Password en Firebase Console.';
            default:
                return error.message;
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Error de autenticación inesperado.';
}

function stripNicknamePrefix(nickname: string): string {
    return nickname.replace(/^@+/, '').trim();
}

function buildAuthUser(
    uid: string,
    email: string,
    fullName: string,
    nickname: string,
    method: AuthMethod,
): AuthUser {
    return {
        id: uid,
        fullName,
        email,
        nickname: stripNicknamePrefix(nickname),
        method,
    };
}

async function ensureBackendProfile(user: User): Promise<void> {
    const email = user.email ?? '';
    const fullName = user.displayName?.trim() || deriveNickname(email, user.displayName);
    const nickname = deriveNickname(email, user.displayName);
    const method = resolveAuthMethod(user);
    const provider = method === 'google' ? 'google.com' : 'password';

    const existingProfile = await httpClient.get<ApiResponse<unknown>>(`/api/users/${user.uid}`);
    const existingAuthUser = await httpClient.get<ApiResponse<unknown>>(`/api/auth-users/${user.uid}`);

    if (existingProfile.data.success && existingAuthUser.data.success) {
        return;
    }

    const response = await httpClient.post<ApiResponse<unknown>>('/api/users', {
        id: user.uid,
        authUserId: user.uid,
        name: fullName,
        nickname,
        email,
        method,
        provider,
        emailVerified: user.emailVerified,
    });

    if (!response.data.success) {
        throw new Error(response.data.error ?? 'No se pudo sincronizar el perfil de usuario.');
    }
}

const authService = {
    async loginWithEmail(dto: LoginDTO): Promise<AuthResponse> {
        const validationError = validateLoginInput({
            email: dto.email,
            password: dto.password,
        });

        if (validationError) {
            return {
                success: false,
                error: validationError,
            };
        }

        try {
            const credentials = await signInWithEmailAndPassword(
                auth,
                dto.email.trim(),
                dto.password,
            );

            await ensureBackendProfile(credentials.user);

            const token = await getIdToken(credentials.user, true);
            const nickname = deriveNickname(dto.email, credentials.user.displayName);
            const fullName = credentials.user.displayName?.trim() || nickname;
            const email = credentials.user.email ?? dto.email.trim();

            return {
                success: true,
                user: buildAuthUser(
                    credentials.user.uid,
                    email,
                    fullName,
                    nickname,
                    resolveAuthMethod(credentials.user),
                ),
                token,
            };
        } catch (error: unknown) {
            return {
                success: false,
                error: normalizeFirebaseError(error),
            };
        }
    },

    async loginWithGoogle(): Promise<AuthResponse> {
        // Para activar Google OAuth sin refactor grande:
        // 1. Integrar expo-auth-session/providers/google
        // 2. Intercambiar Google credential por Firebase credential con GoogleAuthProvider
        // 3. Reutilizar el mismo flujo de post-login y token de este servicio
        return {
            success: false,
            error: 'Google OAuth aún no está habilitado en esta fase.',
        };
    },

    async registerWithEmail(dto: RegisterDTO): Promise<AuthResponse> {
        const validationError = validateRegisterInput({
            fullName: dto.fullName,
            nickname: dto.nickname,
            email: dto.email,
            password: dto.password,
            confirmPassword: dto.confirmPassword,
        });

        if (validationError) {
            return {
                success: false,
                error: validationError,
            };
        }

        try {
            const credentials = await createUserWithEmailAndPassword(
                auth,
                dto.email.trim(),
                dto.password,
            );

            await updateProfile(credentials.user, {
                displayName: dto.fullName.trim(),
            });

            await ensureBackendProfile(credentials.user);

            const token = await getIdToken(credentials.user, true);
            const nickname = stripNicknamePrefix(dto.nickname);

            return {
                success: true,
                user: buildAuthUser(
                    credentials.user.uid,
                    dto.email.trim(),
                    dto.fullName.trim(),
                    nickname,
                    resolveAuthMethod(credentials.user),
                ),
                token,
            };
        } catch (error: unknown) {
            return {
                success: false,
                error: normalizeFirebaseError(error),
            };
        }
    },

    async registerWithGoogle(nickname: string): Promise<AuthResponse> {
        // Para activar Google OAuth sin refactor grande:
        // 1. Resolver autenticación con expo-auth-session
        // 2. Convertir credencial Google a Firebase con GoogleAuthProvider
        // 3. Llamar POST /api/users con uid y perfil base igual que registerWithEmail
        // 4. Reutilizar buildAuthUser + token de Firebase
        return {
            success: false,
            error: `Google OAuth aún no está habilitado. Nickname recibido: ${stripNicknamePrefix(nickname)}`,
        };
    },

    async logout(): Promise<void> {
        await signOut(auth);
    },

    async restoreSession(): Promise<AuthUser | null> {
        const currentUser = auth.currentUser;
        if (!currentUser || !currentUser.email) {
            return null;
        }

        await ensureBackendProfile(currentUser);

        const nickname = deriveNickname(currentUser.email, currentUser.displayName);
        const fullName = currentUser.displayName?.trim() || nickname;

        return buildAuthUser(
            currentUser.uid,
            currentUser.email,
            fullName,
            nickname,
            resolveAuthMethod(currentUser),
        );
    },
};

export { authService };