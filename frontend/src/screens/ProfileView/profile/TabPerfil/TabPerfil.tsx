import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { EditProfileDTO, UserProfile } from 'src/types-dtos/user.types';
import { useTabPerfilTheme } from './TabPerfil.styles';


interface TabPerfilProps {
  profile: UserProfile;
  editMode: boolean;
  saving: boolean;
  draft: EditProfileDTO;
  onDraftChange: (draft: EditProfileDTO) => void;
  onSave: () => void;
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
          {profile.achievements.map(logro => (
            <View
              key={logro.id}
              style={[
                styles.logroItem,
                {
                  backgroundColor: logro.unlocked
                    ? theme.colors.logroActiveBg
                    : theme.colors.cardBg,
                  borderColor: logro.unlocked
                    ? theme.colors.logroActiveBorder
                    : theme.colors.border,
                  opacity: logro.unlocked ? 1 : theme.opacity.disabled,
                },
              ]}
            >
              <Text style={styles.logroEmoji}>{logro.emoji}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Botón guardar ── */}
      {editMode && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={onSave}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Guardar cambios del perfil"
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Text>
        </TouchableOpacity>
      )}

    </View>
  );
};