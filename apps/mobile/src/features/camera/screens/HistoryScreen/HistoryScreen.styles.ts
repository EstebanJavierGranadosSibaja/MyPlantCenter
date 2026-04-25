import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';

export const createHistoryScreenStyles = (theme: ReturnType<typeof useAppThemeContext>) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    listContainer: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
    },

    itemCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.lg,
      marginVertical: theme.spacing.xs,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: theme.borders.base,
      borderColor: theme.colors.border,
    },

    imageContainer: {
      width: 60,
      height: 60,
      borderRadius: theme.radius.xs,
      backgroundColor: theme.colors.backgroundAlt,
      overflow: 'hidden',
    },

    imagePlaceholder: {
      width: 60,
      height: 60,
      backgroundColor: theme.colors.backgroundAlt,
      justifyContent: 'center',
      alignItems: 'center',
    },

    itemContent: {
      flex: 1,
      marginLeft: theme.spacing.md,
    },

    plantName: {
      fontSize: theme.typography.size.xl,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },

    scientificName: {
      fontSize: theme.typography.size.base,
      fontStyle: 'italic',
      color: theme.colors.textMuted,
      marginTop: 2,
    },

    itemMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
      gap: theme.spacing.sm,
    },

    statusChip: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.radius.sm,
    },

    statusLabel: {
      fontSize: theme.typography.size.sm,
      fontWeight: '600',
    },

    timestamp: {
      fontSize: theme.typography.size.sm,
      color: theme.colors.textMuted,
    },

    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing['2xl'],
    },

    emptyEmoji: {
      fontSize: 48,
    },

    emptyTitle: {
      fontSize: theme.typography.size.xl,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.lg,
      textAlign: 'center',
    },

    emptyDescription: {
      fontSize: theme.typography.size.base,
      color: theme.colors.textMuted,
      marginTop: theme.spacing.sm,
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.snug,
    },

    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    loadingText: {
      fontSize: theme.typography.size.base,
      color: theme.colors.textMuted,
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },

    sectionTitle: {
      fontSize: theme.typography.size.lg,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },

    sectionBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.radius.sm,
    },

    sectionCount: {
      fontSize: theme.typography.size.sm,
      fontWeight: '700',
    },

    jobCard: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.lg,
      marginVertical: theme.spacing.xs,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: theme.borders.base,
      borderColor: theme.colors.border,
    },

    jobImage: {
      width: 60,
      height: 60,
      borderRadius: theme.radius.xs,
    },

    jobActions: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.sm,
      gap: theme.spacing.sm,
    },

    retryButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.sm,
    },

    retryText: {
      color: theme.colors.white,
      fontSize: theme.typography.size.sm,
      fontWeight: '600',
    },

    deleteButton: {
      backgroundColor: theme.colors.error + '20',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.sm,
    },

    deleteText: {
      color: theme.colors.error,
      fontSize: theme.typography.size.sm,
      fontWeight: '600',
    },
  });

export function useHistoryScreenTheme() {
  const theme = useAppThemeContext();
  return { theme, styles: createHistoryScreenStyles(theme) };
}