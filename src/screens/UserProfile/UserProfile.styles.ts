import { StyleSheet } from 'react-native';

import { colors }                    from '../../theme/colors';
import { textStyles }                from '../../theme/typography';
import { radius, shadows, spacing, layout } from '../../theme/spacing';

export const styles = StyleSheet.create({

  // ── Contenedor raíz ────────────────────────────────────────────────────────
  root: {
    flex:            1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // ── Hero — sección oscura superior ────────────────────────────────────────
  hero: {
    backgroundColor:   colors.heroBg,       // verde muy oscuro
    paddingTop:        layout.heroPaddingV,  // 52
    paddingBottom:     layout.heroPaddingB,  // 80 — extra para la stats card
    paddingHorizontal: layout.screenH,       // 24
    overflow:          'hidden',
    // overflow hidden recorta los blobs decorativos del fondo
  },
  heroTopBar: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
    marginBottom:    spacing[6],   // 24
  },
  heroStatusRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           8,
  },
  heroStatusDot: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: colors.accentSoft,   // punto dorado pulsante
  },
  heroStatusText: {
    ...textStyles.caption,
    color: colors.heroAccent + '99',
  },

  // Botón de editar
  editButton: {
    borderRadius:      radius.sm,
    paddingHorizontal: spacing[3],
    paddingVertical:   7,
    borderWidth:       1,
    borderColor:       colors.heroAccent + '50',
  },
  editButtonActive: {
    backgroundColor: colors.accentSoft,
    borderColor:     colors.accentSoft,
  },
  editButtonText: {
    ...textStyles.label,
    color: colors.heroAccent,
  },
  editButtonTextActive: {
    color: colors.primary,
  },

  // Avatar + nombre
  heroIdentity: {
    flexDirection: 'row',
    gap:           spacing[4] + 2,   // 18
    alignItems:    'flex-start',
  },
  heroNameGroup: {
    flex: 1,
  },
  heroName: {
    ...textStyles.heroTitle,
    color:        colors.heroText,
    marginBottom: 4,
  },
  heroApodo: {
    ...textStyles.body,
    color:        colors.accentSoft,
    marginBottom: spacing[3],
    fontWeight:   '400',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    gap:           spacing[2],
    flexWrap:      'wrap',
  },

  // Sección XP
  xpSection: {
    marginTop: spacing[5],   // 20
  },
  xpLabelRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginBottom:   6,
  },
  xpTitle: {
    ...textStyles.caption,
    color: colors.accentSoft,
  },
  xpValue: {
    ...textStyles.caption,
    color: colors.accent,
  },

  // ── Stats card — flota sobre el hero ──────────────────────────────────────
  statsCard: {
    marginHorizontal: spacing[4],   // 16
    marginTop:        -30,
    zIndex:           2,
  },

  // ── Tabs ──────────────────────────────────────────────────────────────────
  tabsWrapper: {
    paddingHorizontal: spacing[4],
    paddingTop:        spacing[5],
    paddingBottom:     2,
  },
  tabsContainer: {
    flexDirection:   'row',
    backgroundColor: colors.tabBg,
    borderRadius:    layout.tabBarRadius,   // 14
    padding:         layout.tabBarPadding,  // 4
    gap:             2,
  },
  tab: {
    flex:           1,
    borderRadius:   layout.tabBarRadius - 3,   // 11 — un poco menos que el contenedor
    paddingVertical: 9,
    alignItems:     'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.tabActive,   // verde oscuro
  },
  tabText: {
    ...textStyles.tabLabel,
    color: colors.tabInactive,   // gris
  },
  tabTextActive: {
    color: colors.heroText,   // blanco
  },

  // ── Secciones generales ───────────────────────────────────────────────────
  section: {
    paddingHorizontal: layout.screenH,   // 24
    paddingVertical:   spacing[5],       // 20
  },
  sectionTitle: {
    ...textStyles.caption,
    color:        colors.textMuted,
    marginBottom: spacing[3] + 2,   // 14
  },
  divider: {
    height:            1,
    marginHorizontal:  layout.screenH,
    backgroundColor:   colors.border,
  },

  // ── Tab Perfil ────────────────────────────────────────────────────────────

  // Descripción
  descriptionText: {
    ...textStyles.body,
    color:      colors.textSecondary,
    fontStyle:  'italic',
    lineHeight: 22,
  },
  descriptionInput: {
    ...textStyles.body,
    color:             colors.textPrimary,
    backgroundColor:   colors.cardBg,
    borderWidth:       1.5,
    borderColor:       colors.border,
    borderRadius:      radius.md,
    paddingHorizontal: spacing[3] + 2,
    paddingVertical:   spacing[3],
    lineHeight:        22,
    textAlignVertical: 'top',
  },
  textInput: {
    ...textStyles.body,
    color:             colors.textPrimary,
    backgroundColor:   colors.cardBg,
    borderWidth:       1.5,
    borderColor:       colors.border,
    borderRadius:      radius.sm,
    paddingHorizontal: spacing[3] + 2,
    paddingVertical:   spacing[3] - 1,
  },

  // Planta favorita
  favPlantCard: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             spacing[4],
    backgroundColor: colors.primary,
    borderRadius:    radius.lg,
    padding:         spacing[4] + 2,
  },
  favPlantIcon: {
    width:          56,
    height:         56,
    borderRadius:   radius.md,
    backgroundColor: colors.heroAccent + '20',
    alignItems:     'center',
    justifyContent: 'center',
  },
  favPlantEmoji: {
    fontSize:   30,
    lineHeight: 36,
  },
  favPlantName: {
    ...textStyles.plantName,
    color:        colors.heroText,
    marginBottom: 6,
    fontSize:     16,
  },
  favHeartEmoji: {
    fontSize:   20,
    marginLeft: 'auto' as any,
  },

  // Cumpleaños
  birthdayRow: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            spacing[3],
    backgroundColor: colors.cardBg,
    borderRadius:   radius.md,
    padding:        spacing[4],
    borderWidth:    1.5,
    borderColor:    colors.border,
  },
  birthdayEmoji: {
    fontSize:   24,
    lineHeight: 28,
  },
  birthdaySubtitle: {
    ...textStyles.bodySmall,
    color:        colors.textMuted,
    marginBottom: 2,
    fontWeight:   '500',
  },
  birthdayValue: {
    ...textStyles.cardTitle,
    color:    colors.textPrimary,
    fontSize: 15,
  },

  // Logros
  logrosRow: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           spacing[2],
  },
  logroItem: {
    width:          52,
    height:         52,
    borderRadius:   radius.md,
    borderWidth:    1.5,
    alignItems:     'center',
    justifyContent: 'center',
  },
  logroEmoji: {
    fontSize:   24,
    lineHeight: 28,
  },

  // Botón guardar
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius:    radius.md,
    paddingVertical: spacing[4] - 1,
    alignItems:      'center',
    marginHorizontal: layout.screenH,
    marginBottom:    spacing[5],
  },
  saveButtonText: {
    ...textStyles.buttonLabel,
    color:         colors.accentSoft,
    letterSpacing: 0.6,
  },

  // ── Tab Categorías ────────────────────────────────────────────────────────

  categoryList: {
    gap: spacing[3] - 2,   // 10
  },

  // Mini gráfico de barras
  chartContainer: {
    backgroundColor: colors.cardBg,
    borderRadius:    radius.lg,
    padding:         spacing[4],
    borderWidth:     1.5,
    borderColor:     colors.border,
  },
  chartBars: {
    flexDirection: 'row',
    height:        80,
    alignItems:    'flex-end',
    gap:           spacing[2] - 2,   // 6
    marginBottom:  spacing[2],
  },
  chartBarWrapper: {
    flex:       1,
    alignItems: 'center',
    gap:        4,
  },
  chartBar: {
    width:        '100%',
    borderRadius: 5,
    minHeight:    8,
  },
  chartEmoji: {
    fontSize:   13,
    lineHeight: 16,
  },

  // ── Tab Ajustes ───────────────────────────────────────────────────────────

  settingsGroup: {
    backgroundColor: colors.cardBg,
    borderRadius:    radius.md,
    borderWidth:     1.5,
    borderColor:     colors.border,
    overflow:        'hidden',
  },
  settingsItem: {
    paddingHorizontal: spacing[4],
    paddingVertical:   spacing[4],
  },
  settingsDivider: {
    height:          1,
    backgroundColor: colors.border,
  },

  // Botones de cuenta
  actionButton: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             spacing[3],
    backgroundColor: colors.cardBg,
    borderWidth:     1.5,
    borderColor:     colors.border,
    borderRadius:    radius.md,
    padding:         spacing[3] + 2,
    marginBottom:    spacing[2],
  },
  actionEmoji: {
    fontSize:   18,
    lineHeight: 22,
  },
  actionLabel: {
    ...textStyles.label,
    flex:       1,
    fontSize:   13,
    fontWeight: '500',
  },
});