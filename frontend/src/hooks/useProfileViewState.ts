import { useState, useCallback } from 'react';
import { useUserProfile } from 'src/hooks/useUserProfile';
import { EditProfileDTO } from 'src/types-dtos/user.types';
import { ProfileTab } from 'src/screens/ProfileView/ProfileView';

// Hook 
export function useProfileViewState(userId: string, isOwner: boolean) {

    const {
        profile,
        loading,
        saving,
        error,
        updateProfile,
        updatePrivacy,
        updateNotifications,
    } = useUserProfile(userId);

    // UI state 
    const [activeTab, setActiveTab] = useState<ProfileTab>('perfil');
    const [editMode, setEditMode] = useState(false);
    const [following, setFollowing] = useState(false);
    const [draft, setDraft] = useState<EditProfileDTO>({
        name: '',
        nickname: '',
        description: '',
        birthday: '',
    });

    // Handlers
    const handleEdit = useCallback(() => {
        if (!profile) return;
        setDraft({
            name: profile.name,
            nickname: profile.nickname,
            description: profile.description,
            birthday: profile.birthday,
        });
        setEditMode(true);
    }, [profile]);

    const handleSave = useCallback(async () => {
        await updateProfile(draft);
        setEditMode(false);
    }, [draft, updateProfile]);

    const toggleFollow = useCallback(() => {
        setFollowing(f => !f);
    }, []);

    // Hero props, pre-empaquetados para ProfileHero
    const heroProps = profile
        ? {
            profile,
            editMode: editMode && isOwner,
            saving,
            draft,
            onEdit: handleEdit,
            onSave: handleSave,
            onDraftChange: setDraft,
            isOwner,
        }
        : null;

    return {
        // datos
        profile,
        loading,
        saving,
        error,
        // estado UI
        activeTab,
        setActiveTab,
        editMode,
        following,
        draft,
        setDraft,
        // handlers
        handleEdit,
        handleSave,
        toggleFollow,
        // servicios
        updatePrivacy,
        updateNotifications,
        // pre-empaquetados
        heroProps,
    };
}