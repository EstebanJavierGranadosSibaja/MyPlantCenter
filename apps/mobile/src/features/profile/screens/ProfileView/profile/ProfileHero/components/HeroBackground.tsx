import React from 'react';
import { View } from 'react-native';
import { useProfileHeroTheme } from '../ProfileHero.styles';


export const HeroBackground: React.FC = () => {
    const { theme, styles } = useProfileHeroTheme();

    const highlightColor =
        theme.mode === 'light'
            ? theme.colors.heroHighlightPrimary
            : theme.colors.heroHighlightPrimary;

    const bottomLayerColor =
        theme.mode === 'light'
            ? theme.colors.heroBottomLayer
            : theme.colors.heroBottomLayer;

    return (
        <View style={styles.heroBackground}>
            <View style={styles.heroBase} />
            <View style={[styles.heroHighlightPrimary, { backgroundColor: highlightColor }]} />
            <View style={[styles.heroHighlightSecondary, { backgroundColor: highlightColor }]} />
            <View style={[styles.heroBottomLayer, { backgroundColor: bottomLayerColor }]} />

        </View>
    );
};
