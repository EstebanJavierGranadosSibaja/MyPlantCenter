import { useState, useCallback } from 'react';
import { useUserProfile } from 'src/features/profile/hooks/useUserProfile';
import { ProfileTab } from 'src/features/profile/screens/ProfileView/profile/ProfileTabs/ProfileTabs';

// Hook 
export function useProfileViewState(userId: string, isOwner: boolean) {

    const {
        profile,
        loading,
        saving,
        error,
        fetchProfile,
        updatePrivacy,
        updateNotifications,
    } = useUserProfile(userId);

    // UI state
    const [activeTab, setActiveTab] = useState<ProfileTab>('perfil');
    const [editMode, setEditMode] = useState(false);

    // Handlers
    const handleEdit = useCallback(() => {
        setActiveTab('perfil');
        setEditMode(true);
    }, []);

    const handleProfileUpdated = useCallback(async () => {
        await fetchProfile();
        setEditMode(false);
    }, [fetchProfile]);

    const handleCancelEdit = useCallback(() => {
        setEditMode(false);
    }, []);

    // Hero props, pre-empaquetados para ProfileHero
    const heroProps = profile
        ? {
            profile,
            editMode: editMode && isOwner,
            saving,
            onEdit: handleEdit,
            onSave: handleCancelEdit,
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
        // handlers
        handleEdit,
        handleProfileUpdated,
        handleCancelEdit,
        // servicios
        updatePrivacy,
        updateNotifications,
        // pre-empaquetados
        heroProps,
    };
}