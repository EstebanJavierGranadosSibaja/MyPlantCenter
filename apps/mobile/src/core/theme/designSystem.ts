import { ColorSchemeName, useColorScheme } from "react-native";

type ThemeMode = 'light' | 'dark';

// Interface para los colores
interface ThemeColors {
  background: string;
  backgroundAlt: string;
  surface: string;
  elevated: string;

  primary: string;
  secondary: string;
  primaryLight: string;
  accent: string;
  accentSoft: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  heroBg: string;
  heroText: string;
  heroAccent: string;
  heroInputBg: string;
  heroInputBgSubtle: string;
  heroInputBorder: string;
  heroInputBorderSubtle: string;
  heroTextSubtle: string;
  heroAccentMuted: string;

  cardBg: string;
  cardBorder: string;

  tabActive: string;
  tabInactive: string;
  tabBg: string;

  toggleActive: string;
  toggleInactive: string;
  toggleThumbActive: string;
  toggleThumbInactive: string;

  logroActiveBg: string;
  logroActiveBorder: string;
  favPlantIconBg: string;

  actionExport: string;
  actionPassword: string;
  actionLogout: string;
  actionDelete: string;

  border: string;
  success: string;
  warning: string;
  error: string;

  trackColor: string;
}

// Interface para los espacios 
interface ThemeSpacing {
  '5xs': number;   // 0.3
  '4xs': number;   // 0.5
  '3xs': number;   // 1.5
  '2xs': number;   // 2
  xs: number;   // 4
  sm: number;   // 8
  md: number;   // 12
  lg: number;   // 18
  xl: number;   // 24
  '2xl': number;   // 32
  '3xl': number;   // 40
  '4xl': number;   // 48
  '5xl': number;   // 56 
  '6xl': number;   // 64
}

// Interface para los bordes radius
interface ThemeRadius {
  '4xs': number;  // 1
  '3xs': number;  // 1.5
  '2xs': number;   // 3
  xs: number;   // 6   
  sm: number;   // 10
  md: number;   // 16
  lg: number;   // 24
  xl: number;   // 28
  full: number;   // 9999 
}

// Interface para tipografía 
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
    xs: number;   // 10
    sm: number;   // 11
    base: number;   // 12
    md: number;   // 13
    lg: number;   // 14
    xl: number;   // 15
    '2xl': number;   // 16
    '3xl': number;   // 18
    '4xl': number;   // 20
    '5xl': number;   // 22
    '6xl': number;   // 26
  };
  lineHeight: {
    tight: number;   // 16
    snug: number;   // 20
    normal: number;   // 24
    relaxed: number;   // 28
    loose: number;   // 32
  };
}

// Interface para border widths
interface ThemeBorders {
  thin: number;     // 0.5
  base: number;     // 1
  thick: number;    // 1.5
  bold: number;     // 2
}

// Interface para opacity/alpha values
interface ThemeOpacity {
  disabled: number;      // 0.45
  medium: number;        // 0.25
  light: number;         // 0.12
  overlay: number;       // 0.50
  subtle: number;        // 0.08
}

// Interface para shadow definitions
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

// Interface para valores de layout 
interface ThemeLayout {
  // Pantalla
  screenPaddingH: number;   // 24 
  screenPaddingV: number;   // 20 

  // Hero
  heroPaddingTop: number;   // 48 
  heroPaddingBottom: number;   // 72 

  // Stats card
  statsCardOverlap: number;   // -30 

  // Avatar
  avatarSm: number;   // 40
  avatarMd: number;   // 60
  avatarLg: number;   // 80
  avatarOnlineDotOffset: number;   // -6  
  avatarBadgeOffset: number;   // -6 

  // Íconos
  favIconSize: number;   // 56 
  categoryIconSize: number;   // 36

  // Gráfico
  chartHeight: number;   // 80 
  chartBarMin: number;   // 8
  chartBarRadius: number;   // 5

  // Toggle
  toggleTrackW: number;   // 44 
  toggleTrackH: number;   // 24 
  toggleThumbSz: number;   // 18
  toggleThumbOff: number;  // 3 

  // Tab bar
  tabBarRadius: number;   // 14
  tabBarPadding: number;  // 4

  // Logros
  logroSize: number;   // 52 

  // Tamaño del header
  headerHeight: number;

  // Modal
  modalActionMinWidth: number; // 96
}

// Interface que engloba todo 
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
}

// Spacing compartido
const sharedSpacing: ThemeSpacing = {
  '5xs': 0.3,
  '4xs': 0.5,
  '3xs': 1.5,
  '2xs': 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 56,
  '6xl': 64,
};

// Radius compartido
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

// Border widths compartidos
const sharedBorders: ThemeBorders = {
  thin: 0.5,
  base: 1,
  thick: 1.5,
  bold: 2,
};

// Opacity values compartidos
const sharedOpacity: ThemeOpacity = {
  disabled: 0.45,
  medium: 0.25,
  light: 0.12,
  overlay: 0.50,
  subtle: 0.08,
};

// Shadow factory
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
    offset: { width: 0, height: 2 },
    opacity: 0.10,
    radius: 7,
    elevation: 2,
  },
  md: {
    color: shadowColor,
    offset: { width: 0, height: 3 },
    opacity: 0.14,
    radius: 11,
    elevation: 5,
  },
  lg: {
    color: shadowColor,
    offset: { width: 0, height: 4 },
    opacity: 0.18,
    radius: 14,
    elevation: 7,
  },
});

// Tipografía compartida 
const sharedTypography: ThemeTypography = {
  family: {
    displayRegular: 'PlayfairDisplay-Regular',
    displayItalic: 'PlayfairDisplay-Italic',
    displayBold: 'PlayfairDisplay-Bold',
    displayBoldItalic: 'PlayfairDisplay-BoldItalic',
    bodyLight: 'DMSans-Light',
    bodyRegular: 'DMSans-Regular',
    bodyMedium: 'DMSans-Medium',
    bodySemiBold: 'DMSans-SemiBold',
    bodyBold: 'DMSans-Bold',
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
};

// Layout compartido 
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

  headerHeight: 65,

  modalActionMinWidth: 96,
};

// Colores light - Mejorados para mayor coherencia
const lightColors: ThemeColors = {
  background: '#F2F7F3',
  backgroundAlt: '#E8F0EB',
  surface: '#FFFFFF',
  elevated: '#F9FCFA',

  primary: '#146042',
  secondary: '#1D7A54',
  primaryLight: '#1D7A54',
  accent: '#39C487',
  accentSoft: '#BDEFD9',

  textPrimary: '#0D251A',
  textSecondary: '#294536',
  textMuted: '#7E988B',
  textInverse: '#F2FAF5',

  border: '#C7D7CE',
  success: '#2FA365',
  warning: '#D79A3B',
  error: '#C9524B',

  heroBg: '#103D2B',
  heroText: '#F2FAF5',
  heroAccent: '#BDEFD9',
  heroInputBg: 'rgba(255,255,255,0.14)',
  heroInputBgSubtle: '#ECF4EF',
  heroInputBorder: '#C7D7CE',
  heroInputBorderSubtle: '#D8E4DC',
  heroTextSubtle: '#D4E6DD',
  heroAccentMuted: '#9CD8BE',

  cardBg: '#F9FCFA',
  cardBorder: '#D2E0D8',

  tabActive: '#146042',
  tabInactive: '#5F7A6D',
  tabBg: '#E6EFE9',

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

  trackColor: '#D6E3DB',
};

// Colores dark - Mejorados para mayor contraste y legibilidad
const darkColors: ThemeColors = {
  background: '#07120D',
  backgroundAlt: '#0D1B14',
  surface: '#152A21',
  elevated: '#1B3328',

  primary: '#146042',
  secondary: '#1D7A54',
  primaryLight: '#1D7A54',
  accent: '#39C487',
  accentSoft: '#7EE0B9',

  textPrimary: '#F2FAF5',
  textSecondary: '#C7DFD2',
  textMuted: '#8CA89B',
  textInverse: '#F2FAF5',

  border: '#2A4438',
  success: '#2FA365',
  warning: '#D79A3B',
  error: '#C9524B',

  heroBg: '#081E15',
  heroText: '#F2FAF5',
  heroAccent: '#9FE3C6',
  heroInputBg: 'rgba(255,255,255,0.08)',
  heroInputBgSubtle: '#1E382E',
  heroInputBorder: '#3B5B4B',
  heroInputBorderSubtle: '#2F4E3F',
  heroTextSubtle: '#C7DFD2',
  heroAccentMuted: '#7CCBAC',

  cardBg: '#1B3328',
  cardBorder: '#2B473A',

  tabActive: '#39C487',
  tabInactive: '#8CA89B',
  tabBg: '#12251C',

  toggleActive: '#1D7A54',
  toggleInactive: '#2A463A',
  toggleThumbActive: '#F2FAF5',
  toggleThumbInactive: '#8CA89B',

  logroActiveBg: '#39C48726',
  logroActiveBorder: '#7EE0B9',
  favPlantIconBg: '#2A4A3D',

  actionExport: '#39C487',
  actionPassword: '#7EE0B9',
  actionLogout: '#B7CCC0',
  actionDelete: '#C9524B',

  trackColor: '#2E4A3E',
};

// Temas completos
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
  },
};

// getAppTheme 
export function getAppTheme(mode: ColorSchemeName): AppTheme {
  if (mode === 'dark') return themes.dark;
  return themes.light;
}

// useAppTheme
export function useAppTheme(): AppTheme {
  const mode = useColorScheme();
  return getAppTheme(mode);
}