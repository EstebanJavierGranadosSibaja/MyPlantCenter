// ── escala base ───────────────────────────────────────────────────────────────

export const spacing = {
  0:  0,
  1:  4,    // espacio mínimo, separación entre íconos y texto
  2:  8,    // espacio pequeño, gap entre elementos
  3:  12,   // espacio interno de chips y badges
  4:  16,   // padding estándar de componentes
  5:  20,   // padding de secciones
  6:  24,   // padding horizontal de pantalla
  7:  28,
  8:  32,   // separación entre secciones grandes
  10: 40,
  12: 48,
} as const;

// ── layout ────────────────────────────────────────────────────────────────────

export const layout = {
  // Padding de pantalla
  screenH:  24,   // padding horizontal
  screenV:  20,   // padding vertical
  screenTop: 52,  // padding top

  // Cards
  cardPadding:   16,
  cardRadius:    20,   // qué tan redondeadas son las esquinas de las cards
  cardRadiusSm:  14,
  cardRadiusLg:  24,

  // Hero — la sección oscura del perfil
  heroPaddingV: 52,
  heroPaddingB: 80,   // más espacio abajo porque la stats card se superponen

  // Avatares
  avatarMd: 60,
  avatarLg: 80,

  // Tab bar
  tabBarH:       60,
  tabBarRadius:  14,
  tabBarPadding: 4,

  // Ancho máximo
  maxWidth: 420,
} as const;

// ── border radius ─────────────────────────────────────────────────────────────

export const radius = {
  xs:   6,
  sm:   10,
  md:   14,
  lg:   18,
  xl:   24,
  full: 9999,   // 9999 garantiza círculo sin importar el tamaño del elemento
} as const;

// ── sombras ───────────────────────────────────────────────────────────────────

export const shadows = {
  sm: {
    // iOS
    shadowColor:   '#1A3A2A',
    shadowOffset:  { width: 0, height: 2 },  // hacia dónde cae la sombra
    shadowOpacity: 0.07,                      // qué tan visible es
    shadowRadius:  6,                         // qué tan difusa es
    // Android
    elevation: 2,
  },
  md: {
    shadowColor:   '#1A3A2A',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius:  16,
    elevation: 4,
  },
  lg: {
    shadowColor:   '#1A3A2A',
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius:  28,
    elevation: 8,
  },
  hero: {
    // Sombra verde para el avatar — da efecto de brillo de color
    shadowColor:   '#52B788',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius:  14,
    elevation: 6,
  },
} as const;