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
  background: '#F7FBF7',
  backgroundAlt: '#E8F2EA',
  surface: '#FFFFFF',

  primary: '#17573A',
  primaryLight: '#2B7A52',
  accent: '#35A36A',
  accentSoft: '#A5CF87',

  textPrimary: '#0C2816',
  textSecondary: '#294A38',
  textMuted: '#728B78',
  textInverse: '#F7FBF7',

  border: '#D4E3D6',
  success: '#48B368',
  warning: '#F4A040',
  error: '#E06A5B',

  heroBg: '#164E35',
  heroText: '#F7FBF7',
  heroAccent: '#A5CF87',
  heroInputBg: 'rgba(255,255,255,0.12)',
  heroInputBgSubtle: 'rgba(255,255,255,0.08)',
  heroInputBorder: '#A5CF8752',
  heroInputBorderSubtle: '#A5CF872A',
  heroTextSubtle: '#A5CF8796',
  heroAccentMuted: '#A5CF8755',

  cardBg: '#F9FCF8',
  cardBorder: '#D4E3D6',

  tabActive: '#17573A',
  tabInactive: '#728B78',
  tabBg: '#DCE9DD',

  toggleActive: '#2B7A52',
  toggleInactive: '#D4E3D6',
  toggleThumbActive: '#A5CF87',
  toggleThumbInactive: '#728B78',

  logroActiveBg: '#48B36815',
  logroActiveBorder: '#A5CF87',
  favPlantIconBg: '#A5CF8722',

  actionExport: '#2B7A52',
  actionPassword: '#35A36A',
  actionLogout: '#728B78',
  actionDelete: '#E06A5B',

  trackColor: '#ffffff1c',
};

// Colores dark - Mejorados para mayor contraste y legibilidad
const darkColors: ThemeColors = {
  background: '#0B140F',
  backgroundAlt: '#13221A',
  surface: '#192D23',

  primary: '#309162',
  primaryLight: '#3DB376',
  accent: '#4CC07A',
  accentSoft: '#AAD48E',

  textPrimary: '#EEF6F1',
  textSecondary: '#BBD2C0',
  textMuted: '#7B927F',
  textInverse: '#EEF6F1',

  border: '#2C4739',
  success: '#48B368',
  warning: '#F4A040',
  error: '#E06A5B',

  heroBg: '#0C2A18',
  heroText: '#EEF6F1',
  heroAccent: '#AAD48E',
  heroInputBg: 'rgba(255,255,255,0.08)',
  heroInputBgSubtle: 'rgba(255,255,255,0.05)',
  heroInputBorder: '#AAD48E40',
  heroInputBorderSubtle: '#AAD48E22',
  heroTextSubtle: '#AAD48E86',
  heroAccentMuted: '#AAD48E4E',

  cardBg: '#1A2F24',
  cardBorder: '#2C4739',

  tabActive: '#4CC07A',
  tabInactive: '#7B927F',
  tabBg: '#1B3327',

  toggleActive: '#3DB376',
  toggleInactive: '#2C4739',
  toggleThumbActive: '#AAD48E',
  toggleThumbInactive: '#7B927F',

  logroActiveBg: '#48B36815',
  logroActiveBorder: '#AAD48ED9',
  favPlantIconBg: '#AAD48E20',

  actionExport: '#4CC07A',
  actionPassword: '#AAD48E',
  actionLogout: '#C8E5BD',
  actionDelete: '#E06A5B',

  trackColor: '#ffffff1c',
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