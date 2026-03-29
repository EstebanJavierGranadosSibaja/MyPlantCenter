import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Avatar } from 'src/shared/components/ui/Avatar/Avatar';
import { useProfileHeroTheme } from '../ProfileHero.styles';
import { UserLevel } from 'src/features/profile/types/user.types';

interface HeroAvatarProps {
    avatarUrl?: string;
    level: UserLevel;
}

export const HeroAvatar: React.FC<HeroAvatarProps> = ({ avatarUrl, level }) => {
    const { theme, styles } = useProfileHeroTheme();

    return (
        <View style={styles.avatarWrapper}>

            {/* Anillo de acento */}
            <View style={[styles.avatarRing, styles.avatarRingActive]}>
                <Avatar
                    uri={avatarUrl}
                    size={theme.layout.avatarLg}
                    showOnlineDot={false}
                />
            </View>

            {/* Pill de nivel — centrado debajo del avatar */}
            <View style={styles.levelPill}>
                <View style={styles.levelPillInner}>
                    <Feather
                        name="star"
                        size={theme.typography.size.xs - 1}
                        color={theme.colors.accentSoft}
                    />
                    <Text style={styles.levelText}>Nv {level.level}</Text>
                </View>
            </View>

        </View>
    );
};