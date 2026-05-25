import React, {
  createContext,
  useContext,
  useMemo,
} from 'react';
import { useColorScheme } from 'react-native';
import { useThemeContext } from 'src/core/contexts/ThemeContext';
import { getUITheme, UITheme } from '../tokens';

// ─────────────────────────────────────────────────────────────────────────────
// UIThemeContext — theme provider for V2 screens
//
// Delegates preference state to ThemeContext (single source of truth).
// When the user changes the theme in TabAjustes → setPreference updates
// ThemeContext → UIThemeProvider re-reads it → all V2 screens re-render.
// ─────────────────────────────────────────────────────────────────────────────

export type UIThemePreference = 'light' | 'dark' | 'system';

interface UIThemeContextValue {
  theme:         UITheme;
  preference:    UIThemePreference;
  isDark:        boolean;
  setPreference: (p: UIThemePreference) => void;
}

const UIThemeContext = createContext<UIThemeContextValue | null>(null);

export const UIThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();

  // Read preference from ThemeContext — single source of truth shared with
  // legacy AppTheme screens. UIThemeProvider must be rendered inside ThemeProvider.
  const { preference, setPreference } = useThemeContext();

  const resolvedMode = preference === 'system'
    ? (systemScheme ?? 'light')
    : preference;

  const theme = useMemo(() => getUITheme(resolvedMode), [resolvedMode]);

  const value = useMemo<UIThemeContextValue>(() => ({
    theme,
    preference,
    isDark: resolvedMode === 'dark',
    setPreference,
  }), [theme, preference, resolvedMode, setPreference]);

  return (
    <UIThemeContext.Provider value={value}>
      {children}
    </UIThemeContext.Provider>
  );
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** Returns the active UITheme. Primary hook for V2 components. */
export function useUITheme(): UITheme {
  const ctx = useContext(UIThemeContext);
  if (!ctx) throw new Error('useUITheme must be used inside <UIThemeProvider>');
  return ctx.theme;
}

/** Returns the full context including preference controls and isDark flag. */
export function useUIThemeContext(): UIThemeContextValue {
  const ctx = useContext(UIThemeContext);
  if (!ctx) throw new Error('useUIThemeContext must be used inside <UIThemeProvider>');
  return ctx;
}
