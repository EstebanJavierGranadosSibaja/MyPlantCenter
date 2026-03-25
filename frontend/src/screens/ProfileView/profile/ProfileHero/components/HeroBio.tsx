import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useProfileHeroTheme } from '../ProfileHero.styles';
import { EditProfileDTO } from 'src/types-dtos/user.types';

interface HeroBioProps {
    description: string;
    editMode: boolean;
    draft: EditProfileDTO;
    onDraftChange: (draft: EditProfileDTO) => void;
}

export const HeroBio: React.FC<HeroBioProps> = ({
    description,
    editMode,
    draft,
    onDraftChange,
}) => {
    const { theme, styles } = useProfileHeroTheme();

    return (
        <View style={styles.bioSection}>
            {editMode ? (
                <TextInput
                    value={draft.description}
                    onChangeText={v => onDraftChange({ ...draft, description: v })}
                    style={styles.bioInput}
                    multiline
                    numberOfLines={3}
                    placeholder="Cuéntanos sobre ti..."
                    placeholderTextColor={theme.colors.textMuted}
                />
            ) : (
                <Text style={styles.bioText}>{description}</Text>
            )}
        </View>
    );
};