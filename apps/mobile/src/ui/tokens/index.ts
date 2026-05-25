import { Platform } from 'react-native';

// ─────────────────────────────────────────────────────────────────────────────
// Design System — "Premium Calm Botanical"
//
// Aesthetic: iOS 18 · Linear · Apple Health · Notion
// Character: warm neutral base · deep sage accent · generous space · quiet depth
//
// Rules:
//   • No saturated greens — only sage / eucalyptus / moss tones
//   • No glow, no gradients, no heavy shadows
//   • Elevation through layered surfaces, not shadow weight
//   • One accent color — everything else is neutral
//   • Typography-first hierarchy
// ─────────────────────────────────────────────────────────────────────────────

export type UIMode = 'light' | 'dark';

// ─── Color tokens ─────────────────────────────────────────────────────────────

export interface UIColors {
  // Backgrounds — layered, warmly neutral
  bg:               string;  // page canvas
  bgSubtle:         string;  // recessed wells / alternate rows
  surface:          string;  // cards, inputs, sheets
  surfaceElevated:  string;  // floating elements, modals
  surfaceOverlay:   string;  // translucent nav / bottom sheets (pair with blur)

  // Borders — semi-transparent, never opaque
  borderSubtle:     string;  // hairline dividers
  borderDefault:    string;  // standard containers
  borderStrong:     string;  // active / focused state

  // Text — four semantic levels
  textPrimary:      string;  // primary content
  textSecondary:    string;  // supporting, labels
  textTertiary:     string;  // placeholders, hints
  textDisabled:     string;  // disabled state
  textInverse:      string;  // text on dark surfaces
  textOnAccent:     string;  // text on accent-colored backgrounds

  // Accent — single botanical green, muted and sophisticated
  accent:           string;  // primary interactive color
  accentPressed:    string;  // pressed / active state
  accentSoft:       string;  // ~10% — chip / tag backgrounds
  accentMuted:      string;  // ~20% — borders, rings
  accentForeground: string;  // accent-colored text on neutral backgrounds

  // Semantic states — muted tones, not neon
  success:          string;
  successSoft:      string;
  warning:          string;
  warningSoft:      string;
  error:            string;
  errorSoft:        string;

  // System
  overlay:          string;  // modal backdrop
  divider:          string;  // list separators
  tabBarBg:         string;  // floating tab bar background
  tabBarBorder:     string;  // tab bar edge
  tabActive:        string;  // selected tab
  tabInactive:      string;  // idle tabs
}

// ─── Typography ───────────────────────────────────────────────────────────────

// Platform-native font families — SF Pro on iOS, system on Android
const _sys     = Platform.select({ ios: undefined, android: 'sans-serif' }) as string | undefined;
const _sysMd   = Platform.select({ ios: undefined, android: 'sans-serif-medium' }) as string | undefined;
const _sysBold = Platform.select({ ios: undefined, android: 'sans-serif-medium' }) as string | undefined;

export interface UIFontFamily {
  regular:  string | undefined;
  medium:   string | undefined;
  semibold: string | undefined;
  bold:     string | undefined;
}

export interface UIFontSize {
  '2xs': number;  // 11 — badge, micro labels
  xs:    number;  // 13 — caption, meta
  sm:    number;  // 15 — secondary body
  base:  number;  // 17 — primary body (iOS standard)
  lg:    number;  // 20 — large body / small heading
  xl:    number;  // 24 — section heading
  '2xl': number;  // 28 — page heading
  '3xl': number;  // 34 — display / hero
}

export interface UIFontWeight {
  regular:  '400';
  medium:   '500';
  semibold: '600';
  bold:     '700';
}

export interface UILineHeight {
  '2xs': number;  // 15
  xs:    number;  // 18
  sm:    number;  // 21
  base:  number;  // 24
  lg:    number;  // 28
  xl:    number;  // 32
  '2xl': number;  // 38
  '3xl': number;  // 44
}

// ─── Text styles (semantic presets) ──────────────────────────────────────────

export interface UITextStyle {
  fontFamily?:    string | undefined;
  fontSize:       number;
  fontWeight:     '400' | '500' | '600' | '700';
  lineHeight:     number;
  letterSpacing:  number;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
}

export interface UITextStyles {
  display:   UITextStyle;   // 34 / 700 — hero titles
  h1:        UITextStyle;   // 28 / 700 — screen titles
  h2:        UITextStyle;   // 24 / 600 — section headings
  h3:        UITextStyle;   // 20 / 600 — card headings
  title:     UITextStyle;   // 17 / 600 — list item titles
  body:      UITextStyle;   // 17 / 400 — primary body copy
  bodyMd:    UITextStyle;   // 15 / 400 — secondary body copy
  caption:   UITextStyle;   // 13 / 400 — timestamps, meta
  label:     UITextStyle;   // 13 / 500 — form labels, chips
  overline:  UITextStyle;   // 11 / 600 — section markers (uppercase)
  button:    UITextStyle;   // 17 / 600 — primary CTA
  buttonSm:  UITextStyle;   // 15 / 600 — secondary CTA
  numeric:   UITextStyle;   // 24 / 700 — stats, counts
}

// ─── Spacing (4px grid) ───────────────────────────────────────────────────────

export interface UISpacing {
  xs:   number;  //  4
  sm:   number;  //  8
  md:   number;  // 12
  base: number;  // 16
  lg:   number;  // 20
  xl:   number;  // 24
  '2xl': number; // 32
  '3xl': number; // 40
  '4xl': number; // 48
  '5xl': number; // 64
  '6xl': number; // 80
}

// ─── Radius ───────────────────────────────────────────────────────────────────

export interface UIRadius {
  xs:    number;  //  6
  sm:    number;  // 10
  md:    number;  // 14
  lg:    number;  // 18
  xl:    number;  // 24
  '2xl': number;  // 32
  full:  number;  // 9999
}

// ─── Shadows (barely-there — depth through surface contrast) ─────────────────

export interface UIShadow {
  shadowColor:   string;
  shadowOffset:  { width: number; height: number };
  shadowOpacity: number;
  shadowRadius:  number;
  elevation:     number;
}

export interface UIShadows {
  none: UIShadow;
  xs:   UIShadow;  // 1dp — tight containment
  sm:   UIShadow;  // 2dp — card lift
  md:   UIShadow;  // 4dp — floating elements
  lg:   UIShadow;  // 8dp — modals, sheets
}

// ─── Motion ───────────────────────────────────────────────────────────────────

export interface UIMotion {
  fast:   number;  // 150ms — micro-interactions
  normal: number;  // 250ms — standard transitions
  slow:   number;  // 400ms — large surface transitions
  spring: { damping: number; stiffness: number; mass: number };  // snappy
  gentle: { damping: number; stiffness: number; mass: number };  // soft landing
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export interface UILayout {
  // Screen canvas
  screenPaddingH: number;  // 20
  screenPaddingV: number;  // 20

  // Content rhythm
  contentGap:  number;  // 16 — between list items
  sectionGap:  number;  // 32 — between major sections
  cardPadding: number;  // 20 — internal card padding

  // Component heights — sized for premium feel, not compact
  inputHeight:    number;  // 52
  buttonHeightSm: number;  // 40
  buttonHeightMd: number;  // 50
  buttonHeightLg: number;  // 56
  tabBarHeight:   number;  // 72
  headerHeight:   number;  // 56
  chipHeight:     number;  // 30
  badgeSize:      number;  // 20

  // Semantic radius shortcuts
  cardRadius:   number;  // 18
  inputRadius:  number;  // 14
  buttonRadius: number;  // 14
  chipRadius:   number;  // 9999
  modalRadius:  number;  // 28
  sheetRadius:  number;  // 32
  tabBarRadius: number;  // 9999

  // Avatars
  avatarSm: number;  // 36
  avatarMd: number;  // 52
  avatarLg: number;  // 80

  // Icons
  iconSm: number;  // 16
  iconMd: number;  // 20
  iconLg: number;  // 24
  iconXl: number;  // 32
}

// ─── Z-Index ──────────────────────────────────────────────────────────────────

export interface UIZIndex {
  base:    number;  //   0
  card:    number;  //   1
  fab:     number;  //  10
  sticky:  number;  //  20
  overlay: number;  //  40
  modal:   number;  //  50
  toast:   number;  // 100
}

// ─── Root theme ───────────────────────────────────────────────────────────────

export interface UITheme {
  mode:       UIMode;
  colors:     UIColors;
  text:       UITextStyles;
  font:       UIFontFamily;
  size:       UIFontSize;
  weight:     UIFontWeight;
  lh:         UILineHeight;  // lineHeight alias — shorter for style sheets
  spacing:    UISpacing;
  radius:     UIRadius;
  shadows:    UIShadows;
  motion:     UIMotion;
  layout:     UILayout;
  zIndex:     UIZIndex;
}

// ─── Shared primitives ────────────────────────────────────────────────────────

const _font: UIFontFamily = {
  regular:  _sys,
  medium:   _sysMd,
  semibold: _sysBold,
  bold:     _sysBold,
};

const _size: UIFontSize = {
  '2xs': 11,
  xs:    13,
  sm:    15,
  base:  17,
  lg:    20,
  xl:    24,
  '2xl': 28,
  '3xl': 34,
};

const _weight: UIFontWeight = {
  regular:  '400',
  medium:   '500',
  semibold: '600',
  bold:     '700',
};

const _lh: UILineHeight = {
  '2xs': 15,
  xs:    18,
  sm:    21,
  base:  24,
  lg:    28,
  xl:    32,
  '2xl': 38,
  '3xl': 44,
};

const _text: UITextStyles = {
  display:  { fontFamily: _sysBold, fontSize: 34, fontWeight: '700', lineHeight: 44, letterSpacing: -0.6 },
  h1:       { fontFamily: _sysBold, fontSize: 28, fontWeight: '700', lineHeight: 38, letterSpacing: -0.5 },
  h2:       { fontFamily: _sysMd,   fontSize: 24, fontWeight: '600', lineHeight: 32, letterSpacing: -0.4 },
  h3:       { fontFamily: _sysMd,   fontSize: 20, fontWeight: '600', lineHeight: 28, letterSpacing: -0.3 },
  title:    { fontFamily: _sysMd,   fontSize: 17, fontWeight: '600', lineHeight: 24, letterSpacing: -0.2 },
  body:     { fontFamily: _sys,     fontSize: 17, fontWeight: '400', lineHeight: 26, letterSpacing:  0 },
  bodyMd:   { fontFamily: _sys,     fontSize: 15, fontWeight: '400', lineHeight: 22, letterSpacing:  0 },
  caption:  { fontFamily: _sys,     fontSize: 13, fontWeight: '400', lineHeight: 18, letterSpacing:  0 },
  label:    { fontFamily: _sysMd,   fontSize: 13, fontWeight: '500', lineHeight: 18, letterSpacing:  0 },
  overline: { fontFamily: _sysMd,   fontSize: 11, fontWeight: '600', lineHeight: 15, letterSpacing:  1.2, textTransform: 'uppercase' },
  button:   { fontFamily: _sysMd,   fontSize: 17, fontWeight: '600', lineHeight: 24, letterSpacing: -0.2 },
  buttonSm: { fontFamily: _sysMd,   fontSize: 15, fontWeight: '600', lineHeight: 21, letterSpacing: -0.1 },
  numeric:  { fontFamily: _sysBold, fontSize: 24, fontWeight: '700', lineHeight: 32, letterSpacing: -0.5 },
};

const _spacing: UISpacing = {
  xs:    4,
  sm:    8,
  md:    12,
  base:  16,
  lg:    20,
  xl:    24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
};

const _radius: UIRadius = {
  xs:    6,
  sm:    10,
  md:    14,
  lg:    18,
  xl:    24,
  '2xl': 32,
  full:  9999,
};

const _motion: UIMotion = {
  fast:   150,
  normal: 250,
  slow:   400,
  spring: { damping: 22, stiffness: 250, mass: 1 },
  gentle: { damping: 30, stiffness: 150, mass: 1 },
};

const _layout: UILayout = {
  screenPaddingH: 20,
  screenPaddingV: 20,
  contentGap:     16,
  sectionGap:     32,
  cardPadding:    20,

  inputHeight:    52,
  buttonHeightSm: 40,
  buttonHeightMd: 50,
  buttonHeightLg: 56,
  tabBarHeight:   72,
  headerHeight:   56,
  chipHeight:     30,
  badgeSize:      20,

  cardRadius:   18,
  inputRadius:  14,
  buttonRadius: 14,
  chipRadius:   9999,
  modalRadius:  28,
  sheetRadius:  32,
  tabBarRadius: 9999,

  avatarSm: 36,
  avatarMd: 52,
  avatarLg: 80,

  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  iconXl: 32,
};

const _zIndex: UIZIndex = {
  base:    0,
  card:    1,
  fab:     10,
  sticky:  20,
  overlay: 40,
  modal:   50,
  toast:   100,
};

const _makeShadows = (mode: UIMode): UIShadows => {
  const color = '#000000';
  const k = mode === 'dark' ? 4 : 1;  // darks need stronger shadows to read against dark bg
  return {
    none: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0,           shadowRadius: 0,  elevation: 0 },
    xs:   { shadowColor: color,         shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04 * k,    shadowRadius: 2,  elevation: 1 },
    sm:   { shadowColor: color,         shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06 * k,    shadowRadius: 6,  elevation: 2 },
    md:   { shadowColor: color,         shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08 * k,    shadowRadius: 12, elevation: 4 },
    lg:   { shadowColor: color,         shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.10 * k,    shadowRadius: 24, elevation: 8 },
  };
};

// ─── Color palettes ───────────────────────────────────────────────────────────

const _lightColors: UIColors = {
  // Backgrounds — warm off-white (not pure white, not green-tinted)
  bg:              '#FAFAF9',
  bgSubtle:        '#F2F2F0',
  surface:         '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceOverlay:  'rgba(252,252,251,0.92)',

  // Borders — ultra-light, semi-transparent
  borderSubtle:  'rgba(0,0,0,0.05)',
  borderDefault: 'rgba(0,0,0,0.09)',
  borderStrong:  'rgba(0,0,0,0.18)',

  // Text — warm near-black, not pure #000
  textPrimary:   '#1A1A18',
  textSecondary: 'rgba(26,26,24,0.65)',
  textTertiary:  'rgba(26,26,24,0.40)',
  textDisabled:  'rgba(26,26,24,0.25)',
  textInverse:   '#FAFAF9',
  textOnAccent:  '#FFFFFF',

  // Accent — deep eucalyptus, muted and grounded
  accent:           '#3D6B52',
  accentPressed:    '#2E5240',
  accentSoft:       'rgba(61,107,82,0.10)',
  accentMuted:      'rgba(61,107,82,0.20)',
  accentForeground: '#2E5240',

  // Semantic — terracotta reds, warm ambers (not neon)
  success:     '#3D6B52',
  successSoft: 'rgba(61,107,82,0.10)',
  warning:     '#8B6320',
  warningSoft: 'rgba(139,99,32,0.10)',
  error:       '#A83232',
  errorSoft:   'rgba(168,50,50,0.10)',

  // System
  overlay:      'rgba(0,0,0,0.40)',
  divider:      'rgba(0,0,0,0.06)',
  tabBarBg:     'rgba(252,252,251,0.94)',
  tabBarBorder: 'rgba(0,0,0,0.07)',
  tabActive:    '#3D6B52',
  tabInactive:  'rgba(26,26,24,0.35)',
};

const _darkColors: UIColors = {
  // Backgrounds — warm graphite, not pure black
  bg:              '#111110',
  bgSubtle:        '#0C0C0B',
  surface:         '#1C1C1A',
  surfaceElevated: '#252522',
  surfaceOverlay:  'rgba(17,17,16,0.92)',

  // Borders
  borderSubtle:  'rgba(255,255,255,0.05)',
  borderDefault: 'rgba(255,255,255,0.09)',
  borderStrong:  'rgba(255,255,255,0.18)',

  // Text — warm white, not pure #FFF
  textPrimary:   '#F0EFE8',
  textSecondary: 'rgba(240,239,232,0.65)',
  textTertiary:  'rgba(240,239,232,0.40)',
  textDisabled:  'rgba(240,239,232,0.25)',
  textInverse:   '#111110',
  textOnAccent:  '#FFFFFF',

  // Accent — lighter sage for dark mode, still muted
  accent:           '#5A9178',
  accentPressed:    '#4E7E69',
  accentSoft:       'rgba(90,145,120,0.15)',
  accentMuted:      'rgba(90,145,120,0.25)',
  accentForeground: '#6BA88D',

  // Semantic
  success:     '#5A9178',
  successSoft: 'rgba(90,145,120,0.15)',
  warning:     '#C49040',
  warningSoft: 'rgba(196,144,64,0.15)',
  error:       '#D46060',
  errorSoft:   'rgba(212,96,96,0.15)',

  // System
  overlay:      'rgba(0,0,0,0.60)',
  divider:      'rgba(255,255,255,0.06)',
  tabBarBg:     'rgba(17,17,16,0.92)',
  tabBarBorder: 'rgba(255,255,255,0.08)',
  tabActive:    '#5A9178',
  tabInactive:  'rgba(240,239,232,0.35)',
};

// ─── Theme assembly ───────────────────────────────────────────────────────────

const _themes: Record<UIMode, UITheme> = {
  light: {
    mode:    'light',
    colors:  _lightColors,
    text:    _text,
    font:    _font,
    size:    _size,
    weight:  _weight,
    lh:      _lh,
    spacing: _spacing,
    radius:  _radius,
    shadows: _makeShadows('light'),
    motion:  _motion,
    layout:  _layout,
    zIndex:  _zIndex,
  },
  dark: {
    mode:    'dark',
    colors:  _darkColors,
    text:    _text,
    font:    _font,
    size:    _size,
    weight:  _weight,
    lh:      _lh,
    spacing: _spacing,
    radius:  _radius,
    shadows: _makeShadows('dark'),
    motion:  _motion,
    layout:  _layout,
    zIndex:  _zIndex,
  },
};

// ─── Public API ───────────────────────────────────────────────────────────────

export function getUITheme(mode: UIMode | null | undefined): UITheme {
  return mode === 'dark' ? _themes.dark : _themes.light;
}
