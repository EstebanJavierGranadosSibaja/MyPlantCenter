import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';

import { Avatar }   from '../../../components/ui/Avatar/Avatar';
import { Badge }    from '../../../components/ui/Badge/Badge';
import { XPBar }    from '../../../components/ui/ProgressBar/ProgressBar';

import { colors }          from '../../../theme/colors';
import { textStyles }      from '../../../theme/typography';
import { radius, spacing, layout } from '../../../theme/spacing';

import { UserProfile, EditProfileDTO } from '../../../types-dtos/user.types';

// ── Props ─────────────────────────────────────────────────────────────────────

interface ProfileHeroProps {
  profile:       UserProfile;
  editMode:      boolean;
  saving:        boolean;
  draft:         EditProfileDTO;
  onEdit:        () => void;
  onSave:        () => void;
  onDraftChange: (draft: EditProfileDTO) => void;
}

// ── Componente ────────────────────────────────────────────────────────────────

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  profile,
  editMode,
  saving,
  draft,
  onEdit,
  onSave,
  onDraftChange,
}) => {
  return (
    <View style={styles.hero}>

      {/* ── Barra superior ── */}
      <View style={styles.topBar}>

        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            {profile.privacidad.perfilPublico
              ? 'Perfil público'
              : 'Perfil privado'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={editMode ? onSave : onEdit}
          style={[styles.editButton, editMode && styles.editButtonActive]}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.editButtonText,
            editMode && styles.editButtonTextActive,
          ]}>
            {saving ? 'Guardando...' : editMode ? '✓ Guardar' : '✏️ Editar'}
          </Text>
        </TouchableOpacity>

      </View>

      {/* ── Avatar + identidad ── */}
      <View style={styles.identity}>

        <Avatar
          emoji="🌿"
          uri={profile.avatarUrl}
          size={80}
          showLevelBadge
          level={profile.nivel.nivel}
        />

        <View style={styles.nameGroup}>
          {editMode ? (
            <>
              <TextInput
                value={draft.nombre}
                onChangeText={v => onDraftChange({ ...draft, nombre: v })}
                style={[styles.input, styles.inputName]}
                placeholderTextColor={colors.heroTextSubtle}
                placeholder="Tu nombre"
              />
              <TextInput
                value={draft.apodo}
                onChangeText={v => onDraftChange({ ...draft, apodo: v })}
                style={[styles.input, styles.inputApodo]}
                placeholderTextColor={colors.heroTextSubtle}
                placeholder="@apodo"
              />
            </>
          ) : (
            <>
              <Text style={styles.name}>{profile.nombre}</Text>
              <Text style={styles.apodo}>{profile.apodo}</Text>
              <View style={styles.badgeRow}>
                {profile.cumpleanos && (
                  <Badge
                    label={profile.cumpleanos}
                    emoji="🎂"
                    color={colors.accentSoft}
                  />
                )}
                <Badge
                  label={`${profile.stats.cantidadAmigos} amigos`}
                  emoji="👥"
                  color={colors.accent}
                />
              </View>
            </>
          )}
        </View>

      </View>

      {/* ── Barra de XP ── */}
      <View style={styles.xpSection}>
        <View style={styles.xpLabelRow}>
          <Text style={styles.xpTitle}>
            {profile.nivel.titulo.toUpperCase()}
          </Text>
          <Text style={styles.xpValue}>
            {profile.nivel.xp}/{profile.nivel.xpMax} XP
          </Text>
        </View>
        <XPBar
          xp    ={profile.nivel.xp}
          xpMax ={profile.nivel.xpMax}
        />
      </View>

    </View>
  );
};

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  hero: {
    backgroundColor:   colors.heroBg,
    paddingTop:        layout.heroPaddingV,
    paddingBottom:     layout.heroPaddingB,
    paddingHorizontal: layout.screenH,
    overflow:          'hidden',
  },
  topBar: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   spacing[6],
  },
  statusRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing[2],
  },
  statusDot: {
    width:           spacing[2],    // 8
    height:          spacing[2],    // 8
    borderRadius:    spacing[1],    // 4 — círculo perfecto
    backgroundColor: colors.accentSoft,
  },
  statusText: {
    ...textStyles.caption,
    color: colors.heroTextSubtle,
  },
  editButton: {
    borderRadius:      radius.sm,
    paddingHorizontal: spacing[3],
    paddingVertical:   spacing[1] + 3,   // 7
    borderWidth:       1,
    borderColor:       colors.heroAccentMuted,
  },
  editButtonActive: {
    backgroundColor: colors.accentSoft,
    borderColor:     colors.accentSoft,
  },
  editButtonText: {
    ...textStyles.label,
    color: colors.heroAccent,
  },
  editButtonTextActive: {
    color: colors.primary,
  },
  identity: {
    flexDirection: 'row',
    gap:           spacing[4] + 2,
    alignItems:    'flex-start',
  },
  nameGroup: {
    flex: 1,
  },
  name: {
    ...textStyles.heroTitle,
    color:        colors.heroText,
    marginBottom: spacing[1],
  },
  apodo: {
    ...textStyles.body,
    color:        colors.accentSoft,
    marginBottom: spacing[3],
    fontWeight:   '400',
  },
  badgeRow: {
    flexDirection: 'row',
    gap:           spacing[2],
    flexWrap:      'wrap',
  },
  input: {
    borderWidth:       1.5,
    borderRadius:      radius.sm,
    paddingHorizontal: spacing[3],
    paddingVertical:   spacing[2],
    marginBottom:      spacing[2],
  },
  inputName: {
    ...textStyles.inputName,
    backgroundColor: colors.heroInputBg,
    borderColor:     colors.heroInputBorder,
    color:           colors.heroText,
  },
  inputApodo: {
    ...textStyles.body,
    backgroundColor: colors.heroInputBgSubtle,
    borderColor:     colors.heroInputBorderSubtle,
    color:           colors.accentSoft,
  },
  xpSection: {
    marginTop: spacing[5],
  },
  xpLabelRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginBottom:   spacing[1] + 2,   // 6
  },
  xpTitle: {
    ...textStyles.caption,
    color: colors.accentSoft,
  },
  xpValue: {
    ...textStyles.caption,
    color: colors.accent,
  },
});