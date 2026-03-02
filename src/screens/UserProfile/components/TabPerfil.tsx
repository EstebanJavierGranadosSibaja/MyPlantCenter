import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Badge } from '../../../components/ui/Badge/Badge';

import { colors }               from '../../../theme/colors';
import { textStyles }           from '../../../theme/typography';
import { radius, spacing, layout } from '../../../theme/spacing';

import { UserProfile, EditProfileDTO } from '../../../types-dtos/user.types';

// ── Props ─────────────────────────────────────────────────────────────────────

interface TabPerfilProps {
  profile:       UserProfile;
  editMode:      boolean;
  saving:        boolean;
  draft:         EditProfileDTO;
  onDraftChange: (draft: EditProfileDTO) => void;
  onSave:        () => void;
}

// ── Componente ────────────────────────────────────────────────────────────────

export const TabPerfil: React.FC<TabPerfilProps> = ({
  profile,
  editMode,
  saving,
  draft,
  onDraftChange,
  onSave,
}) => {
  return (
    <>
      {/* ── Descripción ── */}
      <View style={styles.section}>
        <SectionHeader title="Sobre mí" />

        {editMode ? (
          <TextInput
            value={draft.descripcion}
            onChangeText={v => onDraftChange({ ...draft, descripcion: v })}
            style={styles.descriptionInput}
            multiline
            numberOfLines={3}
            placeholder="Escribe sobre ti..."
            placeholderTextColor={colors.textMuted}
          />
        ) : (
          <Text style={styles.descriptionText}>
            {profile.descripcion}
          </Text>
        )}
      </View>

      <SectionDivider />

      {/* ── Planta favorita ── */}
      {profile.plantaFavorita && (
        <>
          <View style={styles.section}>
            <SectionHeader title="Planta favorita" />
            <View style={styles.favPlantCard}>

              <View style={styles.favPlantIcon}>
                <Text style={styles.favPlantEmoji}>
                  {profile.plantaFavorita.emoji}
                </Text>
              </View>

              <View style={styles.favPlantInfo}>
                <Text style={styles.favPlantName}>
                  {profile.plantaFavorita.nombre}
                </Text>
                <Badge
                  label={profile.plantaFavorita.categoria}
                  color={colors.accentSoft}
                />
              </View>

              <Text style={styles.favHeart}>❤️</Text>

            </View>
          </View>
          <SectionDivider />
        </>
      )}

      {/* ── Cumpleaños ── */}
      <View style={styles.section}>
        <SectionHeader title="Cumpleaños" />

        {editMode ? (
          <TextInput
            value={draft.cumpleanos ?? ''}
            // ?? '' porque TextInput no acepta undefined
            onChangeText={v => onDraftChange({ ...draft, cumpleanos: v })}
            style={styles.textInput}
            placeholder="ej: 14 de Marzo"
            placeholderTextColor={colors.textMuted}
          />
        ) : (
          <View style={styles.birthdayRow}>
            <Text style={styles.birthdayEmoji}>🎂</Text>
            <View>
              <Text style={styles.birthdayLabel}>
                Fecha de nacimiento
              </Text>
              <Text style={styles.birthdayValue}>
                {profile.cumpleanos ?? '—'}
                {/* ?? '—' muestra un guión si no tiene cumpleaños */}
              </Text>
            </View>
          </View>
        )}
      </View>

      <SectionDivider />

      {/* ── Logros ── */}
      <View style={styles.section}>
        <SectionHeader title="Logros desbloqueados" />
        <View style={styles.logrosRow}>
          {profile.logros.map(logro => (
            <View
              key={logro.id}
              style={[
                styles.logroItem,
                {
                  backgroundColor: logro.ganado
                    ? colors.logroActiveBg
                    : colors.cardBg,
                  borderColor: logro.ganado
                    ? colors.logroActiveBorder
                    : colors.border,
                  opacity: logro.ganado ? 1 : 0.35,
                  // los logros bloqueados se ven apagados
                },
              ]}
            >
              <Text style={styles.logroEmoji}>{logro.emoji}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Botón guardar — solo visible en modo edición ── */}
      {editMode && (
        <>
          <SectionDivider />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={onSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Guardando...' : '✓ Guardar cambios'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </>
  );
};

// ── Componentes internos ──────────────────────────────────────────────────────
// Solo los usa TabPerfil, por eso viven aquí

const SectionDivider = () => <View style={styles.divider} />;

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
);

// ── Estilos ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: layout.screenH,
    paddingVertical:   spacing[5],
  },
  divider: {
    height:           1,
    marginHorizontal: layout.screenH,
    backgroundColor:  colors.border,
  },
  sectionTitle: {
    ...textStyles.caption,
    color:        colors.textMuted,
    marginBottom: spacing[3] + 2,
  },

  // Descripción
  descriptionText: {
    ...textStyles.body,
    color:      colors.textSecondary,
    fontStyle:  'italic',
    lineHeight: 22,
  },
  descriptionInput: {
    ...textStyles.body,
    color:             colors.textPrimary,
    backgroundColor:   colors.cardBg,
    borderWidth:       1.5,
    borderColor:       colors.border,
    borderRadius:      radius.md,
    paddingHorizontal: spacing[3] + 2,
    paddingVertical:   spacing[3],
    lineHeight:        22,
    textAlignVertical: 'top',
  },
  textInput: {
    ...textStyles.body,
    color:             colors.textPrimary,
    backgroundColor:   colors.cardBg,
    borderWidth:       1.5,
    borderColor:       colors.border,
    borderRadius:      radius.sm,
    paddingHorizontal: spacing[3] + 2,
    paddingVertical:   spacing[3] - 1,
  },

  // Planta favorita
  favPlantCard: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             spacing[4],
    backgroundColor: colors.primary,
    borderRadius:    radius.lg,
    padding:         spacing[4] + 2,
  },
  favPlantIcon: {
    width:           spacing[14],    // 56
    height:          spacing[14],    // 56
    borderRadius:    radius.md,
    backgroundColor: colors.favPlantIconBg,
    alignItems:      'center',
    justifyContent:  'center',
  },
  favPlantEmoji: {
    fontSize:   30,
    lineHeight: 36,
  },
  favPlantInfo: {
    flex: 1,
    gap:  spacing[1] + 2,   // 6
  },
  favPlantName: {
    ...textStyles.plantName,
    color:    colors.heroText,
    fontSize: spacing[4],   // 16
  },
  favHeart: {
    fontSize: spacing[5],   // 20
  },

  // Cumpleaños
  birthdayRow: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             spacing[3],
    backgroundColor: colors.cardBg,
    borderRadius:    radius.md,
    padding:         spacing[4],
    borderWidth:     1.5,
    borderColor:     colors.border,
  },
  birthdayEmoji: {
    fontSize:   spacing[6],    // 24
    lineHeight: spacing[7],    // 28
  },
  birthdayLabel: {
    ...textStyles.birthdayLabel,
    color:        colors.textMuted,
    marginBottom: spacing[1] - 2,   // 2
  },
  birthdayValue: {
    ...textStyles.birthdayValue,
    color: colors.textPrimary,
  },

  // Logros
  logrosRow: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           spacing[2],
  },
  logroItem: {
    width:          spacing[12] + 4,   // 52
    height:         spacing[12] + 4,   // 52
    borderRadius:   radius.md,
    borderWidth:    1.5,
    alignItems:     'center',
    justifyContent: 'center',
  },
  logroEmoji: {
    fontSize:   spacing[6],    // 24
    lineHeight: spacing[7],    // 28
  },

  // Botón guardar
  saveButton: {
    backgroundColor:  colors.primary,
    borderRadius:     radius.md,
    paddingVertical:  spacing[4] - 1,
    alignItems:       'center',
    marginHorizontal: layout.screenH,
    marginVertical:   spacing[5],
  },
  saveButtonText: {
    ...textStyles.buttonLabel,
    color:         colors.accentSoft,
    letterSpacing: spacing[1] - 3.4,   // 0.6
  },
});