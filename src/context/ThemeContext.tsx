import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppTheme, getAppTheme } from 'src/theme/designSystem';

export type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  preference: ThemePreference;
  theme: AppTheme;
  setPreference: (p: ThemePreference) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');

  const resolvedMode = preference === 'system'
    ? (systemScheme ?? 'light')
    : preference;

  const theme = getAppTheme(resolvedMode);

  const handleSet = useCallback((p: ThemePreference) => {
    setPreference(p);
  }, []);

  return (
    <ThemeContext.Provider value={{ preference, theme, setPreference: handleSet }}>
      <StatusBar
        style={resolvedMode === 'dark' ? 'light' : 'dark'}
        backgroundColor={theme.colors.heroBg}
        translucent={false}
      />
      {children}
    </ThemeContext.Provider>
  );
};

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext debe usarse dentro de <ThemeProvider>');
  return ctx;
}

export function useAppThemeContext(): AppTheme {
  return useThemeContext().theme;
}