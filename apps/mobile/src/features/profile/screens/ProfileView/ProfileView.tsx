import React from 'react';
import { CustomSafeArea } from 'src/shared/components/layout/CustomSafeArea';
import { useProfileViewState } from 'src/features/profile/hooks/useProfileViewState';
import { ProfileViewHeader } from './components/ProfileViewHeader';
import { ProfileHero } from './profile/ProfileHero/ProfileHero';
import { ProfileViewStates } from './components/ProfileViewStates';
import { ProfileViewTabs } from './components/ProfileViewTabs';

export type ProfileTab = 'perfil' | 'categorias' | 'ajustes';

export interface ProfileViewProps {
    userId: string;
    isOwner: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userId, isOwner }) => {
    const state = useProfileViewState(userId, isOwner);

    // Estados especiales
    if (state.loading) {
        return <ProfileViewStates.Loading isOwner={isOwner} />;
    }

    if (!state.profile || !state.heroProps) {
        return <ProfileViewStates.Error isOwner={isOwner} error={state.error} />;
    }

    // Render 
    return (
        <CustomSafeArea scroll keyboardAvoiding scrollBottomInset={132}>

            <ProfileViewHeader
                isOwner={isOwner}
                profile={state.profile}
                following={state.following}
                onToggleFollow={state.toggleFollow}
            />

            <ProfileHero {...state.heroProps} />

            <ProfileViewTabs
                isOwner={isOwner}
                profile={state.profile}
                state={state}
            />

        </CustomSafeArea>
    );
};