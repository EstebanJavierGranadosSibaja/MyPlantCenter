import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { AppTheme, getAppTheme } from 'src/core/theme/designSystem';

// Tipos
export type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  preference: ThemePreference;
  theme: AppTheme;
  setPreference: (p: ThemePreference) => void;
}

// Contexto 
export const AppThemeContext = createContext<ThemeContextValue | null>(null);

// Provider
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');

  const resolvedMode = preference === 'system'
    ? (systemScheme ?? 'light')
    : preference;

  const theme = getAppTheme(resolvedMode);

  // Aplica el color programáticamente — más confiable que solo el prop en Android
  React.useEffect(() => {
    StatusBar.setBarStyle(
      resolvedMode === 'dark' ? 'light-content' : 'dark-content',
      true,
    );
  }, [resolvedMode]);

  const handleSet = useCallback((p: ThemePreference) => {
    setPreference(p);
  }, []);

  return (
    <AppThemeContext.Provider value={{ preference, theme, setPreference: handleSet }}>
      <StatusBar
        barStyle={resolvedMode === 'dark' ? 'light-content' : 'dark-content'}
        translucent={true}
      />
      {children}
    </AppThemeContext.Provider>
  );
};

// Hooks 
export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(AppThemeContext);
  if (!ctx) throw new Error('useThemeContext debe usarse dentro de <ThemeProvider>');
  return ctx;
}

export function useAppThemeContext(): AppTheme {
  return useThemeContext().theme;
}