import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, Text } from 'react-native';
import { XPBar } from 'src/components/ui/ProgressBar/ProgressBar';

import { HeroBackground } from './components/HeroBackground';
import { HeroAvatar } from './components/HeroAvatar';
import { HeroIdentity } from './components/HeroIdentity';
import { HeroBio } from './components/HeroBio';
import { HeroStats } from './components/HeroStats';
import { HeroHighlights } from './components/HeroHighlights';
import { HeroActions } from './components/HeroActions';

import { useProfileHeroTheme } from './ProfileHero.styles';
import { UserProfile, EditProfileDTO } from 'src/types-dtos/user.types';

// Props
export interface ProfileHeroProps {
  profile: UserProfile;
  editMode: boolean;
  saving: boolean;
  draft: EditProfileDTO;
  onEdit: () => void;
  onSave: () => void;
  onDraftChange: (draft: EditProfileDTO) => void;
  isOwner: boolean;
}

// Componente
export const ProfileHero: React.FC<ProfileHeroProps> = ({
  profile,
  editMode,
  saving,
  draft,
  onEdit,
  onSave,
  onDraftChange,
  isOwner,
}) => {
  const { styles, theme } = useProfileHeroTheme();

  return (
    <View style={styles.root}>

      {/* Fondo con blur y patrón */}
      <View style={styles.heroTopSection}>
        <HeroBackground />
        <LinearGradient
          colors={['transparent', theme.colors.background]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.heroBottomFade}
          pointerEvents="none"
        />
        <HeroAvatar
          avatarUrl={profile.avatarUrl}
          level={profile.level}
        />
      </View>

      {/* Identidad — nombre y apodo */}
      <HeroIdentity
        profile={profile}
        editMode={editMode}
        draft={draft}
        onDraftChange={onDraftChange}
      />

      {/* XP bar */}
      <View style={styles.xpSection}>
        <View style={styles.xpRow}>
          <Text style={styles.xpLabel}>Experiencia</Text>
          <Text style={styles.xpValue}>
            {profile.level.xp}/{profile.level.xpMax} XP
          </Text>
        </View>
        <XPBar
          xp={profile.level.xp}
          xpMax={profile.level.xpMax}
        />
      </View>

      {/* Bio */}
      <HeroBio
        description={profile.description}
        editMode={editMode}
        draft={draft}
        onDraftChange={onDraftChange}
      />

      {/* Stats */}
      <HeroStats stats={profile.stats} />

      {/* Highlights de categorías */}
      <HeroHighlights categories={profile.categories} />

      {/* Acciones */}
      <HeroActions
        isOwner={isOwner}
        editMode={editMode}
        saving={saving}
        onEdit={onEdit}
        onSave={onSave}
      />

      {/* Divider antes de los tabs */}
      <View style={styles.divider} />

    </View>
  );
};