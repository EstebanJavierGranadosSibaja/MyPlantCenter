import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Avatar } from 'src/components/ui/Avatar/Avatar';
import { Badge } from 'src/components/ui/Badge/Badge';
import { XPBar } from 'src/components/ui/ProgressBar/ProgressBar';
import { useProfileHeroTheme } from './ProfileHero.styles';

import { EditProfileDTO, UserProfile } from 'src/types-dtos/user.types';



// Props 
interface ProfileHeroProps {
  profile: UserProfile;
  editMode: boolean;
  saving: boolean;
  draft: EditProfileDTO;
  onEdit: () => void;
  onSave: () => void;
  onDraftChange: (draft: EditProfileDTO) => void;
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
}) => {
  const { theme, styles } = useProfileHeroTheme();

  return (
    <View style={styles.hero}>

      <View style={styles.topBar}>

        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            {profile.privacy.publicProfile
              ? 'Perfil público'
              : 'Perfil privado'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={editMode ? onSave : onEdit}
          style={[
            styles.editButton,
            editMode && styles.editButtonActive,
          ]}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.editButtonText,
            editMode && styles.editButtonTextActive,
          ]}>
            {saving ? 'Guardando...' : editMode ? 'Guardar' : 'Editar'}
          </Text>
        </TouchableOpacity>

      </View>

      <View style={styles.identity}>

        <Avatar
          uri={profile.avatarUrl}
          size={theme.layout.avatarLg}
          showLevelBadge
          level={profile.level.level}
        />

        <View style={styles.nameGroup}>
          {editMode ? (
            <>
              <TextInput
                value={draft.name}
                onChangeText={v => onDraftChange({ ...draft, name: v })}
                style={styles.inputName}
                placeholderTextColor={theme.colors.heroTextSubtle}
                placeholder="Tu nombre"
                maxLength={50}
              />
              <TextInput
                value={draft.nickname}
                onChangeText={v => onDraftChange({ ...draft, nickname: v })}
                style={styles.inputApodo}
                placeholderTextColor={theme.colors.heroTextSubtle}
                placeholder="@apodo"
                maxLength={30}
              />
            </>
          ) : (
            <>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.apodo}>{profile.nickname}</Text>
              <View style={styles.badgeRow}>
                {profile.birthday && (
                  <Badge
                    label={profile.birthday}
                    iconName="gift"
                    color={theme.colors.accentSoft}
                  />
                )}
                <Badge
                  label={`${profile.stats.friendsCount} amigos`}
                  iconName="users"
                  color={theme.colors.accent}
                />
              </View>
            </>
          )}
        </View>

      </View>

      <View style={styles.xpSection}>
        <View style={styles.xpLabelRow}>
          <Text style={styles.xpTitle}>
            {profile.level.title.toUpperCase()}
          </Text>
          <Text style={styles.xpValue}>
            {profile.level.xp}/{profile.level.xpMax} XP
          </Text>
        </View>
        <XPBar
          xp={profile.level.xp}
          xpMax={profile.level.xpMax}
        />
      </View>

    </View>
  );
};