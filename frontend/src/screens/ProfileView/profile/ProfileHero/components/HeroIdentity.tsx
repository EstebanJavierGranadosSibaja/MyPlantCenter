import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useProfileHeroTheme } from '../ProfileHero.styles';
import { UserProfile, EditProfileDTO } from 'src/types-dtos/user.types';

interface HeroIdentityProps {
    profile: UserProfile;
    editMode: boolean;
    draft: EditProfileDTO;
    onDraftChange: (draft: EditProfileDTO) => void;
}

export const HeroIdentity: React.FC<HeroIdentityProps> = ({
    profile,
    editMode,
    draft,
    onDraftChange,
}) => {
    const { theme, styles } = useProfileHeroTheme();

    return (
        <View style={styles.identitySection}>

            {editMode ? (
                <>
                    <TextInput
                        value={draft.name}
                        onChangeText={v => onDraftChange({ ...draft, name: v })}
                        style={styles.displayName}
                        placeholderTextColor={theme.colors.textMuted}
                        placeholder="Tu nombre"
                    />
                    <TextInput
                        value={draft.nickname}
                        onChangeText={v => onDraftChange({ ...draft, nickname: v })}
                        style={styles.nickname}
                        placeholderTextColor={theme.colors.textMuted}
                        placeholder="@apodo"
                    />
                </>
            ) : (
                <>
                    <Text style={styles.displayName}>{profile.name}</Text>
                    <Text style={styles.nickname}>{profile.nickname}</Text>
                </>
            )}

            {/* Título del nivel */}
            <View style={styles.levelTitle}>
                <Feather
                    name="award"
                    size={theme.typography.size.base}
                    color={theme.colors.accent}
                />
                <Text style={styles.levelTitleText}>
                    {profile.level.title}
                </Text>
            </View>

        </View>
    );
};