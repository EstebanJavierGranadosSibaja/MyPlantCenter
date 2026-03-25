import React from 'react';
import { View } from 'react-native';
import { StatRow } from 'src/components/common/StatRow/StatRow';
import { UserProfile } from 'src/types-dtos/user.types';
import { useProfileViewTheme } from '../ProfileView.styles';

interface ProfileViewStatsProps {
    profile: UserProfile;
}

export const ProfileViewStats: React.FC<ProfileViewStatsProps> = ({ profile }) => {
    const { styles } = useProfileViewTheme();

    const statItems = [
        { iconName: 'feather' as const, value: profile.stats.plantsCount, label: 'Plantas' },
        { iconName: 'users' as const, value: profile.stats.friendsCount, label: 'Amigos' },
        { iconName: 'zap' as const, value: profile.stats.streak, label: 'Racha' },
        { iconName: 'droplet' as const, value: profile.stats.wateredToday, label: 'Riegos' },
    ];

    return (
        <View style={styles.statsCard}>
            <StatRow items={statItems} />
        </View>
    );
};