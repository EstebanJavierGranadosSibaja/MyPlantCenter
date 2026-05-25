import React from 'react';
import { useProfileViewState } from 'src/features/profile/hooks/useProfileViewState';
import { UserProfile } from 'src/features/profile/types/user.types';
import { ProfileTabs } from '../profile/ProfileTabs/ProfileTabs';
import { TabAjustes } from '../profile/TabAjustes/TabAjustes';
import { TabCategorias } from '../profile/TabCategorias/TabCategorias';
import { TabPerfil } from '../profile/TabPerfil/TabPerfil';
import { ProfileTab } from '../profile/ProfileTabs/ProfileTabs';

// Tabs disponibles según ownership
const OWNER_TABS = ['perfil', 'categorias', 'ajustes'] as const;
const VISITOR_TABS = ['perfil', 'categorias'] as const;

const TAB_LABELS: Record<ProfileTab, string> = {
    perfil: 'Resumen',
    categorias: 'Categorías',
    ajustes: 'Ajustes',
};

// Props 
interface ProfileViewTabsProps {
    isOwner: boolean;
    profile: UserProfile;
    state: ReturnType<typeof useProfileViewState>;
}

// Componente 
export const ProfileViewTabs: React.FC<ProfileViewTabsProps> = ({
    isOwner,
    profile,
    state,
}) => {
    const availableTabs = (isOwner ? OWNER_TABS : VISITOR_TABS).map(key => ({
        key,
        label: TAB_LABELS[key],
    }));

    return (
        <>
            <ProfileTabs
                active={state.activeTab}
                onChange={tab => {
                    if (availableTabs.some(t => t.key === tab)) {
                        if (state.editMode && tab !== 'perfil') {
                            state.handleCancelEdit();
                        }
                        state.setActiveTab(tab);
                    }
                }}
                tabs={availableTabs}
            />

            {state.activeTab === 'perfil' && (
                <TabPerfil
                    profile={profile}
                    editMode={state.editMode && isOwner}
                    onProfileSaved={state.handleProfileUpdated}
                />
            )}

            {state.activeTab === 'categorias' && (
                <TabCategorias profile={profile} />
            )}

            {state.activeTab === 'ajustes' && isOwner && (
                <TabAjustes
                    profile={profile}
                    onUpdatePrivacy={state.updatePrivacy}
                    onUpdateNotifications={state.updateNotifications}
                />
            )}
        </>
    );
};