import React from 'react';
import { Text, View } from 'react-native';
import { XPBar } from 'src/shared/components/ui/ProgressBar/ProgressBar';

import { HeroActions } from './components/HeroActions';
import { HeroAvatar } from './components/HeroAvatar';
import { HeroBackground } from './components/HeroBackground';
import { HeroBio } from './components/HeroBio';
import { HeroIdentity } from './components/HeroIdentity';
import { HeroStats } from './components/HeroStats';

import { UserProfile } from 'src/features/profile/types/user.types';
import { useProfileHeroTheme } from './ProfileHero.styles';

// Props
export interface ProfileHeroProps {
  profile: UserProfile;
  editMode: boolean;
  saving: boolean;
  onEdit: () => void;
  onSave: () => void;
  isOwner: boolean;
}

// Componente
export const ProfileHero: React.FC<ProfileHeroProps> = ({
  profile,
  editMode,
  saving,
  onEdit,
  onSave,
  isOwner,
}) => {
  const { styles } = useProfileHeroTheme();

  return (
    <View style={styles.root}>

      {/* Fondo con blur y patrón */}
      <View style={styles.heroTopSection}>
        <HeroBackground />
        <HeroAvatar
          avatarUrl={profile.avatarUrl}
          level={profile.level}
        />
      </View>

      <View style={styles.summaryShell}>
        {/* Identidad — nombre y apodo */}
        <HeroIdentity
          profile={profile}
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

        {!editMode && (
          <HeroBio
            description={profile.description}
          />
        )}
      </View>

      {!editMode && (
        <>
          {/* Stats */}
          <HeroStats stats={profile.stats} />
        </>
      )}

      {/* Acciones */}
      <HeroActions
        isOwner={isOwner}
        editMode={editMode}
        saving={saving}
        onEdit={onEdit}
        onSave={onSave}
      />

      {/* Divider antes de los tabs */}
      {!editMode && <View style={styles.divider} />}

    </View>
  );
};