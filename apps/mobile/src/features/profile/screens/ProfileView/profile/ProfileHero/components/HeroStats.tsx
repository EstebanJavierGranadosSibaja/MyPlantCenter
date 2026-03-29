import React from 'react';
import { View, Text } from 'react-native';
import { useProfileHeroTheme } from '../ProfileHero.styles';
import { UserStats } from 'src/features/profile/types/user.types';

interface HeroStatsProps {
    stats: UserStats;
}

const STAT_ITEMS = (stats: UserStats) => [
    { value: stats.plantsCount, label: 'Plantas' },
    { value: stats.friendsCount, label: 'Amigos' },
    { value: stats.streak, label: 'Racha' },
];

export const HeroStats: React.FC<HeroStatsProps> = ({ stats }) => {
    const { styles } = useProfileHeroTheme();

    return (
        <View style={styles.statsSection}>
            {STAT_ITEMS(stats).map(stat => (
                <View key={stat.label} style={styles.statItem}>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
            ))}
        </View>
    );
};