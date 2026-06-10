import { useState } from 'react';
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
    } = useUserProfile(userId, isOwner);

    // UI state
    const [activeTab, setActiveTab] = useState<ProfileTab>('perfil');

    // Hero props, pre-empaquetados para ProfileHero. La edición ahora es una
    // pantalla aparte (ruta EditProfile), no un modo embebido.
    const heroProps = profile
        ? { profile, isOwner }
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
        // servicios
        fetchProfile,
        updatePrivacy,
        updateNotifications,
        // pre-empaquetados
        heroProps,
    };
}
