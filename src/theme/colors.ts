// ── palette ───────────────────────────────────────────────────────────────────

const palette = {
  forestDeep:  '#1A3A2A',   // verde muy oscuro — fondo hero, botones primarios
  moss:        '#2D6A4F',   // verde medio — acentos secundarios
  sage:        '#52B788',   // verde brillante — highlights, íconos activos
  dewGold:     '#A8C686',   // verde dorado — XP bar, badges
  softWhite:   '#F4F7F0',   // blanco verdoso — fondo general
  warmCream:   '#EAF0E4',   // crema — fondo de cards
  borderLight: '#DDE8D8',   // borde suave
  stone:       '#8B9E8A',   // gris verdoso — texto secundario
  bodyText:    '#3A5A4A',   // texto de cuerpo
  error:       '#E07A5F',   // rojo suave — errores
  warning:     '#F4A261',   // naranja — advertencias
  mintLight:   '#3B8A6E',
}as const;

// ── colors ────────────────────────────────────────────────────────────────────

export const colors = {
  // Fondos
  background:    palette.softWhite,    // fondo de pantallas
  backgroundAlt: palette.warmCream,    // fondo alternativo, cards
  surface:       '#FFFFFF',            // superficies elevadas

  // Marca
  primary:       palette.forestDeep,   // color principal de la app
  primaryLight:  palette.moss,         // versión más clara del principal
  accent:        palette.sage,         // color de acento, llamadas a la acción
  accentSoft:    palette.dewGold,      // acento suave, badges, XP

  // Texto
  textPrimary:   palette.forestDeep,   // títulos, texto importante
  textSecondary: palette.bodyText,     // párrafos, descripciones
  textMuted:     palette.stone,        // texto desactivado, placeholders
  textInverse:   palette.softWhite,    // texto sobre fondos oscuros

  // Bordes
  border:        palette.borderLight,

  // Estados
  success:       palette.sage,
  warning:       palette.warning,
  error:         palette.error,

  // Hero (la sección oscura del perfil)
  heroBg:        palette.forestDeep,
  heroText:      palette.softWhite,
  heroAccent:    palette.dewGold,

  // Cards
  cardBg:        palette.softWhite,
  cardBorder:    palette.borderLight,

  // Tabs
  tabActive:     palette.forestDeep,
  tabInactive:   palette.stone,
  tabBg:         palette.borderLight,

  // Toggle (el switch de on/off)
  toggleActive:        palette.moss,
  toggleInactive:      palette.borderLight,
  toggleThumbActive:   palette.dewGold,
  toggleThumbInactive: palette.stone,

  // Inputs sobre fondo hero
  heroInputBg:       'rgba(255,255,255,0.10)',
  heroInputBgSubtle: 'rgba(255,255,255,0.08)',
  heroInputBorder:   palette.dewGold + '44',
  heroInputBorderSubtle: palette.dewGold + '25',
  heroTextSubtle:    palette.dewGold + '99',
  heroAccentMuted:   palette.dewGold + '50',// no funciona así, ver abajo

  logroActiveBg:     palette.sage    + '18',  // fondo verde suave para logros ganados
  logroActiveBorder: palette.dewGold,         // borde dorado para logros ganados
  favPlantIconBg:    palette.dewGold + '20',  // fondo del ícono de planta favorita

  // Acciones de cuenta
  actionExport:   palette.moss,        // exportar datos
  actionPassword: palette.mintLight,   // cambiar contraseña  
  actionLogout:   palette.stone,       // cerrar sesión
  actionDelete:   palette.error,       // eliminar cuenta
};