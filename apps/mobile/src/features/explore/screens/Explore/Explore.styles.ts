import { StyleSheet } from 'react-native';
import { useAppThemeContext } from 'src/core/contexts/ThemeContext';
import { AppTheme } from 'src/core/theme/designSystem';

export const createExplorarStyles = (theme: AppTheme) => StyleSheet.create({

    root: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.layout.screenPaddingH,
        paddingTop: theme.spacing.md,
        gap: theme.spacing.md,
    },

    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.cardBg,
        borderRadius: theme.radius.md,
        borderWidth: theme.borders.thick,
        borderColor: theme.colors.border,
        paddingHorizontal: theme.spacing.md,
        gap: theme.spacing.sm,
    },

    searchInput: {
        flex: 1,
        fontFamily: theme.typography.family.bodyRegular,
        fontSize: theme.typography.size.lg,
        color: theme.colors.textPrimary,
        paddingVertical: theme.spacing.md,
    },

    loadingCard: {
        backgroundColor: theme.colors.cardBg,
        borderRadius: theme.radius.md,
        borderWidth: theme.borders.thin,
        borderColor: theme.colors.cardBorder,
        paddingVertical: theme.spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.sm,
    },

    loadingText: {
        fontFamily: theme.typography.family.bodyMedium,
        fontSize: theme.typography.size.md,
        color: theme.colors.textSecondary,
    },

    sections: {
        gap: theme.spacing.lg,
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
    },

    sectionTitle: {
        fontFamily: theme.typography.family.displayBold,
        fontSize: theme.typography.size.xl,
        color: theme.colors.textPrimary,
    },

    sectionMeta: {
        fontFamily: theme.typography.family.bodyMedium,
        fontSize: theme.typography.size.sm,
        color: theme.colors.textMuted,
    },

    sectionEmpty: {
        fontFamily: theme.typography.family.bodyRegular,
        fontSize: theme.typography.size.sm,
        color: theme.colors.textSecondary,
    },

    trendingRow: {
        gap: theme.spacing.sm,
        paddingRight: theme.spacing.lg,
    },

    trendingCard: {
        width: 190,
        backgroundColor: theme.colors.cardBg,
        borderRadius: theme.radius.md,
        borderWidth: theme.borders.thin,
        borderColor: theme.colors.cardBorder,
        padding: theme.spacing.md,
        gap: theme.spacing['2xs'],
        shadowColor: theme.shadows.sm.color,
        shadowOffset: theme.shadows.sm.offset,
        shadowOpacity: theme.shadows.sm.opacity,
        shadowRadius: theme.shadows.sm.radius,
        elevation: theme.shadows.sm.elevation,
    },

    trendingImageWrap: {
        height: 110,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colors.backgroundAlt,
        borderWidth: theme.borders.base,
        borderColor: theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },

    trendingImage: {
        width: '100%',
        height: '100%',
    },

    trendingName: {
        fontFamily: theme.typography.family.bodySemiBold,
        fontSize: theme.typography.size.lg,
        color: theme.colors.textPrimary,
    },

    trendingScientific: {
        fontFamily: theme.typography.family.bodyRegular,
        fontSize: theme.typography.size.sm,
        color: theme.colors.textMuted,
    },

    trendingFooter: {
        marginTop: theme.spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    trendingTime: {
        fontFamily: theme.typography.family.bodyMedium,
        fontSize: theme.typography.size.xs,
        color: theme.colors.textSecondary,
    },

    activityList: {
        gap: theme.spacing.sm,
    },

    activityCard: {
        backgroundColor: theme.colors.cardBg,
        borderRadius: theme.radius.md,
        borderWidth: theme.borders.thin,
        borderColor: theme.colors.cardBorder,
        padding: theme.spacing.md,
        gap: theme.spacing.xs,
    },

    activityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },

    activityAvatar: {
        width: theme.layout.avatarSm - theme.spacing.sm,
        height: theme.layout.avatarSm - theme.spacing.sm,
        borderRadius: theme.radius.full,
        backgroundColor: theme.colors.backgroundAlt,
        borderWidth: theme.borders.base,
        borderColor: theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },

    activityInfo: {
        flex: 1,
        gap: theme.spacing['4xs'],
    },

    activityUser: {
        fontFamily: theme.typography.family.bodySemiBold,
        fontSize: theme.typography.size.md,
        color: theme.colors.textPrimary,
    },

    activityPlant: {
        fontFamily: theme.typography.family.bodyRegular,
        fontSize: theme.typography.size.sm,
        color: theme.colors.textSecondary,
    },

    activityTime: {
        fontFamily: theme.typography.family.bodyMedium,
        fontSize: theme.typography.size.xs,
        color: theme.colors.textMuted,
    },

    activityFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: theme.spacing['2xs'],
    },

    activityConfidence: {
        fontFamily: theme.typography.family.bodySemiBold,
        fontSize: theme.typography.size.sm,
        color: theme.colors.textSecondary,
    },

});

export function useExplorarTheme() {
    const theme = useAppThemeContext();
    return { theme, styles: createExplorarStyles(theme) };
}