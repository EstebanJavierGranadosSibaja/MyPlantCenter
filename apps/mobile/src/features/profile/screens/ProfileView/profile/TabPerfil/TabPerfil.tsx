import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { UserProfile } from 'src/features/profile/types/user.types';
import { EmptyState } from 'src/shared/components/feedback/EmptyState/EmptyState';
import { EditProfileV2 as EditProfile } from '../../../EditProfile/EditProfileV2';
import { useTabPerfilTheme } from './TabPerfil.styles';

// ─────────────────────────────────────────────────────────────────────────────

interface TabPerfilProps {
  profile: UserProfile;
  editMode: boolean;
  onProfileSaved: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────

const DISABLED_OPACITY = 0.45;

// ─────────────────────────────────────────────────────────────────────────────

export const TabPerfil: React.FC<TabPerfilProps> = ({
  profile,
  editMode,
  onProfileSaved,
}) => {
  const { theme, styles } = useTabPerfilTheme();

  if (editMode) {
    return (
      <EditProfile
        userId={profile.id}
        onSaved={onProfileSaved}
      />
    );
  }

  return (
    <View style={styles.container}>

      {/* ── Planta favorita ── */}
      {profile.favoritePlant && (
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Planta favorita</Text>
          <View style={styles.favPlantCard}>
            <View style={styles.favPlantIcon}>
              <Feather
                name={profile.favoritePlant.iconName}
                size={theme.text.h1.fontSize}
                color={theme.colors.accent}
              />
            </View>
            <View style={styles.favPlantInfo}>
              <Text style={styles.favPlantName}>{profile.favoritePlant.name}</Text>
              <Text style={styles.favPlantCategoria}>{profile.favoritePlant.category}</Text>
            </View>
            <Feather
              name="heart"
              size={theme.text.h2.fontSize}
              color={theme.colors.textOnAccent}
            />
          </View>
        </View>
      )}

      {/* ── Cumpleaños ── */}
      {profile.birthday && (
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Cumpleaños</Text>
          <View style={styles.birthdayRow}>
            <Feather
              name="gift"
              size={theme.text.h2.fontSize}
              color={theme.colors.accent}
            />
            <View>
              <Text style={styles.birthdayLabel}>Fecha especial</Text>
              <Text style={styles.birthdayValue}>{profile.birthday}</Text>
            </View>
          </View>
        </View>
      )}

      {/* ── Logros ── */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>Logros</Text>
        {profile.achievements.length === 0 ? (
          <View style={styles.sectionCard}>
            <EmptyState
              iconName="award"
              title="Sin logros aún"
              subtitle="Completa acciones para desbloquear logros"
            />
          </View>
        ) : (
          <View style={styles.logrosPanel}>
            <View style={styles.logrosRow}>
              {profile.achievements.map(logro => (
                <View
                  key={logro.id}
                  style={[
                    styles.logroItem,
                    {
                      backgroundColor: logro.unlocked
                        ? theme.colors.accentSoft
                        : theme.colors.surface,
                      borderColor: logro.unlocked
                        ? theme.colors.accentMuted
                        : theme.colors.borderDefault,
                      opacity: logro.unlocked ? 1 : DISABLED_OPACITY,
                    },
                  ]}
                >
                  <Text style={styles.logroEmoji}>{logro.emoji}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

    </View>
  );
};
