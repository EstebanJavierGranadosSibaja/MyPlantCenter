import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

interface UseGoogleAuthOptions {
    onSuccess: (tokens: { idToken?: string; accessToken?: string }) => Promise<void> | void;
    onError?: (message: string) => void;
}

type GoogleResponseShape = {
    type?: string;
    params?: {
        id_token?: string;
        access_token?: string;
        error?: string;
        error_description?: string;
    };
    authentication?: {
        idToken?: string | null;
        accessToken?: string | null;
    };
    error?: {
        code?: string;
        message?: string;
    };
};

function getRedirectUriFromRequestUrl(requestUrl?: string | null): string {
    if (!requestUrl) {
        return 'N/A';
    }

    try {
        const parsed = new URL(requestUrl);
        return parsed.searchParams.get('redirect_uri') ?? 'N/A';
    } catch {
        return 'N/A';
    }
}

export function useGoogleAuth({ onSuccess, onError }: UseGoogleAuthOptions) {
    const defaultClientId = process.env.EXPO_PUBLIC_GOOGLE_ID;
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? defaultClientId;
    const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? defaultClientId;
    const debugAuth = process.env.EXPO_PUBLIC_DEBUG_AUTH === 'true';
    const googleClientIdPrefix = androidClientId?.replace('.apps.googleusercontent.com', '');
    const googleNativeScheme = googleClientIdPrefix
        ? `com.googleusercontent.apps.${googleClientIdPrefix}`
        : undefined;
    const redirectUri = makeRedirectUri({
        native: googleNativeScheme ? `${googleNativeScheme}:/oauth2redirect` : 'myplantcenter:/oauth2redirect',
        path: 'oauth2redirect',
    });

    const [googleLoading, setGoogleLoading] = useState(false);
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        androidClientId,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? defaultClientId,
        webClientId,
        redirectUri,
    });

    useEffect(() => {
        let mounted = true;

        const handleGoogleResponse = async () => {
            if (!response) {
                return;
            }

            if (response.type === 'dismiss') {
                if (debugAuth) {
                    console.info('[GoogleAuth][DISMISS]');
                }

                if (mounted) {
                    setGoogleLoading(false);
                }
                return;
            }

            if (response.type !== 'success') {
                const shapedResponse = response as unknown as GoogleResponseShape;
                const oauthError = shapedResponse.params?.error ?? shapedResponse.error?.code;
                const oauthDescription =
                    shapedResponse.params?.error_description ??
                    shapedResponse.error?.message ??
                    'Sin detalle adicional.';

                if (debugAuth) {
                    const requestRedirectUri = getRedirectUriFromRequestUrl(request?.url);

                    console.error('[GoogleAuth][RESPONSE_ERROR]', {
                        type: shapedResponse.type ?? response.type,
                        oauthError,
                        oauthDescription,
                        params: shapedResponse.params,
                        requestUrl: request?.url,
                        requestRedirectUri,
                    });
                }

                onError?.(
                    `Google auth fallo (${oauthError ?? response.type}). Detalle: ${oauthDescription}`,
                );

                if (mounted) {
                    setGoogleLoading(false);
                }
                return;
            }

            const shapedResponse = response as unknown as GoogleResponseShape;
            const idToken = shapedResponse.params?.id_token ?? shapedResponse.authentication?.idToken ?? '';
            const accessToken = shapedResponse.params?.access_token ?? shapedResponse.authentication?.accessToken ?? '';

            if (!idToken && !accessToken) {
                onError?.('Google no devolvio tokens (idToken/accessToken). Revisa la configuracion de client IDs.');
                if (mounted) {
                    setGoogleLoading(false);
                }
                return;
            }

            try {
                await onSuccess({
                    idToken,
                    accessToken,
                });
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'No se pudo completar el login con Google.';
                onError?.(message);
            } finally {
                if (mounted) {
                    setGoogleLoading(false);
                }
            }
        };

        handleGoogleResponse();

        return () => {
            mounted = false;
        };
    }, [debugAuth, onError, onSuccess, request?.url, response]);

    const authGoogle = async () => {
        if (!request) {
            onError?.('Google Auth no esta listo aun. Intenta de nuevo en un momento.');
            return;
        }

        if (debugAuth) {
            const requestRedirectUri = getRedirectUriFromRequestUrl(request.url);

            console.info('[GoogleAuth][REQUEST]', {
                configuredRedirectUri: requestRedirectUri,
                requestUrl: request.url,
                requestRedirectUri,
            });
        }

        setGoogleLoading(true);

        try {
            await promptAsync();
        } catch (error: unknown) {
            setGoogleLoading(false);
            const message = error instanceof Error ? error.message : 'Error al iniciar la sesion con Google.';
            onError?.(message);
        }
    };

    return {
        authGoogle,
        googleLoading,
    };
}