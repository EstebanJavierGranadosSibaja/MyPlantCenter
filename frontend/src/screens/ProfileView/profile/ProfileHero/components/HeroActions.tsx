import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
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
            <TouchableOpacity
                style={styles.actionButtonPrimary}
                onPress={editMode ? onSave : onEdit}
                activeOpacity={0.8}
                disabled={saving}
                accessibilityLabel={editMode ? 'Guardar perfil' : 'Editar perfil'}
                accessibilityRole="button"
            >
                <Feather
                    name={editMode ? 'check' : 'edit-2'}
                    size={theme.typography.size.md}
                    color={theme.colors.accentSoft}
                />
                <Text style={styles.actionButtonTextPrimary}>
                    {saving ? 'Guardando...' : editMode ? 'Guardar' : 'Editar perfil'}
                </Text>
            </TouchableOpacity>

            {/* Botón secundario — compartir */}
            {!editMode && (
                <TouchableOpacity
                    style={styles.actionButtonSecondary}
                    activeOpacity={0.8}
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
                </TouchableOpacity>
            )}

        </View>
    );
};