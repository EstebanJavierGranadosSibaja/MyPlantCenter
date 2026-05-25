import { ColorSchemeName, useColorScheme, Platform } from "react-native";

type ThemeMode = 'light' | 'dark';

// ─── Colors ───────────────────────────────────────────────────────────────────

interface ThemeColors {
  // Surfaces — layered from darkest to lightest
  background: string;
  backgroundAlt: string;
  surface: string;
  elevated: string;

  // Brand
  primary: string;
  secondary: string;
  primaryLight: string;
  accent: string;
  accentSoft: string;
  primaryDark: string;
  accentDark: string;

  // Text — four levels
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textTertiary: string;
  textInverse: string;

  // Structural
  border: string;
  divider: string;
  overlay: string;

  // Hero section
  heroBg: string;
  heroText: string;
  heroAccent: string;
  heroInputBg: string;
  heroInputBgSubtle: string;
  heroInputBorder: string;
  heroInputBorderSubtle: string;
  heroTextSubtle: string;
  heroAccentMuted: string;
  heroHighlightPrimary: string;
  heroBottomLayer: string;

  // Cards
  cardBg: string;
  cardBorder: string;

  // Tab bar
  tabActive: string;
  tabInactive: string;
  tabBg: string;
  tabBarGlassBg: string;
  tabBarGlassBorder: string;

  // Toggle
  toggleActive: string;
  toggleInactive: string;
  toggleThumbActive: string;
  toggleThumbInactive: string;

  // Feature-specific
  logroActiveBg: string;
  logroActiveBorder: string;
  favPlantIconBg: string;

  // Action list colors
  actionExport: string;
  actionPassword: string;
  actionLogout: string;
  actionDelete: string;

  // Semantic states
  success: string;
  warning: string;
  error: string;

  trackColor: string;
}

// ─── Spacing ──────────────────────────────────────────────────────────────────

interface ThemeSpacing {
  '5xs': number;  // 2
  '4xs': number;  // 4
  '3xs': number;  // 6
  '2xs': number;  // 8
  xs: number;     // 12
  sm: number;     // 16
  md: number;     // 24
  lg: number;     // 32
  xl: number;     // 40
  '2xl': number;  // 48
  '3xl': number;  // 56
  '4xl': number;  // 64
  '5xl': number;  // 72
  '6xl': number;  // 80
}

// ─── Radius ───────────────────────────────────────────────────────────────────

interface ThemeRadius {
  '4xs': number;  // 1
  '3xs': number;  // 1.5
  '2xs': number;  // 3
  xs: number;     // 6
  sm: number;     // 10
  md: number;     // 16
  lg: number;     // 24
  xl: number;     // 28
  full: number;   // 9999
}

// ─── Typography ───────────────────────────────────────────────────────────────

interface ThemeTypography {
  family: {
    displayRegular: string;
    displayItalic: string;
    displayBold: string;
    displayBoldItalic: string;
    bodyLight: string;
    bodyRegular: string;
    bodyMedium: string;
    bodySemiBold: string;
    bodyBold: string;
  };
  size: {
    xs: number;     // 13
    sm: number;     // 14
    base: number;   // 16
    md: number;     // 17
    lg: number;     // 18
    xl: number;     // 20
    '2xl': number;  // 22
    '3xl': number;  // 26
    '4xl': number;  // 30
    '5xl': number;  // 34
    '6xl': number;  // 38
  };
  lineHeight: {
    tight: number;   // 18
    snug: number;    // 22
    normal: number;  // 24
    relaxed: number; // 28
    loose: number;   // 34
  };
  letterSpacing: {
    tight: number;   // -0.3
    normal: number;  // 0
    wide: number;    // 0.4
    wider: number;   // 0.8
    widest: number;  // 1.4
  };
}

// ─── Borders ──────────────────────────────────────────────────────────────────

interface ThemeBorders {
  thin: number;   // 0.5
  base: number;   // 1
  thick: number;  // 1.5
  bold: number;   // 2
}

// ─── Opacity ──────────────────────────────────────────────────────────────────

interface ThemeOpacity {
  disabled: number;  // 0.45
  medium: number;    // 0.25
  light: number;     // 0.12
  overlay: number;   // 0.50
  subtle: number;    // 0.08
}

// ─── Shadows ──────────────────────────────────────────────────────────────────

interface ThemeShadow {
  color: string;
  offset: { width: number; height: number };
  opacity: number;
  radius: number;
  elevation: number;
}

interface ThemeShadows {
  none: ThemeShadow;
  sm: ThemeShadow;
  md: ThemeShadow;
  lg: ThemeShadow;
}

// ─── Layout ───────────────────────────────────────────────────────────────────

interface ThemeLayout {
  // Screen
  screenPaddingH: number;        // 24
  screenPaddingV: number;        // 20

  // Hero
  heroPaddingTop: number;        // 48
  heroPaddingBottom: number;     // 72

  // Stats
  statsCardOverlap: number;      // -30

  // Avatar
  avatarSm: number;              // 40
  avatarMd: number;              // 60
  avatarLg: number;              // 80
  avatarOnlineDotOffset: number; // -6
  avatarBadgeOffset: number;     // -6

  // Icons — legacy (prefer iconSm/Md/Lg/Xl below)
  favIconSize: number;           // 56
  categoryIconSize: number;      // 36

  // Icons — semantic system
  iconSm: number;                // 18
  iconMd: number;                // 22
  iconLg: number;                // 28
  iconXl: number;                // 36

  // Charts
  chartHeight: number;           // 80
  chartBarMin: number;           // 8
  chartBarRadius: number;        // 5

  // Toggle
  toggleTrackW: number;          // 44
  toggleTrackH: number;          // 24
  toggleThumbSz: number;         // 18
  toggleThumbOff: number;        // 3

  // Tab bar
  tabBarRadius: number;          // 14
  tabBarPadding: number;         // 4

  // Logros
  logroSize: number;             // 52

  // Header
  headerHeight: number;          // 56

  // Modal
  modalActionMinWidth: number;   // 96

  // Component heights
  buttonHeightSm: number;        // 36
  buttonHeightMd: number;        // 44
  buttonHeightLg: number;        // 52
  inputHeight: number;           // 48
  tabBarHeight: number;          // 64
  chipHeight: number;            // 28
  badgeSize: number;             // 20

  // Semantic spacing
  cardPadding: number;           // 20
  cardGap: number;               // 12
  sectionGap: number;            // 28

  // Semantic radius
  buttonRadius: number;          // 12
  cardRadius: number;            // 16
  inputRadius: number;           // 12
  chipRadius: number;            // 9999
  modalRadius: number;           // 24
  sheetRadius: number;           // 28
}

// ─── Z-Index ──────────────────────────────────────────────────────────────────

interface ThemeZIndex {
  base: number;      // 0
  card: number;      // 1
  dropdown: number;  // 10
  sticky: number;    // 20
  overlay: number;   // 40
  modal: number;     // 50
  toast: number;     // 100
}

// ─── Composed text styles ─────────────────────────────────────────────────────

interface ThemeTextStyle {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
}

interface ThemeTextStyles {
  display: ThemeTextStyle;    // 34px bold    — hero headings
  h1: ThemeTextStyle;         // 30px bold    — page titles
  h2: ThemeTextStyle;         // 26px semibold — section headings
  h3: ThemeTextStyle;         // 22px semibold — card titles
  title: ThemeTextStyle;      // 20px semibold — item titles
  subtitle: ThemeTextStyle;   // 18px medium  — secondary titles
  body: ThemeTextStyle;       // 16px regular — main content
  bodySmall: ThemeTextStyle;  // 14px regular — secondary content
  caption: ThemeTextStyle;    // 13px regular — supporting info
  overline: ThemeTextStyle;   // 13px semibold uppercase — section labels
  button: ThemeTextStyle;     // 16px semibold — primary CTA
  buttonSm: ThemeTextStyle;   // 14px semibold — secondary CTA
  label: ThemeTextStyle;      // 14px medium  — form labels
}

// ─── Root theme ───────────────────────────────────────────────────────────────

export interface AppTheme {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  typography: ThemeTypography;
  borders: ThemeBorders;
  opacity: ThemeOpacity;
  shadows: ThemeShadows;
  layout: ThemeLayout;
  zIndex: ThemeZIndex;
  textStyles: ThemeTextStyles;
}

// ─── Shared primitives ────────────────────────────────────────────────────────

const sharedSpacing: ThemeSpacing = {
  '5xs': 2,
  '4xs': 4,
  '3xs': 6,
  '2xs': 8,
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  '2xl': 48,
  '3xl': 56,
  '4xl': 64,
  '5xl': 72,
  '6xl': 80,
};

const sharedRadius: ThemeRadius = {
  '4xs': 1,
  '3xs': 1.5,
  '2xs': 3,
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 28,
  full: 9999,
};

const sharedBorders: ThemeBorders = {
  thin: 0.5,
  base: 1,
  thick: 1.5,
  bold: 2,
};

const sharedOpacity: ThemeOpacity = {
  disabled: 0.45,
  medium: 0.25,
  light: 0.12,
  overlay: 0.50,
  subtle: 0.08,
};

const sharedZIndex: ThemeZIndex = {
  base: 0,
  card: 1,
  dropdown: 10,
  sticky: 20,
  overlay: 40,
  modal: 50,
  toast: 100,
};

// Softer shadows — elevation communicated by contrast, not weight
const createShadows = (shadowColor: string): ThemeShadows => ({
  none: {
    color: 'transparent',
    offset: { width: 0, height: 0 },
    opacity: 0,
    radius: 0,
    elevation: 0,
  },
  sm: {
    color: shadowColor,
    offset: { width: 0, height: 1 },
    opacity: 0.06,
    radius: 4,
    elevation: 1,
  },
  md: {
    color: shadowColor,
    offset: { width: 0, height: 2 },
    opacity: 0.09,
    radius: 8,
    elevation: 3,
  },
  lg: {
    color: shadowColor,
    offset: { width: 0, height: 4 },
    opacity: 0.13,
    radius: 16,
    elevation: 6,
  },
});

const sharedTypography: ThemeTypography = {
  family: {
    displayRegular:    Platform.select({ android: 'sans-serif',           ios: 'System' }) as string,
    displayItalic:     Platform.select({ android: 'sans-serif',           ios: 'System' }) as string,
    displayBold:       Platform.select({ android: 'sans-serif-medium',    ios: 'System' }) as string,
    displayBoldItalic: Platform.select({ android: 'sans-serif-medium',    ios: 'System' }) as string,
    bodyLight:         Platform.select({ android: 'sans-serif-light',     ios: 'System' }) as string,
    bodyRegular:       Platform.select({ android: 'sans-serif',           ios: 'System' }) as string,
    bodyMedium:        Platform.select({ android: 'sans-serif-medium',    ios: 'System' }) as string,
    bodySemiBold:      Platform.select({ android: 'sans-serif-medium',    ios: 'System' }) as string,
    bodyBold:          Platform.select({ android: 'sans-serif-condensed', ios: 'System' }) as string,
  },
  size: {
    xs: 13,
    sm: 14,
    base: 16,
    md: 17,
    lg: 18,
    xl: 20,
    '2xl': 22,
    '3xl': 26,
    '4xl': 30,
    '5xl': 34,
    '6xl': 38,
  },
  lineHeight: {
    tight: 18,
    snug: 22,
    normal: 24,
    relaxed: 28,
    loose: 34,
  },
  letterSpacing: {
    tight: -0.3,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
    widest: 1.4,
  },
};

const createTextStyles = (t: ThemeTypography): ThemeTextStyles => ({
  display: {
    fontFamily: t.family.displayBold,
    fontSize: t.size['5xl'],
    lineHeight: t.lineHeight.loose,
    letterSpacing: t.letterSpacing.tight,
  },
  h1: {
    fontFamily: t.family.displayBold,
    fontSize: t.size['4xl'],
    lineHeight: t.lineHeight.loose,
    letterSpacing: t.letterSpacing.tight,
  },
  h2: {
    fontFamily: t.family.bodySemiBold,
    fontSize: t.size['3xl'],
    lineHeight: t.lineHeight.relaxed,
    letterSpacing: t.letterSpacing.normal,
  },
  h3: {
    fontFamily: t.family.bodySemiBold,
    fontSize: t.size['2xl'],
    lineHeight: t.lineHeight.relaxed,
    letterSpacing: t.letterSpacing.normal,
  },
  title: {
    fontFamily: t.family.bodySemiBold,
    fontSize: t.size.xl,
    lineHeight: t.lineHeight.normal,
    letterSpacing: t.letterSpacing.normal,
  },
  subtitle: {
    fontFamily: t.family.bodyMedium,
    fontSize: t.size.lg,
    lineHeight: t.lineHeight.normal,
    letterSpacing: t.letterSpacing.normal,
  },
  body: {
    fontFamily: t.family.bodyRegular,
    fontSize: t.size.base,
    lineHeight: t.lineHeight.snug,
    letterSpacing: t.letterSpacing.normal,
  },
  bodySmall: {
    fontFamily: t.family.bodyRegular,
    fontSize: t.size.sm,
    lineHeight: t.lineHeight.snug,
    letterSpacing: t.letterSpacing.normal,
  },
  caption: {
    fontFamily: t.family.bodyRegular,
    fontSize: t.size.xs,
    lineHeight: t.lineHeight.tight,
    letterSpacing: t.letterSpacing.normal,
  },
  overline: {
    fontFamily: t.family.bodySemiBold,
    fontSize: t.size.xs,
    lineHeight: t.lineHeight.tight,
    letterSpacing: t.letterSpacing.widest,
    textTransform: 'uppercase',
  },
  button: {
    fontFamily: t.family.bodySemiBold,
    fontSize: t.size.base,
    lineHeight: t.lineHeight.normal,
    letterSpacing: t.letterSpacing.wide,
  },
  buttonSm: {
    fontFamily: t.family.bodySemiBold,
    fontSize: t.size.sm,
    lineHeight: t.lineHeight.snug,
    letterSpacing: t.letterSpacing.wide,
  },
  label: {
    fontFamily: t.family.bodyMedium,
    fontSize: t.size.sm,
    lineHeight: t.lineHeight.snug,
    letterSpacing: t.letterSpacing.normal,
  },
});

const sharedLayout: ThemeLayout = {
  screenPaddingH: 24,
  screenPaddingV: 20,

  heroPaddingTop: 48,
  heroPaddingBottom: 72,

  statsCardOverlap: -30,

  avatarSm: 40,
  avatarMd: 60,
  avatarLg: 80,
  avatarOnlineDotOffset: -6,
  avatarBadgeOffset: -6,

  favIconSize: 56,
  categoryIconSize: 36,

  iconSm: 18,
  iconMd: 22,
  iconLg: 28,
  iconXl: 36,

  chartHeight: 80,
  chartBarMin: 8,
  chartBarRadius: 5,

  toggleTrackW: 44,
  toggleTrackH: 24,
  toggleThumbSz: 18,
  toggleThumbOff: 3,

  tabBarRadius: 14,
  tabBarPadding: 4,

  logroSize: 52,

  headerHeight: 56,

  modalActionMinWidth: 96,

  buttonHeightSm: 36,
  buttonHeightMd: 44,
  buttonHeightLg: 52,
  inputHeight: 48,
  tabBarHeight: 64,
  chipHeight: 28,
  badgeSize: 20,

  cardPadding: 20,
  cardGap: 12,
  sectionGap: 28,

  buttonRadius: 12,
  cardRadius: 16,
  inputRadius: 12,
  chipRadius: 9999,
  modalRadius: 24,
  sheetRadius: 28,
};

// ─── Color palettes ───────────────────────────────────────────────────────────

const lightColors: ThemeColors = {
  background: '#F0F6F2',
  backgroundAlt: '#E9F0EC',
  surface: '#FFFFFF',
  elevated: '#FAFCFB',

  primary: '#146042',
  secondary: '#1D7A54',
  primaryLight: '#1D7A54',
  accent: '#39C487',
  accentSoft: '#C8EFE0',
  primaryDark: '#0E4832',
  accentDark: '#2EA874',

  textPrimary: '#0C2218',
  textSecondary: '#2B4638',
  textMuted: '#72897E',
  textTertiary: '#9DAAA3',
  textInverse: '#F2FAF5',

  border: '#D0DFDA',
  divider: '#E3EDEA',
  overlay: 'rgba(5, 18, 10, 0.52)',

  heroBg: '#103D2B',
  heroText: '#F2FAF5',
  heroAccent: '#BDEFD9',
  heroInputBg: 'rgba(255,255,255,0.14)',
  heroInputBgSubtle: '#ECF4EF',
  heroInputBorder: '#C7D7CE',
  heroInputBorderSubtle: '#D8E4DC',
  heroTextSubtle: '#D4E6DD',
  heroAccentMuted: '#9CD8BE',
  heroHighlightPrimary: 'rgba(146,226,183,0.18)',
  heroBottomLayer: 'rgba(255,255,255,0.42)',

  cardBg: '#FFFFFF',
  cardBorder: '#D8E5E1',

  tabActive: '#146042',
  tabInactive: '#5F7A6D',
  tabBg: '#E6EFE9',
  tabBarGlassBg: 'rgba(255, 253, 253, 0.97)',
  tabBarGlassBorder: 'rgba(0, 0, 0, 0.07)',

  toggleActive: '#1D7A54',
  toggleInactive: '#C8D8D0',
  toggleThumbActive: '#F2FAF5',
  toggleThumbInactive: '#6E877A',

  logroActiveBg: '#2FA3651F',
  logroActiveBorder: '#9CD8BE',
  favPlantIconBg: '#E1F2E9',

  actionExport: '#1D7A54',
  actionPassword: '#39C487',
  actionLogout: '#5F7A6D',
  actionDelete: '#C9524B',

  success: '#25965D',
  warning: '#C28A2E',
  error: '#BF4B44',

  trackColor: '#D6E3DB',
};

const darkColors: ThemeColors = {
  background: '#060E0A',
  backgroundAlt: '#0C1910',
  surface: '#0F1F18',
  elevated: '#162B20',

  primary: '#146042',
  secondary: '#1D7A54',
  primaryLight: '#1D7A54',
  accent: '#39C487',
  accentSoft: '#6ED4A8',
  primaryDark: '#0E4832',
  accentDark: '#2EA874',

  textPrimary: '#F0FAF5',
  textSecondary: '#C2DCCB',
  textMuted: '#82A090',
  textTertiary: '#5E7A6B',
  textInverse: '#F2FAF5',

  border: '#253E32',
  divider: '#1B3025',
  overlay: 'rgba(0, 0, 0, 0.62)',

  heroBg: '#081E15',
  heroText: '#F2FAF5',
  heroAccent: '#9FE3C6',
  heroInputBg: 'rgba(255,255,255,0.08)',
  heroInputBgSubtle: '#1E382E',
  heroInputBorder: '#3B5B4B',
  heroInputBorderSubtle: '#2F4E3F',
  heroTextSubtle: '#C7DFD2',
  heroAccentMuted: '#7CCBAC',
  heroHighlightPrimary: 'rgba(122,226,171,0.14)',
  heroBottomLayer: 'rgba(255,255,255,0.06)',

  cardBg: '#1A3026',
  cardBorder: '#1E3529',

  tabActive: '#39C487',
  tabInactive: '#8CA89B',
  tabBg: '#0F1F18',
  tabBarGlassBg: 'rgba(20, 40, 30, 0.96)',
  tabBarGlassBorder: 'rgba(255, 255, 255, 0.09)',

  toggleActive: '#1D7A54',
  toggleInactive: '#243C32',
  toggleThumbActive: '#F2FAF5',
  toggleThumbInactive: '#7A9A8A',

  logroActiveBg: '#39C48726',
  logroActiveBorder: '#7EE0B9',
  favPlantIconBg: '#1E3D30',

  actionExport: '#39C487',
  actionPassword: '#7EE0B9',
  actionLogout: '#B7CCC0',
  actionDelete: '#C9524B',

  success: '#2FA365',
  warning: '#D79A3B',
  error: '#C9524B',

  trackColor: '#233D2E',
};

// ─── Theme assembly ───────────────────────────────────────────────────────────

const sharedTextStyles = createTextStyles(sharedTypography);

const themes: Record<ThemeMode, AppTheme> = {
  light: {
    mode: 'light',
    colors: lightColors,
    spacing: sharedSpacing,
    radius: sharedRadius,
    typography: sharedTypography,
    borders: sharedBorders,
    opacity: sharedOpacity,
    shadows: createShadows('#143826'),
    layout: sharedLayout,
    zIndex: sharedZIndex,
    textStyles: sharedTextStyles,
  },
  dark: {
    mode: 'dark',
    colors: darkColors,
    spacing: sharedSpacing,
    radius: sharedRadius,
    typography: sharedTypography,
    borders: sharedBorders,
    opacity: sharedOpacity,
    shadows: createShadows('#000000'),
    layout: sharedLayout,
    zIndex: sharedZIndex,
    textStyles: sharedTextStyles,
  },
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export function getAppTheme(mode: ColorSchemeName): AppTheme {
  if (mode === 'dark') return themes.dark;
  return themes.light;
}

export function useAppTheme(): AppTheme {
  const mode = useColorScheme();
  return getAppTheme(mode);
}
