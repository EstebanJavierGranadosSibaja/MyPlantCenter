import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { UserProfile } from 'src/features/profile/types/user.types';
import { useProfileHeroTheme } from '../ProfileHero.styles';

// ─────────────────────────────────────────────────────────────────────────────

interface HeroIdentityProps {
  profile: UserProfile;
}

// ─────────────────────────────────────────────────────────────────────────────

export const HeroIdentity: React.FC<HeroIdentityProps> = ({ profile }) => {
  const { theme, styles } = useProfileHeroTheme();

  return (
    <View style={styles.identitySection}>
      <Text style={styles.displayName}>{profile.name}</Text>
      <Text style={styles.nickname}>{profile.nickname}</Text>
      <View style={styles.levelTitle}>
        <Feather
          name="award"
          size={theme.text.body.fontSize}
          color={theme.colors.accent}
        />
        <Text style={styles.levelTitleText}>{profile.level.title}</Text>
      </View>
    </View>
  );
};
