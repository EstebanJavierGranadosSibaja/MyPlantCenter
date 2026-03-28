import React from 'react';
import { View, Text } from 'react-native';
import { useProfileHeroTheme } from '../ProfileHero.styles';

interface HeroBioProps {
    description: string;
}

export const HeroBio: React.FC<HeroBioProps> = ({
    description,
}) => {
    const { styles } = useProfileHeroTheme();

    return (
        <View style={styles.bioSection}>
            <Text style={styles.bioText}>{description}</Text>
        </View>
    );
};