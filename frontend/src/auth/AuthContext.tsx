import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { authService, AuthUser, LoginDTO, RegisterDTO } from 'src/services/auth.service';

// Tipos
interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    loginWithEmail: (dto: LoginDTO) => Promise<boolean>;
    loginWithGoogle: (idToken: string) => Promise<boolean>;
    registerWithEmail: (dto: RegisterDTO) => Promise<boolean>;
    registerWithGoogle: (nickname: string, idToken: string) => Promise<boolean>;
    logout: () => Promise<void>;
    clearError: () => void;
}

// Contexto
const AuthContext = createContext<AuthContextValue | null>(null);

// Provider 
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleResponse = useCallback(async (
        fn: () => Promise<{ success: boolean; user?: AuthUser; error?: string }>
    ): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const res = await fn();
            if (res.success && res.user) {
                setUser(res.user);
                // cuando llegue el backend:
                // guardar token en AsyncStorage aquí
                return true;
            }
            setError(res.error ?? 'Error desconocido.');
            return false;
        } catch {
            setError('Error de conexión. Intenta de nuevo.');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const loginWithEmail = useCallback((dto: LoginDTO) =>
        handleResponse(() => authService.loginWithEmail(dto)),
        [handleResponse]);

    const loginWithGoogle = useCallback((idToken: string) =>
        handleResponse(() => authService.loginWithGoogle(idToken)),
        [handleResponse]);

    const registerWithEmail = useCallback((dto: RegisterDTO) =>
        handleResponse(() => authService.registerWithEmail(dto)),
        [handleResponse]);

    const registerWithGoogle = useCallback((nickname: string, idToken: string) =>
        handleResponse(() => authService.registerWithGoogle(nickname, idToken)),
        [handleResponse]);

    const logout = useCallback(async () => {
        setLoading(true);
        await authService.logout();
        setUser(null);
        // cuando llegue el backend: limpiar AsyncStorage
        setLoading(false);
    }, []);

    const clearError = useCallback(() => setError(null), []);

    useEffect(() => {
        let mounted = true;

        const bootstrap = async () => {
            try {
                const sessionUser = await authService.restoreSession();
                if (mounted) {
                    setUser(sessionUser);
                }
            } catch {
                if (mounted) {
                    setUser(null);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        bootstrap();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            isAuthenticated: !!user,
            loginWithEmail,
            loginWithGoogle,
            registerWithEmail,
            registerWithGoogle,
            logout,
            clearError,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
    return ctx;
}