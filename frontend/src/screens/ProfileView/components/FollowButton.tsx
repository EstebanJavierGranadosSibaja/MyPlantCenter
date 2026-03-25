import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useProfileViewTheme } from '../ProfileView.styles';

interface FollowButtonProps {
    following: boolean;
    onToggle: () => void;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ following, onToggle }) => {
    const { theme, styles } = useProfileViewTheme();

    return (
        <TouchableOpacity
            onPress={onToggle}
            activeOpacity={0.8}
            style={[
                styles.followButton,
                following ? styles.followButtonActive : styles.followButtonInactive,
            ]}
            accessibilityLabel={following ? 'Dejar de seguir' : 'Seguir usuario'}
            accessibilityRole="button"
        >
            <Feather
                name={following ? 'user-check' : 'user-plus'}
                size={theme.typography.size.sm}
                color={following ? theme.colors.textMuted : theme.colors.textInverse}
            />
            <Text style={[
                styles.followButtonText,
                following ? styles.followButtonTextActive : styles.followButtonTextInactive,
            ]}>
                {following ? 'Siguiendo' : 'Seguir'}
            </Text>
        </TouchableOpacity>
    );
};