import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { DimensionValue, View } from 'react-native';
import { useProfileHeroTheme } from '../ProfileHero.styles';


export const HeroBackground: React.FC = () => {
    const { theme, styles } = useProfileHeroTheme();

    return (
        <View style={styles.heroBackground}>

            {/* Gradiente base */}
            <LinearGradient
                colors={[
                    theme.colors.heroBg,
                    theme.colors.primary,
                    theme.colors.primaryLight,
                    theme.colors.heroBg,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroBgGradient}
            />

            {/* Capas ambientales sutiles */}
            <View style={styles.heroBgPattern}>
                {AMBIENT_SPOTS.map((spot, i) => (
                    <View
                        key={i}
                        style={{
                            position: 'absolute',
                            width: spot.size,
                            height: spot.size,
                            borderRadius: spot.size,
                            top: spot.top,
                            left: spot.left,
                            backgroundColor: theme.colors.heroAccentMuted,
                            opacity: spot.opacity,
                        }}
                    />
                ))}

                {ICON_ACCENTS.map((icon, i) => (
                    <View
                        key={`icon-${i}`}
                        style={{
                            position: 'absolute',
                            top: icon.top,
                            left: icon.left,
                            transform: [{ rotate: icon.rotate }],
                            opacity: icon.opacity,
                        }}
                    >
                        <Feather
                            name={icon.name as any}
                            size={icon.size}
                            color={theme.colors.heroAccent}
                        />
                    </View>
                ))}
            </View>

            {/* Blur encima del patrón — suaviza todo */}
            <BlurView
                intensity={6}
                tint={theme.mode === 'dark' ? 'dark' : 'light'}
                style={styles.heroBgBlur}
            />

        </View>
    );
};

// Coordenadas de arte para textura visual, no tokens de diseño.

interface AmbientSpot {
    size: number;
    top: DimensionValue;
    left: DimensionValue;
    opacity: number;
}

interface IconAccent {
    name: string;
    size: number;
    top: DimensionValue;
    left: DimensionValue;
    rotate: string;
    opacity: number;
}

const AMBIENT_SPOTS: AmbientSpot[] = [
    { size: 120, top: '8%', left: '6%', opacity: 0.14 },
    { size: 90, top: '5%', left: '34%', opacity: 0.11 },
    { size: 140, top: '18%', left: '62%', opacity: 0.13 },
    { size: 84, top: '58%', left: '18%', opacity: 0.10 },
    { size: 110, top: '54%', left: '70%', opacity: 0.12 },
];

const ICON_ACCENTS: IconAccent[] = [
    { name: 'feather', size: 28, top: '22%', left: '18%', rotate: '-12deg', opacity: 0.18 },
    { name: 'wind', size: 24, top: '14%', left: '48%', rotate: '8deg', opacity: 0.16 },
    { name: 'sun', size: 22, top: '28%', left: '78%', rotate: '0deg', opacity: 0.12 },
    { name: 'droplet', size: 20, top: '62%', left: '58%', rotate: '-10deg', opacity: 0.14 },
];