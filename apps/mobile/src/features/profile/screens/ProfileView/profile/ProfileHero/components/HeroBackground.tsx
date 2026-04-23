import React from 'react';
import { View } from 'react-native';
import { useProfileHeroTheme } from '../ProfileHero.styles';


export const HeroBackground: React.FC = () => {
    const { theme, styles } = useProfileHeroTheme();

    const highlightColor =
        theme.mode === 'light'
            ? 'rgba(146,226,183,0.18)'
            : 'rgba(122,226,171,0.14)';

    const bottomLayerColor =
        theme.mode === 'light'
            ? 'rgba(255,255,255,0.42)'
            : 'rgba(255,255,255,0.06)';

    return (
        <View style={styles.heroBackground}>
            <View style={styles.heroBase} />
            <View style={[styles.heroHighlightPrimary, { backgroundColor: highlightColor }]} />
            <View style={[styles.heroHighlightSecondary, { backgroundColor: highlightColor }]} />
            <View style={[styles.heroBottomLayer, { backgroundColor: bottomLayerColor }]} />

        </View>
    );
};
