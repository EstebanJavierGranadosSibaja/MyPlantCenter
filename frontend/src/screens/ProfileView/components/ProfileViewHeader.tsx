import React from 'react';
import { AppHeader } from 'src/components/navigation/AppHeader/AppHeader';
import { FollowButton } from './FollowButton';
import { UserProfile } from 'src/types-dtos/user.types';

interface ProfileViewHeaderProps {
    isOwner: boolean;
    profile: UserProfile;
    following: boolean;
    onToggleFollow: () => void;
}

export const ProfileViewHeader: React.FC<ProfileViewHeaderProps> = ({
    isOwner,
    profile,
    following,
    onToggleFollow,
}) => {
    return (
        <AppHeader
            title={isOwner ? 'Mi Perfil' : profile.name}
            subtitle="MyPlantCenter"
            showBack={!isOwner}
            right={!isOwner ? (
                <FollowButton
                    following={following}
                    onToggle={onToggleFollow}
                />
            ) : undefined}
        />
    );
};