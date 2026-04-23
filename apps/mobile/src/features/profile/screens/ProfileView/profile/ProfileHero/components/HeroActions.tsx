import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useProfileHeroTheme } from '../ProfileHero.styles';

interface HeroActionsProps {
    isOwner: boolean;
    editMode: boolean;
    saving: boolean;
    onEdit: () => void;
    onSave: () => void;
}

export const HeroActions: React.FC<HeroActionsProps> = ({
    isOwner,
    editMode,
    saving,
    onEdit,
    onSave,
}) => {
    const { theme, styles } = useProfileHeroTheme();

    if (!isOwner) return null;
    // visitante no ve acciones de edición

    return (
        <View style={styles.actionsSection}>

            {/* Botón principal */}
            <Pressable
                style={({ pressed }) => [
                    styles.actionButtonPrimary,
                    pressed && !saving && styles.actionButtonPrimaryPressed,
                    saving && { opacity: theme.opacity.disabled },
                ]}
                onPress={editMode ? onSave : onEdit}
                disabled={saving}
                accessibilityLabel={editMode ? 'Cancelar edicion de perfil' : 'Editar perfil'}
                accessibilityRole="button"
            >
                <Feather
                    name={editMode ? 'x' : 'edit-2'}
                    size={theme.typography.size.md}
                    color={theme.colors.textInverse}
                />
                <Text style={styles.actionButtonTextPrimary}>
                    {saving ? 'Guardando...' : editMode ? 'Cancelar' : 'Editar perfil'}
                </Text>
            </Pressable>

            {/* Botón secundario — compartir */}
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
                        size={theme.typography.size.md}
                        color={theme.colors.textSecondary}
                    />
                    <Text style={styles.actionButtonTextSecondary}>
                        Compartir
                    </Text>
                </Pressable>
            )}

        </View>
    );
};