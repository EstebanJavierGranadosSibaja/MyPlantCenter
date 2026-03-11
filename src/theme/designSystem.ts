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
}

// Interface que engloba todo 
export interface AppTheme {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  typography: ThemeTypography;
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
};

// Colores light
const lightColors: ThemeColors = {
  background: '#F4F7F0',
  backgroundAlt: '#EAF0E4',
  surface: '#FFFFFF',

  primary: '#234d38',
  primaryLight: '#2D6A4F',
  accent: '#42946e',
  accentSoft: '#A8C686',

  textPrimary: '#234d38',
  textSecondary: '#3A5A4A',
  textMuted: '#8B9E8A',
  textInverse: '#F4F7F0',

  border: '#DDE8D8',
  success: '#52B788',
  warning: '#F4A261',
  error: '#E07A5F',

  heroBg: '#234d38',
  heroText: '#F4F7F0',
  heroAccent: '#A8C686',
  heroInputBg: 'rgba(255,255,255,0.10)',
  heroInputBgSubtle: 'rgba(255,255,255,0.08)',
  heroInputBorder: '#A8C68644',
  heroInputBorderSubtle: '#A8C68625',
  heroTextSubtle: '#A8C68699',
  heroAccentMuted: '#A8C68650',

  cardBg: '#F4F7F0',
  cardBorder: '#DDE8D8',

  tabActive: '#234d38',
  tabInactive: '#8B9E8A',
  tabBg: '#DDE8D8',

  toggleActive: '#2D6A4F',
  toggleInactive: '#DDE8D8',
  toggleThumbActive: '#A8C686',
  toggleThumbInactive: '#8B9E8A',

  logroActiveBg: '#52B78818',
  logroActiveBorder: '#A8C686',
  favPlantIconBg: '#A8C68620',

  actionExport: '#2D6A4F',
  actionPassword: '#3B8A6E',
  actionLogout: '#8B9E8A',
  actionDelete: '#E07A5F',

  trackColor: '#ffffff1c',
};

// Colores dark
const darkColors: ThemeColors = {
  background: '#0F1F17',
  backgroundAlt: '#162B1E',
  surface: '#1C3526',

  primary: '#1d3d2a',
  primaryLight: '#2D6A4F',
  accent: '#23754f',
  accentSoft: '#A8C686',

  textPrimary: '#F4F7F0',
  textSecondary: '#A8BBA8',
  textMuted: '#8B9E8A',
  textInverse: '#1A3A2A',

  border: '#2A4A38',
  success: '#52B788',
  warning: '#F4A261',
  error: '#E07A5F',

  heroBg: '#1d3d2a',
  heroText: '#F4F7F0',
  heroAccent: '#A8C686',
  heroInputBg: 'rgba(255,255,255,0.08)',
  heroInputBgSubtle: 'rgba(255,255,255,0.05)',
  heroInputBorder: '#A8C68633',
  heroInputBorderSubtle: '#A8C6861A',
  heroTextSubtle: '#A8C68680',
  heroAccentMuted: '#A8C68640',

  cardBg: '#1A2E24',
  cardBorder: '#2A4A38',

  tabActive: '#4d9269',
  tabInactive: '#8B9E8A',
  tabBg: '#1A2E24',

  toggleActive: '#2D6A4F',
  toggleInactive: '#2A4A38',
  toggleThumbActive: '#A8C686',
  toggleThumbInactive: '#8B9E8A',

  logroActiveBg: '#52B78815',
  logroActiveBorder: '#A8C686CC',
  favPlantIconBg: '#A8C68618',

  actionExport: '#52B788',
  actionPassword: '#A8C686',
  actionLogout: '#A8BBA8',
  actionDelete: '#E07A5F',

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
    layout: sharedLayout,
  },
  dark: {
    mode: 'dark',
    colors: darkColors,
    spacing: sharedSpacing,
    radius: sharedRadius,
    typography: sharedTypography,
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