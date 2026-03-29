import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View } from 'react-native';
import { useProfileHeroTheme } from '../ProfileHero.styles';


export const HeroBackground: React.FC = () => {
    const { theme, styles } = useProfileHeroTheme();

    return (
        <View style={styles.heroBackground}>
            <LinearGradient
                colors={[
                    theme.colors.heroBg,
                    theme.colors.primary,
                    theme.colors.backgroundAlt,
                ]}
                start={{ x: 0.15, y: 0 }}
                end={{ x: 0.9, y: 1 }}
                style={styles.heroBgGradient}
            />

            <LinearGradient
                colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0)']}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 0.85 }}
                style={styles.heroBgPattern}
            />

        </View>
    );
};
