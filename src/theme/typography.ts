// ── familias de fuentes ───────────────────────────────────────────────────────

export const fontFamily = {
  // Playfair Display — para títulos, nombres, elementos destacados
  displayRegular:   'PlayfairDisplay-Regular',
  displayItalic:    'PlayfairDisplay-Italic',
  displayBold:      'PlayfairDisplay-Bold',
  displayBoldItalic:'PlayfairDisplay-BoldItalic',

  // DM Sans — para cuerpo de texto, etiquetas, botones
  bodyLight:    'DMSans-Light',
  bodyRegular:  'DMSans-Regular',
  bodyMedium:   'DMSans-Medium',
  bodySemiBold: 'DMSans-SemiBold',
  bodyBold:     'DMSans-Bold',
} as const;

// ── tamaños de fuente ─────────────────────────────────────────────────────────

export const fontSize = {
  xs:   10,   // etiquetas muy pequeñas, captions
  sm:   11,   // etiquetas, badges
  base: 12,   // texto pequeño
  md:   13,   // texto de cards
  lg:   14,   // cuerpo de texto normal
  xl:   15,   // cuerpo destacado
  '2xl': 16,  // subtítulos pequeños
  '3xl': 18,  // subtítulos
  '4xl': 20,  // títulos de sección
  '5xl': 22,  // títulos grandes
  '6xl': 26,  // títulos hero
} as const;

// ── estilos de texto listos para usar ────────────────────────────────────────

export const textStyles = {

  // Títulos grandes — Playfair Display
  heroTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize:   fontSize['6xl'],        // 26
    lineHeight: 30,                     // espacio entre líneas
  },
  sectionTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize:   fontSize['3xl'],        // 18
    lineHeight: 24,
    fontStyle:  'italic' as const,      // "as const" porque TypeScript necesita saber que es exactamente 'italic', no cualquier string
  },                                    
  cardTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize:   fontSize.md,            // 13
    lineHeight: 18,
  },
  plantName: {
    fontFamily: fontFamily.displayBold,
    fontSize:   fontSize['2xl'],        // 16
    lineHeight: 22,
    fontStyle:  'italic' as const,
  },

  // Números destacados — para stats como "N plantas"
  statValue: {
    fontFamily: fontFamily.displayBold,
    fontSize:   fontSize['4xl'],        // 20
    lineHeight: 24,
  },

  // Cuerpo de texto — DM Sans
  body: {
    fontFamily: fontFamily.bodyRegular,
    fontSize:   fontSize.lg,            // 14
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily: fontFamily.bodyRegular,
    fontSize:   fontSize.base,          // 12
    lineHeight: 18,
  },

  // Etiquetas, badges, tabs
  label: {
    fontFamily:    fontFamily.bodySemiBold,
    fontSize:      fontSize.sm,         // 11
    lineHeight:    16,
  },
  caption: {
    fontFamily:    fontFamily.bodySemiBold,
    fontSize:      fontSize.xs,         // 10
    letterSpacing: 1.4,                
    textTransform: 'uppercase' as const,
  },

  // Botones y tabs
  buttonLabel: {
    fontFamily:    fontFamily.bodySemiBold,
    fontSize:      fontSize.lg,         // 14
    letterSpacing: 0.4,
  },
  tabLabel: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize:   fontSize.sm,            // 11
  },

  // Agrega dentro de textStyles:
  heroName: {
    fontFamily: fontFamily.displayBold,
    fontSize:   fontSize['5xl'],    // 22
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  inputName: {
    fontFamily: fontFamily.displayBold,
    fontSize:   fontSize['2xl'],    // 16
    lineHeight: 22,
  },

  birthdayLabel: {
  fontFamily: fontFamily.bodyMedium,
  fontSize:   fontSize.base,   // 12
  lineHeight: 16,
  fontWeight: '500' as const,
  },
  birthdayValue: {
    fontFamily: fontFamily.displayBold,
    fontSize:   fontSize.xl,     // 15
    lineHeight: 20,
  },
} as const;