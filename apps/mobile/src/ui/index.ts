// src/ui — V2 Design System public API
//
// All V2 components and tokens are exported from here.
// Never import directly from subdirectories — use 'src/ui'.
//
// Example:
//   import { useUITheme, Text, Button, TextField, Screen } from 'src/ui';

// ── Tokens ────────────────────────────────────────────────────────────────────
export { getUITheme } from './tokens';
export type {
  UITheme,
  UIMode,
  UIColors,
  UITextStyles,
  UITextStyle,
  UIFontFamily,
  UIFontSize,
  UIFontWeight,
  UILineHeight,
  UISpacing,
  UIRadius,
  UIShadow,
  UIShadows,
  UIMotion,
  UILayout,
  UIZIndex,
} from './tokens';

// ── Theme ─────────────────────────────────────────────────────────────────────
export {
  UIThemeProvider,
  useUITheme,
  useUIThemeContext,
} from './theme/UIThemeContext';
export type { UIThemePreference } from './theme/UIThemeContext';

// ── Primitives ────────────────────────────────────────────────────────────────
export { Text, Surface, Button, TextField, ScreenHeader, DetailHeader } from './primitives';
export type {
  TextProps,
  SurfaceProps,
  ButtonProps, ButtonVariant, ButtonSize,
  TextFieldProps,
  ScreenHeaderProps,
  DetailHeaderProps,
} from './primitives';

// ── Layouts ───────────────────────────────────────────────────────────────────
export { Screen, KeyboardScreen } from './layouts';
export type { ScreenProps, KeyboardScreenProps } from './layouts';
