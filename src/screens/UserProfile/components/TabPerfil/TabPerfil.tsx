import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { EditProfileDTO, UserProfile } from 'src/types-dtos/user.types';
import { useTabPerfilTheme } from './TabPerfil.styles';


interface TabPerfilProps {
  profile:       UserProfile;
  editMode:      boolean;
  saving:        boolean;
  draft:         EditProfileDTO;
  onDraftChange: (draft: EditProfileDTO) => void;
  onSave:        () => void;
}

export const TabPerfil: React.FC<TabPerfilProps> = ({
  profile,
  editMode,
  saving,
  draft,
  onDraftChange,
  onSave,
}) => {
  const { theme, styles } = useTabPerfilTheme();

  return (
    <View style={styles.container}>

      {/* ── Descripción ── */}
      <View>
        <Text style={styles.sectionTitle}>Sobre mí</Text>
        {editMode ? (
          <TextInput
            value={draft.description}
            onChangeText={v => onDraftChange({ ...draft, description: v })}
            style={styles.descriptionInput}
            multiline
            numberOfLines={4}
            placeholder="Cuéntanos sobre ti..."
            placeholderTextColor={theme.colors.textMuted}
          />
        ) : (
          <Text style={styles.descriptionText}>
            "{profile.description}"
          </Text>
        )}
      </View>

      {/* ── Planta favorita ── */}
      {profile.favoritePlant && (
        <View>
          <Text style={styles.sectionTitle}>Planta favorita</Text>
          <View style={styles.favPlantCard}>
            <View style={styles.favPlantIcon}>
              <Feather
                name={profile.favoritePlant.iconName}
                size={theme.typography.size['3xl']}
                color={theme.colors.accent}
              />
            </View>
            <View style={styles.favPlantInfo}>
              <Text style={styles.favPlantName}>
                {profile.favoritePlant.name}
              </Text>
              <Text style={styles.favPlantCategoria}>
                {profile.favoritePlant.category}
              </Text>
            </View>
            <Feather
              name="heart"
              size={theme.typography.size['2xl']}
              color={theme.colors.accent}
            />
          </View>
        </View>
      )}

      {/* ── Cumpleaños ── */}
      {profile.birthday && (
        <View>
          <Text style={styles.sectionTitle}>Cumpleaños</Text>
          <View style={styles.birthdayRow}>
            <Feather
              name="gift"
              size={theme.typography.size['2xl']}
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
      <View>
        <Text style={styles.sectionTitle}>Logros</Text>
        <View style={styles.logrosRow}>
          {profile.achievements.map(achievement => (
            <View
              key={achievement.id}
              style={[
                styles.logroItem,
                {
                  backgroundColor: achievement.unlocked
                    ? theme.colors.logroActiveBg
                    : theme.colors.cardBg,
                  borderColor: achievement.unlocked
                    ? theme.colors.logroActiveBorder
                    : theme.colors.border,
                  opacity: achievement.unlocked ? 1 : 0.45,
                },
              ]}
            >
              <Feather
                name={achievement.iconName}
                size={theme.typography.size['2xl']}
                color={achievement.unlocked ? theme.colors.accent : theme.colors.textMuted}
              />
            </View>
          ))}
        </View>
      </View>

      {/* ── Botón guardar ── */}
      {editMode && (
        <View
          style={styles.saveButton}
          onTouchEnd={onSave}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Text>
        </View>
      )}

    </View>
  );
};