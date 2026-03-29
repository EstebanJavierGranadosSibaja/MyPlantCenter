import { FirebaseError } from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    getIdToken,
    GoogleAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
} from 'firebase/auth';

import { auth } from 'src/core/config/firebase';
import httpClient from 'src/core/http/client';
import { validateLoginInput, validateRegisterInput } from 'src/features/auth/validators/auth.validators';
import { ApiResponse } from 'src/features/profile/types/user.types';

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

export interface GoogleTokens {
    idToken?: string;
    accessToken?: string;
}

const debugAuth = process.env.EXPO_PUBLIC_DEBUG_AUTH === 'true';

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
        const messageLower = error.message.toLowerCase();

        switch (error.code) {
            case 'auth/invalid-email':
                return 'Correo inválido.';
            case 'auth/invalid-credential':
                if (messageLower.includes('not allowed to be used with this application') || messageLower.includes('not authorized to be used in the project')) {
                    return 'El Google Client ID configurado no pertenece al mismo proyecto de Firebase. Usa los OAuth Client IDs creados dentro de este Firebase project.';
                }
                return 'Credencial de Google inválida o expirada. Intenta de nuevo y verifica la configuración OAuth de Android.';
            case 'auth/wrong-password':
                return 'Correo o contraseña incorrectos.';
            case 'auth/email-already-in-use':
                return 'Ya existe una cuenta con este correo.';
            case 'auth/weak-password':
                return 'La contraseña es demasiado débil.';
            case 'auth/configuration-not-found':
                return 'Configuracion de Firebase Auth no encontrada, verifica API key, appId y habilita Email/Password en Firebase Console.';
            case 'auth/account-exists-with-different-credential':
                return 'Este correo ya existe con otro método de inicio de sesión.';
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

async function ensureBackendProfile(
    user: User,
    options?: {
        nickname?: string;
    },
): Promise<void> {
    const email = user.email ?? '';
    const preferredNickname = stripNicknamePrefix(options?.nickname ?? '');
    const nickname = preferredNickname || deriveNickname(email, user.displayName);
    const fullName = user.displayName?.trim() || nickname;
    const method = resolveAuthMethod(user);
    const provider = method === 'google' ? 'google.com' : 'password';

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
            if (debugAuth && error instanceof FirebaseError) {
                console.error('[AuthService][EmailLoginError]', {
                    code: error.code,
                    message: error.message,
                });
            }

            return {
                success: false,
                error: normalizeFirebaseError(error),
            };
        }
    },

    async loginWithGoogle(tokens: GoogleTokens): Promise<AuthResponse> {
        const idToken = tokens.idToken?.trim();
        const accessToken = tokens.accessToken?.trim();

        if (!idToken && !accessToken) {
            return {
                success: false,
                error: 'No se recibieron tokens de Google (idToken/accessToken).',
            };
        }

        try {
            const credential = GoogleAuthProvider.credential(idToken ?? null, accessToken);
            const credentials = await signInWithCredential(auth, credential);

            await ensureBackendProfile(credentials.user);

            const token = await getIdToken(credentials.user, true);
            const email = credentials.user.email ?? '';
            const nickname = deriveNickname(email, credentials.user.displayName);
            const fullName = credentials.user.displayName?.trim() || nickname;

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
            if (debugAuth && error instanceof FirebaseError) {
                console.error('[AuthService][GoogleRegisterError]', {
                    code: error.code,
                    message: error.message,
                    hasIdToken: Boolean(idToken),
                    hasAccessToken: Boolean(accessToken),
                });
            }

            return {
                success: false,
                error: normalizeFirebaseError(error),
            };
        }

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

    async registerWithGoogle(nickname: string, tokens: GoogleTokens): Promise<AuthResponse> {
        const idToken = tokens.idToken?.trim();
        const accessToken = tokens.accessToken?.trim();

        if (!idToken && !accessToken) {
            return {
                success: false,
                error: 'No se recibieron tokens de Google (idToken/accessToken).',
            };
        }

        try {
            const credential = GoogleAuthProvider.credential(idToken ?? null, accessToken);
            const credentials = await signInWithCredential(auth, credential);
            const preferredNickname = stripNicknamePrefix(nickname);

            await ensureBackendProfile(credentials.user, {
                nickname: preferredNickname,
            });

            const token = await getIdToken(credentials.user, true);
            const email = credentials.user.email ?? '';
            const resolvedNickname = preferredNickname || deriveNickname(email, credentials.user.displayName);
            const fullName = credentials.user.displayName?.trim() || resolvedNickname;

            return {
                success: true,
                user: buildAuthUser(
                    credentials.user.uid,
                    email,
                    fullName,
                    resolvedNickname,
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
