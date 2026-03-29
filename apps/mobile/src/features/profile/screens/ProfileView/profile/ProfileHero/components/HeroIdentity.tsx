import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useProfileHeroTheme } from '../ProfileHero.styles';
import { UserProfile } from 'src/features/profile/types/user.types';

interface HeroIdentityProps {
    profile: UserProfile;
}

export const HeroIdentity: React.FC<HeroIdentityProps> = ({
    profile,
}) => {
    const { theme, styles } = useProfileHeroTheme();

    return (
        <View style={styles.identitySection}>
            <Text style={styles.displayName}>{profile.name}</Text>
            <Text style={styles.nickname}>{profile.nickname}</Text>

            {/* Título del nivel */}
            <View style={styles.levelTitle}>
                <Feather
                    name="award"
                    size={theme.typography.size.base}
                    color={theme.colors.accent}
                />
                <Text style={styles.levelTitleText}>
                    {profile.level.title}
                </Text>
            </View>

        </View>
    );
};