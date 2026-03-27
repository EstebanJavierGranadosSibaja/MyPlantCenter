import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

interface UseGoogleAuthOptions {
    onSuccess: (idToken: string) => Promise<void> | void;
    onError?: (message: string) => void;
}

type GoogleResponseShape = {
    type?: string;
    params?: {
        id_token?: string;
        error?: string;
        error_description?: string;
    };
    authentication?: {
        idToken?: string | null;
    };
    error?: {
        code?: string;
        message?: string;
    };
};

function getRedirectUriFromRequestUrl(requestUrl?: string): string {
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
    const shouldUseProxy = Constants.appOwnership !== 'standalone';
    const owner = Constants.expoConfig?.owner;
    const slug = Constants.expoConfig?.slug;
    const projectNameForProxy = owner && slug ? `@${owner}/${slug}` : undefined;

    const [googleLoading, setGoogleLoading] = useState(false);
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? defaultClientId,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? defaultClientId,
        webClientId,
        expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID ?? webClientId,
    });

    useEffect(() => {
        let mounted = true;

        const handleGoogleResponse = async () => {
            if (!response) {
                return;
            }

            if (response.type === 'dismiss') {
                console.info('[GoogleAuth][DISMISS]', {
                    appOwnership: Constants.appOwnership,
                    shouldUseProxy,
                    projectNameForProxy,
                });

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
                const redirectUri = getRedirectUriFromRequestUrl(request?.url);

                console.error('[GoogleAuth][RESPONSE_ERROR]', {
                    type: shapedResponse.type ?? response.type,
                    oauthError,
                    oauthDescription,
                    params: shapedResponse.params,
                    requestUrl: request?.url,
                    redirectUri,
                    appOwnership: Constants.appOwnership,
                    shouldUseProxy,
                    projectNameForProxy,
                });

                if (response.type !== 'dismiss') {
                    onError?.(
                        `Google auth fallo (${oauthError ?? response.type}). Redirect URI usado: ${redirectUri}. Detalle: ${oauthDescription}`,
                    );
                }

                if (mounted) {
                    setGoogleLoading(false);
                }
                return;
            }

            const shapedResponse = response as unknown as GoogleResponseShape;
            const idToken = shapedResponse.params?.id_token ?? shapedResponse.authentication?.idToken ?? '';

            if (!idToken) {
                onError?.('Google no devolvio idToken. Revisa la configuracion de client IDs.');
                if (mounted) {
                    setGoogleLoading(false);
                }
                return;
            }

            try {
                await onSuccess(idToken);
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
    }, [onError, onSuccess, response]);

    const authGoogle = async () => {
        if (!request) {
            onError?.('Google Auth no esta listo aun. Intenta de nuevo en un momento.');
            return;
        }

        const redirectUri = getRedirectUriFromRequestUrl(request.url);
        console.info('[GoogleAuth][REQUEST]', {
            appOwnership: Constants.appOwnership,
            shouldUseProxy,
            projectNameForProxy,
            requestUrl: request.url,
            redirectUri,
        });

        setGoogleLoading(true);

        try {
            await promptAsync(
                shouldUseProxy
                    ? {
                        useProxy: true,
                        projectNameForProxy,
                    }
                    : {},
            );
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