import { ColorSchemeName, useColorScheme } from "react-native";

type ThemeMode = 'light' | 'dark';

// Interface para los colores
interface ThemeColors {
  background: string;
  backgroundAlt: string;
  surface: string;

  primary: string;
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
  lg: 18,
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
    opacity: 0.12,
    radius: 8,
    elevation: 3,
  },
  md: {
    color: shadowColor,
    offset: { width: 0, height: 3 },
    opacity: 0.18,
    radius: 12,
    elevation: 6,
  },
  lg: {
    color: shadowColor,
    offset: { width: 0, height: 4 },
    opacity: 0.22,
    radius: 16,
    elevation: 8,
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
    xs: 10,
    sm: 11,
    base: 12,
    md: 13,
    lg: 14,
    xl: 15,
    '2xl': 16,
    '3xl': 18,
    '4xl': 20,
    '5xl': 22,
    '6xl': 26,
  },
  lineHeight: {
    tight: 16,
    snug: 20,
    normal: 24,
    relaxed: 28,
    loose: 32,
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
  background: '#F5FAF6',
  backgroundAlt: '#E9F3EC',
  surface: '#FFFFFF',

  primary: '#145C3D',
  primaryLight: '#2E7F57',
  accent: '#2FAF72',
  accentSoft: '#B8DB9E',

  textPrimary: '#0B2518',
  textSecondary: '#2D4C3B',
  textMuted: '#6C8676',
  textInverse: '#F5FAF6',

  border: '#D2E4D8',
  success: '#35B36A',
  warning: '#E9A13F',
  error: '#D8655C',

  heroBg: '#113E2B',
  heroText: '#F5FAF6',
  heroAccent: '#B8DB9E',
  heroInputBg: 'rgba(255,255,255,0.13)',
  heroInputBgSubtle: 'rgba(255,255,255,0.09)',
  heroInputBorder: '#B8DB9E57',
  heroInputBorderSubtle: '#B8DB9E2E',
  heroTextSubtle: '#B8DB9EA1',
  heroAccentMuted: '#B8DB9E5E',

  cardBg: '#F8FCF8',
  cardBorder: '#D2E4D8',

  tabActive: '#145C3D',
  tabInactive: '#6C8676',
  tabBg: '#DCEADF',

  toggleActive: '#2E7F57',
  toggleInactive: '#D2E4D8',
  toggleThumbActive: '#B8DB9E',
  toggleThumbInactive: '#6C8676',

  logroActiveBg: '#35B36A18',
  logroActiveBorder: '#B8DB9E',
  favPlantIconBg: '#B8DB9E24',

  actionExport: '#2E7F57',
  actionPassword: '#2FAF72',
  actionLogout: '#6C8676',
  actionDelete: '#D8655C',

  trackColor: '#ffffff24',
};

// Colores dark - Mejorados para mayor contraste y legibilidad
const darkColors: ThemeColors = {
  background: '#09130E',
  backgroundAlt: '#112119',
  surface: '#183026',

  primary: '#43A877',
  primaryLight: '#58C28C',
  accent: '#68D39C',
  accentSoft: '#C9E7B3',

  textPrimary: '#EEF8F2',
  textSecondary: '#C4DDCF',
  textMuted: '#86A293',
  textInverse: '#EEF8F2',

  border: '#2A4B3C',
  success: '#47C07B',
  warning: '#E9A13F',
  error: '#E17870',

  heroBg: '#0A2318',
  heroText: '#EEF8F2',
  heroAccent: '#C9E7B3',
  heroInputBg: 'rgba(255,255,255,0.09)',
  heroInputBgSubtle: 'rgba(255,255,255,0.06)',
  heroInputBorder: '#C9E7B34A',
  heroInputBorderSubtle: '#C9E7B328',
  heroTextSubtle: '#C9E7B39A',
  heroAccentMuted: '#C9E7B352',

  cardBg: '#1A3328',
  cardBorder: '#2A4B3C',

  tabActive: '#68D39C',
  tabInactive: '#86A293',
  tabBg: '#1A3428',

  toggleActive: '#58C28C',
  toggleInactive: '#2A4B3C',
  toggleThumbActive: '#C9E7B3',
  toggleThumbInactive: '#86A293',

  logroActiveBg: '#47C07B1E',
  logroActiveBorder: '#C9E7B3E0',
  favPlantIconBg: '#C9E7B326',

  actionExport: '#68D39C',
  actionPassword: '#C9E7B3',
  actionLogout: '#D5EBD0',
  actionDelete: '#E17870',

  trackColor: '#ffffff24',
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