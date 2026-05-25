import React from 'react';
import { View } from 'react-native';
import { useProfileHeroTheme } from '../ProfileHero.styles';

// ─────────────────────────────────────────────────────────────────────────────

export const HeroBackground: React.FC = () => {
  const { theme, styles } = useProfileHeroTheme();

  // accentMuted gives a translucent sage circle overlay on the hero background.
  // bg forms the curved bottom transition from hero into the card below.
  const highlightColor = theme.colors.accentMuted;
  const bottomLayerColor = theme.colors.bg;

  return (
    <View style={styles.heroBackground}>
      <View style={styles.heroBase} />
      <View style={[styles.heroHighlightPrimary, { backgroundColor: highlightColor }]} />
      <View style={[styles.heroHighlightSecondary, { backgroundColor: highlightColor }]} />
      <View style={[styles.heroBottomLayer, { backgroundColor: bottomLayerColor }]} />
    </View>
  );
};
