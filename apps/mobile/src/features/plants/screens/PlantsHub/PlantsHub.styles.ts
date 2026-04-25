import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';

export const createPlantsHubStyles = (theme: ReturnType<typeof useAppThemeContext>) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: theme.layout.screenPaddingH,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing['6xl'],
    gap: theme.spacing.md,
  },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.heroInputBgSubtle,
    borderColor: theme.colors.cardBorder,
    borderWidth: theme.borders.base,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
    minHeight: theme.spacing['3xl'] + theme.spacing.xs,
  },

  searchInput: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.md,
  },

  filtersBlock: {
    gap: theme.spacing.sm,
  },

  filtersRow: {
    gap: theme.spacing.xs,
    paddingRight: theme.spacing.lg,
  },

  filterChip: {
    borderRadius: theme.radius.full,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.cardBg,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },

  filterChipActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },

  filterChipText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.family.bodyMedium,
    fontSize: theme.typography.size.sm,
  },

  filterChipTextActive: {
    color: theme.colors.textInverse,
  },

  sortRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },

  sortChip: {
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },

  sortChipActive: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.accentSoft,
  },

  sortChipText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.sm,
  },

  sortChipTextActive: {
    color: theme.colors.textPrimary,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  summaryText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.family.bodyMedium,
    fontSize: theme.typography.size.lg,
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.full,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.accent,
  },

  addButtonPressed: {
    backgroundColor: '#33B07A',
    borderColor: '#33B07A',
  },

  addButtonText: {
    color: theme.colors.textInverse,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.base,
  },

  listContent: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing['4xl'],
  },

  card: {
    backgroundColor: theme.colors.cardBg,
    borderColor: theme.colors.cardBorder,
    borderWidth: theme.borders.thin,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    shadowColor: theme.shadows.md.color,
    shadowOffset: theme.shadows.md.offset,
    shadowOpacity: theme.shadows.md.opacity,
    shadowRadius: theme.shadows.md.radius,
    elevation: theme.shadows.md.elevation,
  },

  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },

  cardIconWrap: {
    width: theme.layout.favIconSize,
    height: theme.layout.favIconSize,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: theme.colors.border,
    borderWidth: theme.borders.base,
    backgroundColor: theme.colors.favPlantIconBg,
  },

  cardIdentity: {
    flex: 1,
    gap: theme.spacing['2xs'],
  },

  cardTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size['2xl'],
  },

  cardSubtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.base,
  },

  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },

  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    borderRadius: theme.radius.full,
    borderColor: theme.colors.cardBorder,
    borderWidth: theme.borders.thin,
    backgroundColor: theme.colors.heroInputBgSubtle,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },

  metaText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.family.bodyMedium,
    fontSize: theme.typography.size.sm,
  },

  cardNotes: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.base,
  },

  cardActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },

  cardActionButton: {
    flex: 1,
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.base,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },

  cardActionButtonPressed: {
    backgroundColor: theme.colors.elevated,
  },

  cardActionPrimary: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },

  cardActionPrimaryPressed: {
    backgroundColor: '#33B07A',
    borderColor: '#33B07A',
  },

  cardActionText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.base,
  },

  cardActionPrimaryText: {
    color: theme.colors.textInverse,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.base,
  },

  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.warning,
    gap: theme.spacing.xs,
  },

  retryText: {
    color: theme.colors.textInverse,
    fontFamily: theme.typography.family.bodySemiBold,
    fontSize: theme.typography.size.sm,
  },

  loadingWrap: {
    paddingTop: theme.spacing['2xl'],
  },

  loadingText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.family.bodyRegular,
    fontSize: theme.typography.size.lg,
  },
});

export function usePlantsHubTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createPlantsHubStyles(theme) };
}
