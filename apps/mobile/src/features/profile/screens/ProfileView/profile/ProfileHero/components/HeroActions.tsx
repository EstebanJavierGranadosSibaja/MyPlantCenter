import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useProfileHeroTheme } from '../ProfileHero.styles';

// ─────────────────────────────────────────────────────────────────────────────

interface HeroActionsProps {
  isOwner: boolean;
  editMode: boolean;
  saving: boolean;
  onEdit: () => void;
  onSave: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────

const DISABLED_OPACITY = 0.45;

// ─────────────────────────────────────────────────────────────────────────────

export const HeroActions: React.FC<HeroActionsProps> = ({
  isOwner,
  editMode,
  saving,
  onEdit,
  onSave,
}) => {
  const { theme, styles } = useProfileHeroTheme();

  if (!isOwner) return null;

  return (
    <View style={styles.actionsSection}>

      {/* Primary — edit / cancel */}
      <Pressable
        style={({ pressed }) => [
          styles.actionButtonPrimary,
          pressed && !saving && styles.actionButtonPrimaryPressed,
          saving && { opacity: DISABLED_OPACITY },
        ]}
        onPress={editMode ? onSave : onEdit}
        disabled={saving}
        accessibilityLabel={editMode ? 'Cancelar edición de perfil' : 'Editar perfil'}
        accessibilityRole="button"
      >
        <Feather
          name={editMode ? 'x' : 'edit-2'}
          size={theme.text.bodyMd.fontSize}
          color={theme.colors.textOnAccent}
        />
        <Text style={styles.actionButtonTextPrimary}>
          {saving ? 'Guardando…' : editMode ? 'Cancelar' : 'Editar perfil'}
        </Text>
      </Pressable>

      {/* Secondary — share (only when not editing) */}
      {!editMode && (
        <Pressable
          style={({ pressed }) => [
            styles.actionButtonSecondary,
            pressed && styles.actionButtonSecondaryPressed,
          ]}
          accessibilityLabel="Compartir perfil"
          accessibilityRole="button"
        >
          <Feather
            name="share-2"
            size={theme.text.bodyMd.fontSize}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.actionButtonTextSecondary}>Compartir</Text>
        </Pressable>
      )}

    </View>
  );
};
