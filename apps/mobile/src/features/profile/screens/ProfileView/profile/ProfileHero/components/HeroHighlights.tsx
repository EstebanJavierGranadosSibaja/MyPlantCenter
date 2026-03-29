import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { PlantCategory } from 'src/features/profile/types/user.types';
import { useProfileHeroTheme } from '../ProfileHero.styles';

interface HeroHighlightsProps {
    categories: PlantCategory[];
}

// Ícono Feather por categoría — fallback a 'feather' si no existe
const CATEGORY_ICONS: Record<string, string> = {
    'Tropicales': 'sun',
    'Suculentas': 'droplet',
    'Helechos': 'wind',
    'Cactáceas': 'triangle',
    'Aromáticas': 'star',
    'Acuáticas': 'cloud-rain',
};

export const HeroHighlights: React.FC<HeroHighlightsProps> = ({ categories }) => {
    const { theme, styles } = useProfileHeroTheme();

    return (
        <View style={styles.highlightsSection}>
            <Text style={styles.highlightsSectionTitle}>Categorías</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.highlightsList}
            >
                {categories.map(cat => (
                    <View key={cat.id} style={styles.highlightItem}>
                        <View style={[
                            styles.highlightRing,
                            { borderColor: cat.color },
                        ]}>
                            <Feather
                                name={(CATEGORY_ICONS[cat.name] ?? 'feather') as any}
                                size={theme.typography.size['2xl']}
                                color={cat.color}
                            />
                        </View>
                        <Text style={styles.highlightLabel} numberOfLines={1}>
                            {cat.name}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};