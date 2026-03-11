import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { StatRow } from 'src/components/common/StatRow/StatRow';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { useUserProfile } from 'src/hooks/useUserProfile';
import { EditProfileDTO } from 'src/types-dtos/user.types';
import { ProfileHero } from './components/ProfileHero/ProfileHero';
import { ProfileTab, ProfileTabs } from './components/ProfileTabs/ProfileTabs';
import { TabAjustes } from './components/TabAjustes/TabAjustes';
import { TabCategorias } from './components/TabCategorias/TabCategorias';
import { TabPerfil } from './components/TabPerfil/TabPerfil';
import { useProfileTheme } from './UserProfile.styles';
import { CustomSafeArea } from 'src/components/layout/CustomSaveArea';

export const UserProfile: React.FC = () => {
    const { theme, styles } = useProfileTheme();

    // Datos
    const {
        profile,
        loading,
        saving,
        error,
        updateProfile,
        updatePrivacy,
        updateNotifications,
    } = useUserProfile('user-001');

    // Estado local de UI 
    const [activeTab, setActiveTab] = useState<ProfileTab>('perfil');
    const [editMode, setEditMode] = useState(false);
    const [draft, setDraft] = useState<EditProfileDTO>({
        name: '',
        nickname: '',
        description: '',
        birthday: '',
    });

    const handleEdit = () => {
        if (!profile) return;
        setDraft({
            name: profile.name,
            nickname: profile.nickname,
            description: profile.description,
            birthday: profile.birthday,
        });
        setEditMode(true);
    };

    const handleSave = async () => {
        await updateProfile(draft);
        setEditMode(false);
    };

    // Loading 
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator
                    size="large"
                    color={theme.colors.accent}
                />
                <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
        );
    }

    // Error 
    if (error || !profile) {
        return (
            <View style={styles.centered}>
                <Feather name="alert-circle" size={theme.typography.size['5xl']} color={theme.colors.error} />
                <Text style={styles.errorText}>
                    {error ?? 'No se pudo cargar el perfil.'}
                </Text>
            </View>
        );
    }

    // Stats para StatRow 
    const statItems = [
        { iconName: 'feather' as const, value: profile.stats.plantsCount, label: 'Plantas' },
        { iconName: 'users' as const, value: profile.stats.friendsCount, label: 'Amigos' },
        { iconName: 'zap' as const, value: profile.stats.streak, label: 'Racha' },
        { iconName: 'droplet' as const, value: profile.stats.wateredToday, label: 'Rocios' },
    ];

    // Render
    return (
        <CustomSafeArea scroll>

            <AppHeader title="Mi Perfil" subtitle="MyPlantCenter" showBack={true} />

            <ProfileHero
                profile={profile}
                editMode={editMode}
                saving={saving}
                draft={draft}
                onEdit={handleEdit}
                onSave={handleSave}
                onDraftChange={setDraft}
            />

            <View style={styles.statsCard}>
                <StatRow items={statItems} />
            </View>

            <ProfileTabs active={activeTab} onChange={setActiveTab} />

            {activeTab === 'perfil' && <TabPerfil profile={profile} editMode={editMode} saving={saving} draft={draft} onDraftChange={setDraft} onSave={handleSave} />}
            {activeTab === 'categorias' && <TabCategorias profile={profile} />}
            {activeTab === 'ajustes' && <TabAjustes profile={profile} onUpdatePrivacy={updatePrivacy} onUpdateNotifications={updateNotifications} />}

        </CustomSafeArea>
    );
};